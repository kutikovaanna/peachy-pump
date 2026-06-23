import {
  EXERCISE_LIBRARY,
  ACCESSORY_LIBRARY,
  EXERCISE_FAMILY,
  PATTERNS,
  ANTAGONIST_PAIRS,
  MUSCLE_GROUPS,
} from "./exercises.js";

// ─────────────────────────────────────────────────────────────
// MESOCYCLE CONFIG
// ─────────────────────────────────────────────────────────────

export const WEEK_CONFIGS = [
  { label: "Akumulace",  weightPct: 1.0, reps: { compound: "6-8",  isolation: "10-12" }, setsBonus: 0,  deload: false },
  { label: "Zesilování", weightPct: 1.0, reps: { compound: "4-6",  isolation: "8-10"  }, setsBonus: 0,  deload: false },
  { label: "Peak",       weightPct: 1.0, reps: { compound: "2-4",  isolation: "6-8"   }, setsBonus: 1,  deload: false },
  { label: "Deload",     weightPct: 0.6, reps: { compound: "8-10", isolation: "12-15" }, setsBonus: -1, deload: true  },
];

export function getCycleInfo(cycle) {
  if (!cycle?.startDate) {
    return { week: 1, label: WEEK_CONFIGS[0].label, config: WEEK_CONFIGS[0], needsReset: true };
  }
  const days = (Date.now() - new Date(cycle.startDate).getTime()) / (1000 * 60 * 60 * 24);
  if (days >= 28) {
    return { week: 1, label: WEEK_CONFIGS[0].label, config: WEEK_CONFIGS[0], needsReset: true };
  }
  const weekIdx = Math.min(3, Math.floor(days / 7));
  return { week: weekIdx + 1, label: WEEK_CONFIGS[weekIdx].label, config: WEEK_CONFIGS[weekIdx], needsReset: false };
}

// ─────────────────────────────────────────────────────────────
// PROGRESSIVE OVERLOAD
// ─────────────────────────────────────────────────────────────

const BIG_MUSCLE_GROUPS = ["Prsa", "Záda", "Nohy", "Hýždě"];
const BIG_INCREMENT = 2.5;
const SMALL_INCREMENT = 1.25;

export function getLastPerformance(exerciseName, history) {
  for (const w of history) {
    for (const ex of w.exercises) {
      if (ex.name === exerciseName && ex.logged && ex.setDetails) {
        const done = ex.setDetails.filter(s => s.done && s.weight);
        if (done.length > 0) {
          return { sets: done, targetReps: ex.reps, muscleGroup: ex.muscleGroup, date: w.date, rpe: ex.rpe || null };
        }
      }
    }
  }
  return null;
}

export function calcProgression(lastPerf, muscleGroup, targetReps, weekConfig, keyLifts, exerciseName) {
  if (!lastPerf || lastPerf.sets.length === 0) {
    const keyLiftWeight = keyLifts?.[exerciseName];
    if (keyLiftWeight) {
      const w = weekConfig.deload ? Math.round(keyLiftWeight * 0.6 * 4) / 4 : keyLiftWeight;
      return { suggestedWeight: String(w), tag: weekConfig.deload ? "deload" : "profile", noteKey: weekConfig.deload ? "deloadProfile" : "profile", noteData: { w }, lastWeight: null };
    }
    return { suggestedWeight: "", tag: "new", noteKey: "new", noteData: {}, lastWeight: null };
  }

  const avgWeight = lastPerf.sets.reduce((s, set) => s + parseFloat(set.weight || 0), 0) / lastPerf.sets.length;
  const avgReps   = lastPerf.sets.reduce((s, set) => s + parseFloat(set.reps  || 0), 0) / lastPerf.sets.length;
  const isBig     = BIG_MUSCLE_GROUPS.includes(muscleGroup);
  const increment = isBig ? BIG_INCREMENT : SMALL_INCREMENT;

  const daysSinceLast = (Date.now() - new Date(lastPerf.date).getTime()) / (1000 * 60 * 60 * 24);
  let comebackPct = 1.0;
  if      (daysSinceLast > 28) comebackPct = 0.80;
  else if (daysSinceLast > 21) comebackPct = 0.85;
  else if (daysSinceLast > 14) comebackPct = 0.90;
  else if (daysSinceLast > 7)  comebackPct = 0.95;

  const repsParts  = targetReps.split("-");
  const targetMax  = parseInt(repsParts[repsParts.length - 1]) || 12;
  const targetMin  = parseInt(repsParts[0]) || 8;
  const allHitMax  = lastPerf.sets.every(s => parseFloat(s.reps) >= targetMax);

  if (weekConfig.deload) {
    const dw = Math.round(avgWeight * 0.6 * 4) / 4;
    return { suggestedWeight: String(dw), tag: "deload", noteKey: "deload", noteData: { w: dw, prev: avgWeight }, lastWeight: avgWeight };
  }

  if (comebackPct < 1.0) {
    const cw = Math.round(avgWeight * comebackPct * 4) / 4;
    return { suggestedWeight: String(cw), tag: "comeback", noteKey: "comeback", noteData: { w: cw, days: Math.round(daysSinceLast) }, lastWeight: avgWeight };
  }

  if (lastPerf.rpe === "easy" && avgWeight > 0) {
    const nw = Math.round((avgWeight + increment) * 4) / 4;
    return { suggestedWeight: String(nw), tag: "up", noteKey: "rpeEasy", noteData: { w: nw, inc: increment }, lastWeight: avgWeight };
  }

  if (lastPerf.rpe === "hard" && avgWeight > 0) {
    return { suggestedWeight: String(avgWeight), tag: "same", noteKey: "rpeHard", noteData: { w: avgWeight }, lastWeight: avgWeight };
  }

  if (allHitMax && avgWeight > 0) {
    const nw = Math.round((avgWeight + increment) * 4) / 4;
    return { suggestedWeight: String(nw), tag: "up", noteKey: "up", noteData: { prev: avgWeight, reps: Math.round(avgReps), w: nw, inc: increment }, lastWeight: avgWeight };
  }

  if (avgReps < targetMin && avgWeight > 0) {
    return { suggestedWeight: String(avgWeight), tag: "same", noteKey: "belowTarget", noteData: { w: avgWeight, reps: Math.round(avgReps), target: targetReps }, lastWeight: avgWeight };
  }

  return { suggestedWeight: String(avgWeight || ""), tag: "same", noteKey: avgWeight ? "stayMax" : "", noteData: { w: avgWeight }, lastWeight: avgWeight || null };
}

// ─────────────────────────────────────────────────────────────
// EXERCISE SELECTION HELPERS
// ─────────────────────────────────────────────────────────────

function allExercisesByPattern(pattern, eqSet) {
  const results = [];
  for (const [group, exList] of Object.entries(EXERCISE_LIBRARY)) {
    for (const ex of exList) {
      if (ex.movementPattern === pattern && ex.equipment.some(e => eqSet.has(e))) {
        results.push({ ...ex, muscleGroup: group });
      }
    }
  }
  return results;
}

function pickExercise(pattern, eqSet, history, usedNames = new Set(), preferRecent = true) {
  const candidates = allExercisesByPattern(pattern, eqSet).filter(ex => !usedNames.has(ex.name));
  if (candidates.length === 0) return null;

  // Score: prefer exercises done recently (familiarity = better progression tracking)
  // but add randomness so it rotates
  const recentNames = new Set();
  let wCount = 0;
  for (const w of history) {
    for (const ex of w.exercises) {
      if (ex.logged) recentNames.add(ex.name);
    }
    if (++wCount >= 6) break;
  }

  const scored = candidates.map(ex => {
    let score = 0;
    if (preferRecent && recentNames.has(ex.name)) score += 40;
    if (ex.type === "compound") score += 20;
    const family = EXERCISE_FAMILY[ex.name];
    if (family && [...usedNames].some(n => EXERCISE_FAMILY[n] === family)) score -= 60;
    score += Math.random() * 25;
    return { ...ex, _score: score };
  });

  scored.sort((a, b) => b._score - a._score);
  return scored[0];
}

function pickAccessory(slotKey, eqSet, usedNames = new Set()) {
  const pool = (ACCESSORY_LIBRARY[slotKey] || []).filter(
    ex => !usedNames.has(ex.name) && ex.equipment.some(e => eqSet.has(e) || e === "bodyweight")
  );
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─────────────────────────────────────────────────────────────
// EXERCISE OBJECT BUILDER
// ─────────────────────────────────────────────────────────────

function buildExercise(ex, sets, reps, weekConfig, history, profile) {
  const lastPerf     = ex.noWeight || ex.isAccessory ? null : getLastPerformance(ex.name, history);
  const overload     = (ex.noWeight || ex.isAccessory)
    ? { suggestedWeight: "", tag: ex.isAccessory ? "accessory" : "bodyweight", noteKey: "", noteData: {}, lastWeight: null }
    : calcProgression(lastPerf, ex.muscleGroup, reps, weekConfig, profile?.keyLifts, ex.name);

  return {
    id:             Math.random().toString(36).substr(2, 9),
    name:           ex.name,
    muscleGroup:    ex.muscleGroup || "–",
    desc:           ex.desc,
    type:           ex.type,
    movementPattern: ex.movementPattern,
    noWeight:       ex.noWeight || false,
    isHold:         ex.isHold   || false,
    isAccessory:    ex.isAccessory || false,
    sets,
    reps,
    weight:         overload.suggestedWeight || "",
    logged:         false,
    progressTag:    overload.tag,
    noteKey:        overload.noteKey,
    noteData:       overload.noteData,
    lastWeight:     overload.lastWeight,
    setDetails:     Array.from({ length: sets }, () => ({
      reps:   "",
      weight: overload.suggestedWeight || "",
      done:   false,
    })),
  };
}

// ─────────────────────────────────────────────────────────────
// SUPERSET BUILDER
// ─────────────────────────────────────────────────────────────

function buildSuperset(exercises) {
  // Assign a shared pairId to all exercises in this superset
  const pairId = `ss_${Math.random().toString(36).substr(2, 6)}`;
  return exercises.map((ex, i) => ({ ...ex, pairId, supersetSlot: String.fromCharCode(65 + i) }));
}

// ─────────────────────────────────────────────────────────────
// WORKOUT TEMPLATE A — Lower dominant
//
// SS1 (2): squat ↔ hip_hinge
// SS2 (3): hip_hinge_isolation ↔ upper_body ↔ knee_isolation/unilateral
// SS3 (2): horizontal_push ↔ horizontal_pull
// SS4 (2): accessory_upper ↔ mobility_upper
// ─────────────────────────────────────────────────────────────

function generateTemplateA(eqSet, history, weekConfig, profile) {
  const usedNames = new Set();
  const baseSets  = Math.max(2, 3 + weekConfig.setsBonus);
  const accSets   = 2; // accessory always 2-3 sets, lighter

  const repsC = weekConfig.reps.compound;
  const repsI = weekConfig.reps.isolation;

  // SS1
  const ss1a = pickExercise(PATTERNS.SQUAT,     eqSet, history, usedNames);
  const ss1b = pickExercise(PATTERNS.HIP_HINGE, eqSet, history, usedNames);
  if (ss1a) usedNames.add(ss1a.name);
  if (ss1b) usedNames.add(ss1b.name);

  // SS2
  const ss2a = pickExercise(PATTERNS.HIP_HINGE_ISO,    eqSet, history, usedNames);
  // Upper body as "rest" in the middle — pick horizontal or vertical push/pull
  const ss2bPattern = Math.random() > 0.5 ? PATTERNS.HORIZONTAL_PUSH : PATTERNS.VERTICAL_PUSH;
  const ss2b = pickExercise(ss2bPattern, eqSet, history, usedNames);
  const ss2cPattern = Math.random() > 0.5 ? PATTERNS.KNEE_ISO : PATTERNS.UNILATERAL_LOWER;
  const ss2c = pickExercise(ss2cPattern, eqSet, history, usedNames);
  if (ss2a) usedNames.add(ss2a.name);
  if (ss2b) usedNames.add(ss2b.name);
  if (ss2c) usedNames.add(ss2c.name);

  // SS3 — ensure we don't repeat ss2b pattern
  const ss3aPattern = PATTERNS.HORIZONTAL_PUSH;
  const ss3bPattern = PATTERNS.HORIZONTAL_PULL;
  const ss3a = pickExercise(ss3aPattern, eqSet, history, usedNames);
  const ss3b = pickExercise(ss3bPattern, eqSet, history, usedNames);
  if (ss3a) usedNames.add(ss3a.name);
  if (ss3b) usedNames.add(ss3b.name);

  // SS4 — accessory
  const ss4a = pickAccessory("accessory_upper", eqSet, usedNames);
  const ss4b = pickAccessory("mobility_upper",  eqSet, usedNames);

  const exercises = [];

  // Build each superset
  if (ss1a && ss1b) {
    exercises.push(...buildSuperset([
      buildExercise(ss1a, baseSets, repsC, weekConfig, history, profile),
      buildExercise(ss1b, baseSets, repsC, weekConfig, history, profile),
    ]));
  }

  const ss2members = [ss2a, ss2b, ss2c].filter(Boolean);
  if (ss2members.length >= 2) {
    exercises.push(...buildSuperset(ss2members.map(ex => {
      const r = ex.type === "compound" ? repsC : repsI;
      return buildExercise(ex, baseSets, ex.isHold ? "30-45s" : r, weekConfig, history, profile);
    })));
  }

  if (ss3a && ss3b) {
    exercises.push(...buildSuperset([
      buildExercise(ss3a, baseSets, repsC, weekConfig, history, profile),
      buildExercise(ss3b, baseSets, repsC, weekConfig, history, profile),
    ]));
  }

  if (ss4a && ss4b) {
    exercises.push(...buildSuperset([
      buildExercise({ ...ss4a, muscleGroup: "Ramena" }, accSets, ss4a.isHold ? "30-45s" : "12-15", weekConfig, history, profile),
      buildExercise({ ...ss4b, muscleGroup: "Ramena" }, accSets, ss4b.isHold ? "30-60s" : "10x", weekConfig, history, profile),
    ]));
  }

  return exercises;
}

// ─────────────────────────────────────────────────────────────
// WORKOUT TEMPLATE B — Upper + Core
//
// SS1 (2): vertical_push ↔ vertical_pull
// SS2 (3): horizontal_push ↔ horizontal_pull ↔ shoulder_isolation
// SS3 (2): core_antiextension ↔ core_rotation/flexion
// SS4 (2): accessory_lower ↔ mobility_lower
// ─────────────────────────────────────────────────────────────

function generateTemplateB(eqSet, history, weekConfig, profile) {
  const usedNames = new Set();
  const baseSets  = Math.max(2, 3 + weekConfig.setsBonus);
  const accSets   = 2;

  const repsC = weekConfig.reps.compound;
  const repsI = weekConfig.reps.isolation;

  // SS1
  const ss1a = pickExercise(PATTERNS.VERTICAL_PUSH, eqSet, history, usedNames);
  const ss1b = pickExercise(PATTERNS.VERTICAL_PULL, eqSet, history, usedNames);
  if (ss1a) usedNames.add(ss1a.name);
  if (ss1b) usedNames.add(ss1b.name);

  // SS2
  const ss2a = pickExercise(PATTERNS.HORIZONTAL_PUSH,  eqSet, history, usedNames);
  const ss2b = pickExercise(PATTERNS.HORIZONTAL_PULL,  eqSet, history, usedNames);
  const ss2c = pickExercise(PATTERNS.SHOULDER_ISO,     eqSet, history, usedNames);
  if (ss2a) usedNames.add(ss2a.name);
  if (ss2b) usedNames.add(ss2b.name);
  if (ss2c) usedNames.add(ss2c.name);

  // SS3
  const ss3a = pickExercise(PATTERNS.CORE_ANTIEXTENSION, eqSet, history, usedNames);
  const ss3bPat = Math.random() > 0.5 ? PATTERNS.CORE_ROTATION : PATTERNS.CORE_FLEXION;
  const ss3b = pickExercise(ss3bPat, eqSet, history, usedNames);
  if (ss3a) usedNames.add(ss3a.name);
  if (ss3b) usedNames.add(ss3b.name);

  // SS4
  const ss4a = pickAccessory("accessory_lower", eqSet, usedNames);
  const ss4b = pickAccessory("mobility_lower",  eqSet, usedNames);

  const exercises = [];

  if (ss1a && ss1b) {
    exercises.push(...buildSuperset([
      buildExercise(ss1a, baseSets, repsC, weekConfig, history, profile),
      buildExercise(ss1b, baseSets, repsC, weekConfig, history, profile),
    ]));
  }

  const ss2members = [ss2a, ss2b, ss2c].filter(Boolean);
  if (ss2members.length >= 2) {
    exercises.push(...buildSuperset(ss2members.map(ex => {
      const r = ex.type === "compound" ? repsC : repsI;
      return buildExercise(ex, baseSets, r, weekConfig, history, profile);
    })));
  }

  const ss3members = [ss3a, ss3b].filter(Boolean);
  if (ss3members.length >= 2) {
    exercises.push(...buildSuperset(ss3members.map(ex =>
      buildExercise(ex, accSets, ex.isHold ? "30-45s" : repsI, weekConfig, history, profile)
    )));
  }

  if (ss4a && ss4b) {
    exercises.push(...buildSuperset([
      buildExercise({ ...ss4a, muscleGroup: "Nohy" }, accSets, ss4a.isHold ? "30-45s" : "12-15", weekConfig, history, profile),
      buildExercise({ ...ss4b, muscleGroup: "Nohy" }, accSets, ss4b.isHold ? "30-60s" : "10x",   weekConfig, history, profile),
    ]));
  }

  return exercises;
}

// ─────────────────────────────────────────────────────────────
// TEMPLATE ROTATION LOGIC
// Determines whether to run A or B based on history
// ─────────────────────────────────────────────────────────────

function determineTemplate(history) {
  // Find the last completed workout's template
  for (const w of history) {
    if (w.template) return w.template === "A" ? "B" : "A";
  }
  return "A"; // first ever workout
}

// ─────────────────────────────────────────────────────────────
// MAIN ENTRY POINT
// ─────────────────────────────────────────────────────────────

export function generateWorkout(equipment, history, cycle, profile) {
  const eqSet     = new Set(equipment);
  const cycleInfo = getCycleInfo(cycle);
  const weekConfig = cycleInfo.config;
  const template  = determineTemplate(history);

  const exercises = template === "A"
    ? generateTemplateA(eqSet, history, weekConfig, profile)
    : generateTemplateB(eqSet, history, weekConfig, profile);

  const templateLabel = template === "A" ? "Lower dominant" : "Upper + Core";

  return {
    id:         Math.random().toString(36).substr(2, 9),
    date:       new Date().toISOString(),
    template,
    splitLabel: `Workout ${template} · ${templateLabel}`,
    weekLabel:  `T${cycleInfo.week} · ${weekConfig.label}`,
    exercises,
    completed:  false,
  };
}

// ─────────────────────────────────────────────────────────────
// HISTORY / ANALYTICS HELPERS (used by App.jsx)
// ─────────────────────────────────────────────────────────────

export function getRecoveryStatus(muscleGroup, workoutHistory) {
  const now = Date.now();
  let lastWorked = null;
  for (const w of workoutHistory) {
    for (const ex of w.exercises) {
      if (ex.muscleGroup === muscleGroup && ex.logged) {
        const t = new Date(w.date).getTime();
        if (!lastWorked || t > lastWorked) lastWorked = t;
      }
    }
  }
  if (!lastWorked) return { pct: 100, label: "Odpočatý", hours: null };
  const hoursAgo = (now - lastWorked) / (1000 * 60 * 60);
  const pct = Math.min(100, Math.round((hoursAgo / 48) * 100));
  return { pct, label: pct >= 80 ? "Odpočatý" : pct >= 50 ? "Skoro OK" : "Regeneruje", hours: Math.round(hoursAgo) };
}

export function getExerciseHistory(exerciseName, history, limit = 8) {
  const entries = [];
  for (const w of history) {
    for (const ex of w.exercises) {
      if (ex.name === exerciseName && ex.logged && ex.setDetails) {
        const done = ex.setDetails.filter(s => s.done && s.weight);
        if (done.length > 0) {
          const maxW    = Math.max(...done.map(s => parseFloat(s.weight) || 0));
          const avgReps = done.reduce((sum, s) => sum + (parseFloat(s.reps) || 0), 0) / done.length;
          entries.push({ date: w.date, sets: done.length, maxWeight: maxW, avgReps: Math.round(avgReps * 10) / 10, rpe: ex.rpe || null });
        }
      }
    }
    if (entries.length >= limit) break;
  }
  return entries;
}

export function getStrengthHistory(exerciseName, history, limit = 10) {
  const points = [];
  for (const w of [...history].reverse()) {
    for (const ex of w.exercises) {
      if (ex.name === exerciseName && ex.logged && ex.setDetails) {
        const done = ex.setDetails.filter(s => s.done && s.weight);
        if (done.length > 0) {
          points.push({ date: w.date, weight: Math.max(...done.map(s => parseFloat(s.weight) || 0)) });
        }
      }
    }
    if (points.length >= limit) break;
  }
  return points;
}

export function getWeeklyVolume(muscleGroup, history) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let total = 0;
  for (const w of history) {
    if (new Date(w.date).getTime() < weekAgo) continue;
    for (const ex of w.exercises) {
      if (ex.muscleGroup === muscleGroup && ex.logged && ex.setDetails) {
        total += ex.setDetails.filter(s => s.done).length;
      }
    }
  }
  return total;
}

export const VOLUME_TARGETS = {
  Prsa:    { min: 10, max: 14 },
  Záda:    { min: 10, max: 14 },
  Nohy:    { min: 10, max: 14 },
  Ramena:  { min: 8,  max: 12 },
  Biceps:  { min: 6,  max: 10 },
  Triceps: { min: 6,  max: 10 },
  Core:    { min: 6,  max: 10 },
  Hýždě:  { min: 8,  max: 12 },
};

export function getExerciseAlternatives(exercise, equipment, currentExerciseNames) {
  const eqSet = new Set(equipment);
  const group = exercise.muscleGroup;
  const pattern = exercise.movementPattern;
  const all = (EXERCISE_LIBRARY[group] || []).filter(ex =>
    ex.name !== exercise.name && !currentExerciseNames.includes(ex.name)
  );
  const sort = list => [...list.filter(ex => ex.movementPattern === pattern), ...list.filter(ex => ex.movementPattern !== pattern)];
  return {
    mine:  sort(all.filter(ex =>  ex.equipment.some(e => eqSet.has(e)))),
    other: sort(all.filter(ex => !ex.equipment.some(e => eqSet.has(e)))),
  };
}
