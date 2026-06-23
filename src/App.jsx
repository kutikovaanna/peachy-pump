import { useState, useEffect, useRef, useCallback, useMemo } from "react";

import {
  EXERCISE_LIBRARY, ACCESSORY_LIBRARY, EQUIPMENT_OPTIONS,
  MUSCLE_GROUPS, GROUP_COLORS, NAMES_EN, KEY_LIFT_EXERCISES,
} from "./exercises.js";

import {
  generateWorkout, getCycleInfo, getRecoveryStatus,
  getExerciseHistory, getStrengthHistory, getWeeklyVolume,
  getExerciseAlternatives, calcProgression, getLastPerformance,
  WEEK_CONFIGS, VOLUME_TARGETS,
} from "./workout.js";

const I = (d, size = 24, stroke = "currentColor") => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}><path d={d}/></svg>
);
const IC = {
  home: "M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z M9 21V13h6v8",
  dumbbell: "M6.5 6.5L17.5 17.5 M2 12h4 M18 12h4 M6 8v8 M18 8v8",
  book: "M4 19.5A2.5 2.5 0 016.5 17H20 M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z",
  gear: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  back: "M19 12H5 M12 19l-7-7 7-7",
  check: "M20 6L9 17l-5-5",
  swap: "M7 16V4m0 0L3 8m4-4l4 4 M17 8v12m0 0l4-4m-4 4l-4-4",
  info: "M12 22a10 10 0 100-20 10 10 0 000 20z M12 16v-4 M12 8h.01",
  x: "M18 6L6 18 M6 6l12 12",
  play: "M5 3l14 9-14 9V3z",
  trash: "M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6 M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8",
  flag: "M4 15s1-1 4-1 3 0 4 1 4 1 4-1V3s-1 1-4 1-3 0-4-1-4-1-4 1z M4 22v-7",
  clock: "M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2",
  barbell: "M6.5 6.5L17.5 17.5 M2 12h4 M18 12h4 M6 8v8 M18 8v8",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
  chart: "M18 20V10 M12 20V4 M6 20v-6",
  chevDown: "M6 9l6 6 6-6",
  heart: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z",
};

const EQ_ICONS = {
  barbell: "M2 12h4m12 0h4M6 8v8M18 8v8M6.5 6.5l11 11",
  dumbbells: "M5 9v6m14-6v6M3 10v4h4v-4H3zm14 0v4h4v-4h-4zM7 12h10",
  bench: "M4 14h16M6 14v6M18 14v6M8 14V8h8v6",
  rack: "M6 3v18M18 3v18M6 8h12M6 16h12",
  cables: "M12 3v5m0 8v5M8 8a4 4 0 108 0M8 16a4 4 0 008 0",
  machines: "M12 15a3 3 0 100-6 3 3 0 000 6zM4 12h4m8 0h4",
  pullup_bar: "M4 6h16M8 6v4a4 4 0 008 0V6",
  bands: "M6 12a6 6 0 1012 0 6 6 0 00-12 0zM9 12a3 3 0 106 0 3 3 0 00-6 0z",
  bodyweight: "M12 11a3 3 0 100-6 3 3 0 000 6zM12 14v7M8 21h8",
  kettlebell: "M9 7a3 3 0 106 0 3 3 0 00-6 0zM8 10a5 5 0 0 0 0 8h8a5 5 0 000-8",
};

const MG_LABELS = {
  cs: { Prsa: "Prsa", Záda: "Záda", Ramena: "Ramena", Biceps: "Biceps", Triceps: "Triceps", Nohy: "Nohy", Core: "Core", Hýždě: "Hýždě" },
  en: { Prsa: "Chest", Záda: "Back", Ramena: "Shoulders", Biceps: "Biceps", Triceps: "Triceps", Nohy: "Legs", Core: "Core", Hýždě: "Glutes" },
};

const EQ_LABELS = {
  cs: { barbell: "Činka (barbell)", dumbbells: "Jednoručky", bench: "Lavička", rack: "Stojan/Rack", cables: "Kladky/Kabely", machines: "Stroje", pullup_bar: "Hrazda", bands: "Gumy", bodyweight: "Vlastní váha", kettlebell: "Kettlebell" },
  en: { barbell: "Barbell", dumbbells: "Dumbbells", bench: "Bench", rack: "Squat rack", cables: "Cables", machines: "Machines", pullup_bar: "Pull-up bar", bands: "Resistance bands", bodyweight: "Bodyweight", kettlebell: "Kettlebell" },
};

const UI = {
  cs: {
    nav: { home: "Domů", workout: "Trénink", library: "Cviky", settings: "Nastavení" },
    onboard: {
      subtitle: "Tvůj osobní trenér v kapse",
      steps: ["Vybavení", "O tobě", "Síla"],
      lang: "Jazyk",
      eqTitle: "Jaké máš vybavení?", eqSub: "Vyber vše, co máš k dispozici",
      aboutTitle: "Něco o tobě", aboutSub: "Pomůže to lépe nastavit tréninky",
      liftTitle: "Jaké váhy zvedáš?", liftSub: "Nemusíš vyplnit vše — upřesníš později",
      next: "Další", letsGo: "Pojďme trénovat!",
      age: "Věk", weight: "Váha (kg)", gender: "Pohlaví", female: "Žena", male: "Muž",
    },
    home: {
      total: "celkem", week: "týden",
      continueWorkout: "Pokračovat v tréninku", generate: "Vygeneruj trénink",
      streak: (n) => `Trénuješ ${n}. týden v řadě`,
      months: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"],
      days: ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"],
      workouts: (n) => n === 1 ? "trénink" : n >= 2 && n <= 4 ? "tréninky" : "tréninků",
      mesocycle: "Mezocyklus",
      weekOf: "Týden",
      recovery: "Regenerace svalů",
      phases: { Akumulace: "Akumulace", Zesilování: "Zesilování", Peak: "Peak", Deload: "Deload" },
      phaseDesc: {
        Akumulace: "Budování objemu – střední váhy, více opakování. Základ pro sílu.",
        Zesilování: "Zvyšování intenzity – těžší váhy, méně opakování.",
        Peak: "Maximální výkon – nejtěžší váhy, nejméně opakování, +1 série.",
        Deload: "Regenerace – lehké váhy, vysoké opakování. Tělo se zotavuje.",
      },
    },
    workout: {
      title: "Dnešní trénink", rest: "Odpočinek", skip: "Přeskočit",
      done: "hotovo", set: "Set", weightKg: "Váha (kg)", reps: "Opak.", timeS: "Čas (s)",
      easy: "Easy", moderate: "Akorát", hard: "Dřina",
      superset: "SUPERSET", supersetHint: "Střídej série: 1A → 1B → 2A → 2B …",
      finish: "Dokončit trénink",
      tags: { up: "↑ Zvýšeno", same: "→ Stejná váha", new: "✦ Nový", deload: "🧘 Deload", comeback: "↩ Návrat", profile: "Profil", bodyweight: "Vlastní váha", hold: "Výdrž" },
    },
    library: {
      title: "Knihovna cviků", all: "Vše",
      beginner: "začátečník", intermediate: "středně", advanced: "pokročilý",
      compound: "Compound", isolation: "Izolace",
    },
    settings: {
      title: "Nastavení", profile: "Profil",
      age: "Věk", weight: "Váha (kg)", gender: "Pohlaví", female: "Žena", male: "Muž",
      keyLifts: "Klíčové cviky (kg)", mesocycle: "Mezocyklus",
      restartCycle: "Restartovat cyklus", cycleInfo: "Cyklus se spustí s prvním tréninkem.",
      equipment: "Vybavení", language: "Jazyk",
      deleteAll: "Smazat všechna data", deleteConfirm: "Opravdu smazat všechna data?",
    },
    modal: {
      swap: "Vyměnit", yourEquip: "Tvé vybavení", otherOptions: "Další možnosti",
      noAlts: "Žádné alternativy.",
      howTo: "Jak na to", mistakes: "Časté chyby", history: "Historie výkonů",
      date: "Datum", weightCol: "Váha", avgReps: "Ø Opak.", series: "Série",
      video: "Podívej se na video ukázku",
      beginner: "Začátečník", intermediate: "Střední", advanced: "Pokročilý",
      compoundM: "Compound", isolationM: "Izolační",
      sameMove: "stejný pohyb",
    },
    celebration: {
      done: "Trénink hotový!",
      exercises: "cviků", sets: "sérií", minutes: "minut",
      milestone: (n) => `Milník: ${n}. trénink!`,
      next: "Jdeme dál",
      quotes: [
        "Síla se rodí z důslednosti.", "Každý trénink tě posouvá dál.",
        "Dnes jsi lepší než včera.", "Tvoje tělo ti děkuje.", "Beast mode: aktivováno.",
      ],
    },
    toast: { swapped: "Cvik vyměněn!", deleted: "Trénink smazán", dataDeleted: "Data smazána" },
    notes: {
      new: "Nový cvik – zadej váhu, která ti sedí. Příště ti ji apka navrhne automaticky!",
      profile: (d) => `Váha z tvého profilu: ${d.w} kg`,
      deloadProfile: (d) => `Deload — ${d.w} kg (60% z profilu)`,
      deload: (d) => `Deload týden — ${d.w} kg (60% z ${d.prev} kg)`,
      comeback: (d) => `Po ${d.days} dnech pauzy — ${d.w} kg (návrat do formy)`,
      rpeEasy: (d) => `Minule hodnoceno jako lehké → ${d.w} kg (+${d.inc} kg)`,
      rpeHard: (d) => `Minule hodnoceno jako těžké — zůstaň na ${d.w} kg a zlepši techniku`,
      up: (d) => `Minule ${d.prev} kg × ${d.reps} → dnes ${d.w} kg (+${d.inc} kg)`,
      belowTarget: (d) => `Zůstaň na ${d.w} kg – minule ${d.reps} opak. (cíl: ${d.target})`,
      stayMax: (d) => `Zůstaň na ${d.w} kg – opakování ještě nejsou na maximu`,
    },
  },
  en: {
    nav: { home: "Home", workout: "Workout", library: "Exercises", settings: "Settings" },
    onboard: {
      subtitle: "Your personal trainer in your pocket",
      steps: ["Equipment", "About you", "Strength"],
      lang: "Language",
      eqTitle: "What equipment do you have?", eqSub: "Select everything available to you",
      aboutTitle: "A bit about you", aboutSub: "Helps us customize your workouts",
      liftTitle: "What weights do you lift?", liftSub: "You don't have to fill everything — adjust later",
      next: "Next", letsGo: "Let's train!",
      age: "Age", weight: "Weight (kg)", gender: "Gender", female: "Female", male: "Male",
    },
    home: {
      total: "total", week: "week",
      continueWorkout: "Continue workout", generate: "Generate workout",
      streak: (n) => `${n}-week training streak`,
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      workouts: () => "workouts",
      mesocycle: "Mesocycle",
      weekOf: "Week",
      recovery: "Muscle recovery",
      phases: { Akumulace: "Accumulation", Zesilování: "Intensification", Peak: "Peak", Deload: "Deload" },
      phaseDesc: {
        Akumulace: "Building volume — moderate weights, more reps. Foundation for strength.",
        Zesilování: "Increasing intensity — heavier weights, fewer reps.",
        Peak: "Maximum performance — heaviest weights, fewest reps, +1 set.",
        Deload: "Recovery — light weights, high reps. Body recovers.",
      },
    },
    workout: {
      title: "Today's workout", rest: "Rest", skip: "Skip",
      done: "done", set: "Set", weightKg: "Weight (kg)", reps: "Reps", timeS: "Time (s)",
      easy: "Easy", moderate: "Moderate", hard: "Hard",
      superset: "SUPERSET", supersetHint: "Alternate sets: 1A → 1B → 2A → 2B …",
      finish: "Finish workout",
      tags: { up: "↑ Increased", same: "→ Same weight", new: "✦ New", deload: "🧘 Deload", comeback: "↩ Return", profile: "Profile", bodyweight: "Bodyweight", hold: "Hold" },
    },
    library: {
      title: "Exercise library", all: "All",
      beginner: "beginner", intermediate: "intermediate", advanced: "advanced",
      compound: "Compound", isolation: "Isolation",
    },
    settings: {
      title: "Settings", profile: "Profile",
      age: "Age", weight: "Weight (kg)", gender: "Gender", female: "Female", male: "Male",
      keyLifts: "Key lifts (kg)", mesocycle: "Mesocycle",
      restartCycle: "Restart cycle", cycleInfo: "Cycle starts with your first workout.",
      equipment: "Equipment", language: "Language",
      deleteAll: "Delete all data", deleteConfirm: "Really delete all data?",
    },
    modal: {
      swap: "Swap", yourEquip: "Your equipment", otherOptions: "Other options",
      noAlts: "No alternatives.",
      howTo: "How to", mistakes: "Common mistakes", history: "Performance history",
      date: "Date", weightCol: "Weight", avgReps: "Avg reps", series: "Sets",
      video: "Watch video tutorial",
      beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced",
      compoundM: "Compound", isolationM: "Isolation",
      sameMove: "same movement",
    },
    celebration: {
      done: "Workout complete!",
      exercises: "exercises", sets: "sets", minutes: "minutes",
      milestone: (n) => `Milestone: workout #${n}!`,
      next: "Let's go",
      quotes: [
        "Strength is born from consistency.", "Every workout pushes you further.",
        "Today you're better than yesterday.", "Your body thanks you.", "Beast mode: activated.",
      ],
    },
    toast: { swapped: "Exercise swapped!", deleted: "Workout deleted", dataDeleted: "Data deleted" },
    notes: {
      new: "New exercise – enter a weight that feels right. Next time the app will suggest it automatically!",
      profile: (d) => `Weight from your profile: ${d.w} kg`,
      deloadProfile: (d) => `Deload — ${d.w} kg (60% of profile)`,
      deload: (d) => `Deload week — ${d.w} kg (60% of ${d.prev} kg)`,
      comeback: (d) => `After ${d.days} days off — ${d.w} kg (easing back in)`,
      rpeEasy: (d) => `Last time felt easy → ${d.w} kg (+${d.inc} kg)`,
      rpeHard: (d) => `Last time felt hard — stay at ${d.w} kg and focus on form`,
      up: (d) => `Last time ${d.prev} kg × ${d.reps} → today ${d.w} kg (+${d.inc} kg)`,
      belowTarget: (d) => `Stay at ${d.w} kg – last time ${d.reps} reps (target: ${d.target})`,
      stayMax: (d) => `Stay at ${d.w} kg – reps not yet at max`,
    },
  },
};


function loadSavedData() {
  try {
    const raw = localStorage.getItem("powerfit-data");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ========== MAIN COMPONENT ==========

export default function FitApp() {
  const savedData = loadSavedData();
  const [equipment, setEquipment] = useState(savedData?.equipment || ["bodyweight"]);
  const [history, setHistory] = useState(savedData?.history || []);
  const [currentWorkout, setCurrentWorkout] = useState(savedData?.currentWorkout || null);
  const [view, setView] = useState("home");
  const [onboarded, setOnboarded] = useState(savedData?.onboarded || false);
  const [profile, setProfile] = useState(savedData?.profile || { age: "", weight: "", gender: "female", keyLifts: {} });
  const [cycle, setCycle] = useState(savedData?.cycle || null);
  const [lang, setLang] = useState(savedData?.lang || "cs");
  const [onboardStep, setOnboardStep] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [swapTarget, setSwapTarget] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [celebration, setCelebration] = useState(null);
  const [setPopId, setSetPopId] = useState(null);
  const [libraryFilter, setLibraryFilter] = useState("Vše");
  const [openSections, setOpenSections] = useState({});
  const [viewTransition, setViewTransition] = useState({ current: "home", direction: "forward" });
  const [restTimer, setRestTimer] = useState({ enabled: false, seconds: 90, active: false, remaining: 0 });
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [prToast, setPrToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [calendarOffset, setCalendarOffset] = useState(0);
  const restTimerRef = useRef(null);

  const isFirstMount = useRef(true);
  const saveTimeout = useRef(null);

  useEffect(() => {
    if (isFirstMount.current) { isFirstMount.current = false; return; }
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      try {
        localStorage.setItem("powerfit-data", JSON.stringify({
          equipment, history, onboarded, currentWorkout, profile, cycle, lang,
        }));
      } catch (e) { console.error("Save failed", e); }
    }, 300);
    return () => { if (saveTimeout.current) clearTimeout(saveTimeout.current); };
  }, [equipment, history, onboarded, currentWorkout, profile, cycle, lang]);

  const t = useMemo(() => UI[lang] || UI.cs, [lang]);
  const mgL = useMemo(() => MG_LABELS[lang] || MG_LABELS.cs, [lang]);
  const eq = useMemo(() => EQ_LABELS[lang] || EQ_LABELS.cs, [lang]);
  const exName = useCallback((name) => lang === "en" ? (NAMES_EN[name] || name) : name, [lang]);

  const toast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 2500); };

  const viewOrder = ["home", "workout", "library", "settings"];
  const navigateView = useCallback((newView) => {
    if (newView === view) return;
    const oldIdx = viewOrder.indexOf(view);
    const newIdx = viewOrder.indexOf(newView);
    const dir = newIdx >= oldIdx ? "forward" : "backward";
    setViewTransition({ current: newView, direction: dir });
    setView(newView);
  }, [view]);

  useEffect(() => {
    if (!restTimer.active || restTimer.remaining <= 0) return;
    restTimerRef.current = setInterval(() => {
      setRestTimer(prev => {
        if (prev.remaining <= 1) {
          clearInterval(restTimerRef.current);
          return { ...prev, active: false, remaining: 0 };
        }
        return { ...prev, remaining: prev.remaining - 1 };
      });
    }, 1000);
    return () => clearInterval(restTimerRef.current);
  }, [restTimer.active]);

  const startRestTimer = () => {
    if (restTimerRef.current) clearInterval(restTimerRef.current);
    setRestTimer(prev => ({ ...prev, active: true, remaining: prev.seconds }));
  };

  const toggleEquipment = (id) => {
    setEquipment(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const finishOnboarding = () => { setOnboarded(true); };

  const genWorkout = () => {
    let currentCycle = cycle;
    const cycleInfo = getCycleInfo(currentCycle);
    if (cycleInfo.needsReset || !currentCycle) {
      currentCycle = { startDate: new Date().toISOString() };
      setCycle(currentCycle);
    }
    const w = generateWorkout(equipment, history, currentCycle, profile);
    setCurrentWorkout(w);
    setWorkoutStartTime(Date.now());
    navigateView("workout");
    toast("Trénink vygenerován!");
  };

  const toggleSetDone = (exIdx, setIdx) => {
    let wasDone = false;
    setCurrentWorkout(prev => {
      const ex = prev.exercises[exIdx];
      wasDone = ex.setDetails[setIdx].done;
      const n = { ...prev, exercises: prev.exercises.map((e, i) => {
        if (i !== exIdx) return e;
        const newSets = e.setDetails.map((s, si) => si === setIdx ? { ...s, done: !s.done } : s);
        return { ...e, setDetails: newSets, logged: newSets.every(s => s.done) };
      })};
      return n;
    });
    const popKey = `${exIdx}-${setIdx}`;
    setSetPopId(popKey);
    setTimeout(() => setSetPopId(null), 400);
    if (!wasDone && restTimer.enabled) startRestTimer();
  };

  const updateSetDetail = (exIdx, setIdx, field, value) => {
    setCurrentWorkout(prev => {
      const n = { ...prev, exercises: prev.exercises.map((ex, i) => {
        if (i !== exIdx) return ex;
        const newSets = ex.setDetails.map((s, si) => {
          if (si === setIdx) return { ...s, [field]: value };
          if (setIdx === 0 && si > 0 && !s.done && !s[field]) {
            return { ...s, [field]: value };
          }
          return s;
        });
        return { ...ex, setDetails: newSets };
      })};
      return n;
    });
  };

  const updateExerciseRpe = (exIdx, rpeValue) => {
    setCurrentWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => i === exIdx ? { ...ex, rpe: ex.rpe === rpeValue ? null : rpeValue } : ex),
    }));
  };

  const finishWorkout = () => {
    if (!currentWorkout) return;
    const completed = { ...currentWorkout, completed: true, completedAt: new Date().toISOString() };
    const newHist = [completed, ...history].slice(0, 100);
    const doneCount = completed.exercises.filter(e => e.logged).length;
    const totalSets = completed.exercises.reduce((sum, e) => sum + (e.setDetails?.filter(s => s.done).length || 0), 0);
    const workoutNum = newHist.length;
    const milestone = [5, 10, 25, 50, 100].includes(workoutNum) ? workoutNum : null;

    const durationMs = workoutStartTime ? Date.now() - workoutStartTime : 0;
    const durationMin = Math.round(durationMs / 60000);

    const prs = [];
    completed.exercises.forEach(ex => {
      if (!ex.logged || ex.noWeight) return;
      const maxWeight = Math.max(...(ex.setDetails || []).filter(s => s.done && s.weight).map(s => parseFloat(s.weight) || 0));
      if (maxWeight <= 0) return;
      const prevMax = history.reduce((best, w) => {
        const prev = w.exercises?.find(e => e.name === ex.name);
        if (!prev?.setDetails) return best;
        const pm = Math.max(...prev.setDetails.filter(s => s.done && s.weight).map(s => parseFloat(s.weight) || 0), 0);
        return Math.max(best, pm);
      }, 0);
      if (maxWeight > prevMax && prevMax > 0) prs.push({ name: ex.name, prev: prevMax, now: maxWeight });
    });

    setHistory(newHist);
    setCurrentWorkout(null);
    setWorkoutStartTime(null);
    if (restTimerRef.current) clearInterval(restTimerRef.current);
    setRestTimer(prev => ({ ...prev, active: false, remaining: 0 }));
    setCelebration({ exercises: doneCount, sets: totalSets, split: completed.splitLabel, milestone, workoutNum, duration: durationMin, prs });
  };

  const deleteWorkout = (idx) => {
    setHistory(prev => prev.filter((_, i) => i !== idx));
    setDeleteConfirm(null);
    toast(t.toast.deleted);
  };

  const swapExercise = (exIdx, newEx) => {
    setCurrentWorkout(prev => {
      const oldEx = prev.exercises[exIdx];
      const cycleInfo = getCycleInfo(cycle);
      const exType = newEx.type === "compound" ? "compound" : "isolation";
      const reps = newEx.isHold ? "30-60s" : cycleInfo.config.reps[exType];
      const lastPerf = getLastPerformance(newEx.name, history);
      const overloadResult = newEx.noWeight
        ? { suggestedWeight: "", tag: "bodyweight", note: "", lastWeight: null }
        : calcProgression(lastPerf, oldEx.muscleGroup, reps, cycleInfo.config, profile?.keyLifts, newEx.name);

      const replacement = {
        id: Math.random().toString(36).substr(2, 9),
        name: newEx.name,
        muscleGroup: oldEx.muscleGroup,
        desc: newEx.desc,
        type: newEx.type,
        movementPattern: newEx.movementPattern,
        noWeight: newEx.noWeight || false,
        isHold: newEx.isHold || false,
        sets: oldEx.sets,
        reps,
        weight: overloadResult.suggestedWeight || "",
        logged: false,
        progressTag: overloadResult.tag,
        noteKey: overloadResult.noteKey,
        noteData: overloadResult.noteData,
        lastWeight: overloadResult.lastWeight,
        setDetails: Array.from({ length: oldEx.sets }, () => ({
          reps: "",
          weight: overloadResult.suggestedWeight || "",
          done: false,
        })),
      };

      const newExercises = [...prev.exercises];
      newExercises[exIdx] = replacement;
      return { ...prev, exercises: newExercises };
    });
    setSwapTarget(null);
    toast(t.toast.swapped);
  };

  const s = styles;

  // ===== ONBOARDING =====
  if (!onboarded) {
    const stepTitles = [t.onboard.lang, ...t.onboard.steps];
    return (
      <div style={s.appWrap}>
        <style>{globalCSS}</style>
        <div style={{ minHeight: "100vh", padding: "48px 24px 40px", maxWidth: 400, margin: "0 auto" }}>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ ...s.logo, marginBottom: 8, lineHeight: 0.85 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", color: C.accent }}>Peachy</span><br/>
              <span style={{ fontFamily: "'Syne', sans-serif" }}>Pump</span>
            </h1>
            <p style={{ fontSize: 14, color: C.textMuted, fontWeight: 600 }}>{t.onboard.subtitle}</p>
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
            {[0, 1, 2, 3].map(step => (
              <div key={step} style={{ flex: 1, textAlign: "center" }}>
                <div style={{
                  height: 4, borderRadius: 2, marginBottom: 6,
                  background: step <= onboardStep ? C.accent : C.border,
                  transition: "background 0.3s"
                }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: step === onboardStep ? C.accent : C.textMuted }}>{stepTitles[step]}</span>
              </div>
            ))}
          </div>

          {onboardStep === 0 && (
            <div style={{ animation: "viewSlideIn 0.3s ease" }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: C.text, marginBottom: 20 }}>{t.onboard.lang}</h2>
              <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                {[{ id: "cs", label: "Čeština" }, { id: "en", label: "English" }].map(l => (
                  <button key={l.id} onClick={() => setLang(l.id)}
                    style={{ ...s.genderBtn, flex: 1, fontSize: 15, padding: "16px 0", ...(lang === l.id ? s.genderBtnActive : {}) }}>
                    {l.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setOnboardStep(1)}
                style={{ ...s.generateBtn }}><div style={s.shimmer} />{t.onboard.next}</button>
            </div>
          )}

          {onboardStep === 1 && (
            <div style={{ animation: "viewSlideIn 0.3s ease" }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: C.text, marginBottom: 6 }}>{t.onboard.eqTitle}</h2>
              <p style={{ fontSize: 14, color: C.textSec, marginBottom: 20, fontWeight: 600 }}>{t.onboard.eqSub}</p>
              <div style={s.eqGrid}>
                {EQUIPMENT_OPTIONS.map(eqOpt => (
                  <button key={eqOpt.id} onClick={() => toggleEquipment(eqOpt.id)}
                    style={{ ...s.eqBtn, ...(equipment.includes(eqOpt.id) ? s.eqBtnActive : {}) }}>
                    {I(EQ_ICONS[eqOpt.id] || IC.dumbbell, 28)}
                    <span style={{ fontSize: 13 }}>{eq[eqOpt.id]}</span>
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button onClick={() => setOnboardStep(0)} style={{ ...s.backBtn, width: 48, height: 48 }}>{I(IC.back, 22)}</button>
                <button onClick={() => setOnboardStep(2)}
                  style={{ ...s.generateBtn, flex: 1 }} disabled={equipment.length === 0}>
                  <div style={s.shimmer} />{t.onboard.next}
                </button>
              </div>
            </div>
          )}

          {onboardStep === 2 && (
            <div style={{ animation: "viewSlideIn 0.3s ease" }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: C.text, marginBottom: 6 }}>{t.onboard.aboutTitle}</h2>
              <p style={{ fontSize: 14, color: C.textSec, marginBottom: 20, fontWeight: 600 }}>{t.onboard.aboutSub}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                <div style={{ background: C.cardGrad, borderRadius: C.r, padding: 16, border: C.cardBorder, boxShadow: C.shadow }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 6 }}>{t.onboard.age}</label>
                  <input type="number" value={profile.age || ""} onChange={e => setProfile(p => ({ ...p, age: e.target.value }))} style={s.profileInput} placeholder="25" />
                </div>
                <div style={{ background: C.cardGrad, borderRadius: C.r, padding: 16, border: C.cardBorder, boxShadow: C.shadow }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 6 }}>{t.onboard.weight}</label>
                  <input type="number" value={profile.weight || ""} onChange={e => setProfile(p => ({ ...p, weight: e.target.value }))} style={s.profileInput} placeholder="70" />
                </div>
              </div>
              <div style={{ background: C.cardGrad, borderRadius: C.r, padding: 16, border: C.cardBorder, boxShadow: C.shadow, marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 8 }}>{t.onboard.gender}</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setProfile(p => ({ ...p, gender: "female" }))}
                    style={{ ...s.genderBtn, ...(profile.gender === "female" ? s.genderBtnActive : {}) }}>{t.onboard.female}</button>
                  <button onClick={() => setProfile(p => ({ ...p, gender: "male" }))}
                    style={{ ...s.genderBtn, ...(profile.gender === "male" ? s.genderBtnActive : {}) }}>{t.onboard.male}</button>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setOnboardStep(1)} style={{ ...s.backBtn, width: 48, height: 48 }}>{I(IC.back, 22)}</button>
                <button onClick={() => setOnboardStep(3)}
                  style={{ ...s.generateBtn, flex: 1 }} disabled={!profile.age || !profile.weight}>
                  <div style={s.shimmer} />{t.onboard.next}
                </button>
              </div>
            </div>
          )}

          {onboardStep === 3 && (
            <div style={{ animation: "viewSlideIn 0.3s ease" }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: C.text, marginBottom: 6 }}>{t.onboard.liftTitle}</h2>
              <p style={{ fontSize: 14, color: C.textSec, marginBottom: 20, fontWeight: 600 }}>{t.onboard.liftSub}</p>
              {KEY_LIFT_EXERCISES.map(name => (
                <div key={name} style={{ background: C.cardGrad, borderRadius: C.r, padding: "12px 16px", border: C.cardBorder, boxShadow: C.shadow, marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.text, flex: 1 }}>{exName(name)}</span>
                  <input type="number" value={profile.keyLifts?.[name] || ""}
                    onChange={e => setProfile(p => ({ ...p, keyLifts: { ...p.keyLifts, [name]: e.target.value ? parseFloat(e.target.value) : "" } }))}
                    style={{ ...s.profileInput, width: 80, marginTop: 0, textAlign: "center" }} placeholder="kg" />
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button onClick={() => setOnboardStep(2)} style={{ ...s.backBtn, width: 48, height: 48 }}>{I(IC.back, 22)}</button>
                <button onClick={finishOnboarding}
                  style={{ ...s.generateBtn, flex: 1 }}>
                  <div style={s.shimmer} />{I(IC.zap, 22, "#fff")} {t.onboard.letsGo}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== COMPUTED VALUES =====
  const recoveries = {};
  MUSCLE_GROUPS.forEach(mg => { recoveries[mg] = getRecoveryStatus(mg, history); });

  const totalWorkouts = history.length;
  const thisWeek = history.filter(w => {
    const diffDays = (Date.now() - new Date(w.date).getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }).length;

  const cycleInfo = getCycleInfo(cycle);
  const weakPoints = history.length >= 5 ? analyzeWeakPoints(history) : [];

  // ===== MAIN RENDER =====
  return (
    <div style={s.appWrap}>
      <style>{globalCSS}</style>

      {toastMsg && <div style={s.toast}>{toastMsg}</div>}

      {celebration && (() => {
        const cc = [C.accent, C.mint, C.peach, C.rose, C.sky, C.mintDark, "#FF69B4", "#A78BFA", "#34D399"];
        const pieces = Array.from({ length: 60 }, (_, i) => ({
          id: i, left: Math.random() * 100, delay: Math.random() * 2.5,
          duration: 2 + Math.random() * 3, color: cc[i % cc.length],
          size: 5 + Math.random() * 10, shape: i % 4, rotate: Math.random() * 360
        }));
        const bursts = Array.from({ length: 6 }, (_, i) => ({
          id: i, x: 15 + Math.random() * 70, y: 10 + Math.random() * 80,
          size: 200 + Math.random() * 400, delay: i * 0.4 + Math.random() * 0.3,
          color: cc[i % cc.length], duration: 1.5 + Math.random() * 1.5
        }));
        const rings = Array.from({ length: 4 }, (_, i) => ({
          id: i, x: 20 + Math.random() * 60, y: 20 + Math.random() * 60,
          size: 150 + Math.random() * 300, delay: 0.2 + i * 0.6,
          color: cc[(i + 3) % cc.length], duration: 1.5 + Math.random()
        }));
        const quotes = t.celebration.quotes;
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        return (
          <div style={{
            position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
          }} onClick={() => { setCelebration(null); navigateView("home"); }}>

            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(-45deg, ${C.accent}dd, ${C.rose}cc, ${C.peach}dd, ${C.mint}cc, ${C.sky}dd, ${C.accent}cc)`,
              backgroundSize: "400% 400%",
              animation: "bgColorShift 4s ease infinite"
            }} />

            {bursts.map(b => (
              <div key={`b${b.id}`} style={{
                position: "absolute", left: `${b.x}%`, top: `${b.y}%`,
                width: b.size, height: b.size, borderRadius: "50%",
                background: `radial-gradient(circle, ${b.color}aa 0%, transparent 70%)`,
                animation: `burstExpand ${b.duration}s ${b.delay}s ease-out infinite`,
                transform: "translate(-50%, -50%) scale(0)", pointerEvents: "none"
              }} />
            ))}

            {rings.map(r => (
              <div key={`r${r.id}`} style={{
                position: "absolute", left: `${r.x}%`, top: `${r.y}%`,
                width: r.size, height: r.size, borderRadius: "50%",
                border: `4px solid ${r.color}`,
                background: "transparent",
                animation: `ringExpand ${r.duration}s ${r.delay}s ease-out infinite`,
                transform: "translate(-50%, -50%) scale(0)", pointerEvents: "none"
              }} />
            ))}

            {pieces.map(p => (
              <div key={`c${p.id}`} style={{
                position: "fixed", top: -20, left: `${p.left}%`,
                width: p.shape === 2 ? 0 : p.shape === 3 ? p.size * 0.4 : p.size,
                height: p.shape === 3 ? p.size * 1.8 : (p.shape === 2 ? 0 : p.size),
                borderRadius: p.shape === 0 ? "50%" : p.shape === 1 ? "2px" : p.shape === 3 ? "2px" : 0,
                ...(p.shape === 2 ? { borderLeft: `${p.size/2}px solid transparent`, borderRight: `${p.size/2}px solid transparent`, borderBottom: `${p.size}px solid ${p.color}` } : { background: p.color }),
                transform: `rotate(${p.rotate}deg)`,
                animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
                opacity: 0, pointerEvents: "none", zIndex: 10000
              }} />
            ))}

            <div onClick={e => e.stopPropagation()} style={{
              background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              borderRadius: 28, padding: "44px 32px 36px", maxWidth: 340, width: "90%",
              textAlign: "center", animation: "celebFadeIn 0.5s ease",
              boxShadow: "0 24px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.5) inset",
              position: "relative", zIndex: 10001, overflow: "hidden"
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.accent}, ${C.mint}, ${C.peach}, ${C.rose}, ${C.sky}, ${C.accent})`, backgroundSize: "200% 100%", animation: "shimmer 2s linear infinite" }} />

              <div style={{ position: "relative", width: 120, height: 80, margin: "0 auto 16px" }}>
                {[
                  { x: "50%", y: "50%", s: 70, c: C.accent, d: 0 },
                  { x: "18%", y: "30%", s: 40, c: C.mint, d: 0.3 },
                  { x: "80%", y: "25%", s: 36, c: C.rose, d: 0.5 },
                  { x: "30%", y: "75%", s: 32, c: C.peach, d: 0.7 },
                  { x: "75%", y: "70%", s: 28, c: C.sky, d: 0.9 },
                  { x: "10%", y: "60%", s: 20, c: C.mintDark, d: 1.1 },
                  { x: "90%", y: "50%", s: 22, c: "#FF69B4", d: 0.6 },
                ].map((blob, i) => (
                  <div key={i} style={{
                    position: "absolute", left: blob.x, top: blob.y,
                    width: blob.s, height: blob.s, borderRadius: "50%",
                    background: `radial-gradient(circle, ${blob.c} 0%, ${blob.c}66 50%, transparent 70%)`,
                    animation: `burstExpand 2s ${blob.d}s ease-out infinite`,
                    transform: "translate(-50%, -50%) scale(0)", pointerEvents: "none"
                  }} />
                ))}
              </div>

              <h2 style={{ fontFamily: "Syne, " + F, fontSize: 28, fontWeight: 900, color: C.text, marginBottom: 6, letterSpacing: -0.5 }}>{t.celebration.done}</h2>
              <p style={{ fontFamily: F, fontSize: 15, color: C.textSec, marginBottom: 28, lineHeight: 1.5, fontWeight: 600 }}>{quote}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                <div style={{ background: `linear-gradient(135deg, ${C.accentLight}, rgba(255,255,255,0.6))`, borderRadius: 16, padding: "14px 8px", border: "1px solid rgba(255,255,255,0.5)" }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: C.accent, fontFamily: "Syne, " + F, animation: "countUp 0.6s 0.3s ease both" }}>{celebration.exercises}</div>
                  <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, fontFamily: F, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{t.celebration.exercises}</div>
                </div>
                <div style={{ background: `linear-gradient(135deg, ${C.mint}40, rgba(255,255,255,0.6))`, borderRadius: 16, padding: "14px 8px", border: "1px solid rgba(255,255,255,0.5)" }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: C.mintDark, fontFamily: "Syne, " + F, animation: "countUp 0.6s 0.5s ease both" }}>{celebration.sets}</div>
                  <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, fontFamily: F, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{t.celebration.sets}</div>
                </div>
                <div style={{ background: `linear-gradient(135deg, ${C.sky}60, rgba(255,255,255,0.6))`, borderRadius: 16, padding: "14px 8px", border: "1px solid rgba(255,255,255,0.5)" }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: "#4E8EB8", fontFamily: "Syne, " + F, animation: "countUp 0.6s 0.7s ease both" }}>{celebration.duration || 0}</div>
                  <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, fontFamily: F, marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{t.celebration.minutes}</div>
                </div>
              </div>
              {celebration.prs?.length > 0 && (
                <div style={{ marginBottom: 16, animation: "celebFadeIn 0.8s 0.6s ease both" }}>
                  {celebration.prs.map((pr, i) => (
                    <div key={i} style={{
                      background: `linear-gradient(135deg, ${C.accent}20, ${C.rose}20)`, borderRadius: 12,
                      padding: "10px 14px", marginBottom: 6, display: "flex", alignItems: "center", gap: 10,
                      border: `1px solid ${C.accent}30`, animation: "prGlow 2s ease infinite"
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d={IC.zap} stroke={C.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <div style={{ flex: 1, textAlign: "left" }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{pr.name}</div>
                        <div style={{ fontSize: 11, color: C.accent, fontWeight: 700 }}>{pr.prev} → {pr.now} kg</div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 900, color: C.accent, letterSpacing: 1 }}>PR!</span>
                    </div>
                  ))}
                </div>
              )}
              {celebration.milestone && (
                <div style={{
                  background: "linear-gradient(135deg, #1a1a1a, #333)", borderRadius: 14,
                  padding: "16px 20px", marginBottom: 20, animation: "celebFadeIn 0.8s 0.4s ease both",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8 21h8m-4-4v4M5 3h14l-1.5 6.5a2 2 0 01-2 1.5h-7a2 2 0 01-2-1.5L5 3z" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 3L2 8h4M19 3l3 5h-4" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span style={{ fontSize: 18, fontWeight: 900, color: "#FFD700", fontFamily: "Syne, " + F, letterSpacing: -0.3 }}>{t.celebration.milestone(celebration.milestone)}</span>
                </div>
              )}
              <div style={{ fontSize: 13, color: C.textMuted, fontFamily: F, fontWeight: 600, marginBottom: 4 }}>#{celebration.workoutNum} · {celebration.split}</div>
              <button onClick={() => { setCelebration(null); navigateView("home"); }} style={{
                ...s.generateBtn, marginTop: 20, fontSize: 16, position: "relative", overflow: "hidden"
              }}><div style={s.shimmer} />{t.celebration.next}</button>
            </div>
          </div>
        );
      })()}

      {/* Exercise detail modal */}
      {selectedExercise && (() => {
        const exLib = (() => {
          for (const g of Object.keys(EXERCISE_LIBRARY)) {
            const found = EXERCISE_LIBRARY[g].find(e => e.name === selectedExercise.name);
            if (found) return found;
          }
          return null;
        })();
        const exHist = getExerciseHistory(selectedExercise.name, history, 8);
        return (
          <div style={s.modalOverlay} onClick={() => setSelectedExercise(null)}>
            <div style={{ ...s.modal, maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: 20, color: C.text }}>{exName(selectedExercise.name)}</h3>
                <button onClick={() => setSelectedExercise(null)} style={s.closeBtn}>{I(IC.x, 18)}</button>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                <span style={{ ...s.modalBadge, background: (GROUP_COLORS[selectedExercise.muscleGroup] || {}).bg, color: (GROUP_COLORS[selectedExercise.muscleGroup] || {}).text }}>{mgL[selectedExercise.muscleGroup] || selectedExercise.muscleGroup || ""}</span>
                {exLib?.muscles && <span style={{ ...s.modalBadge, background: "rgba(138,180,248,0.12)", color: "#5A8AD4" }}>{exLib.muscles}</span>}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8, fontSize: 13, color: C.textSec }}>
                {selectedExercise.difficulty && (
                  <span>{selectedExercise.difficulty === "beginner" ? `🟢 ${t.modal.beginner}` : selectedExercise.difficulty === "intermediate" ? `🟡 ${t.modal.intermediate}` : `🔴 ${t.modal.advanced}`}</span>
                )}
                {selectedExercise.type && (
                  <span>• {selectedExercise.type === "compound" ? t.modal.compoundM : t.modal.isolationM}</span>
                )}
              </div>

              <p style={{ color: C.textSec, fontSize: 15, lineHeight: 1.6, marginTop: 12 }}>{selectedExercise.desc || exLib?.desc}</p>

              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent((NAMES_EN[selectedExercise.name] || selectedExercise.name) + " exercise form")}`}
                target="_blank" rel="noopener noreferrer"
                style={s.videoBtn}
              >
                {I(IC.play, 18, "#fff")}
                <span>{t.modal.video}</span>
              </a>

              {exLib?.howTo && (
                <div style={s.modalSection}>
                  <h4 style={s.modalSectionTitle}>{t.modal.howTo}</h4>
                  <ol style={s.modalList}>
                    {exLib.howTo.map((step, i) => <li key={i} style={s.modalListItem}>{step}</li>)}
                  </ol>
                </div>
              )}

              {exLib?.mistakes && (
                <div style={s.modalSection}>
                  <h4 style={{ ...s.modalSectionTitle, color: "#D47070" }}>{t.modal.mistakes}</h4>
                  <ul style={s.modalList}>
                    {exLib.mistakes.map((m, i) => <li key={i} style={{ ...s.modalListItem, color: "#C47070" }}>{m}</li>)}
                  </ul>
                </div>
              )}

              {exHist.length > 0 && (
                <div style={s.modalSection}>
                  <h4 style={s.modalSectionTitle}>{t.modal.history}</h4>
                  <div style={s.historyTable}>
                    <div style={s.historyHeader}>
                      <span style={s.historyCell}>{t.modal.date}</span>
                      <span style={s.historyCell}>{t.modal.weightCol}</span>
                      <span style={s.historyCell}>{t.modal.avgReps}</span>
                      <span style={s.historyCell}>{t.modal.series}</span>
                      <span style={{ ...s.historyCell, width: 36 }}>RPE</span>
                    </div>
                    {exHist.map((h, i) => (
                      <div key={i} style={s.historyRow}>
                        <span style={s.historyCell}>{new Date(h.date).toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric" })}</span>
                        <span style={{ ...s.historyCell, color: C.text, fontWeight: 600 }}>{h.maxWeight} kg</span>
                        <span style={s.historyCell}>{h.avgReps}</span>
                        <span style={s.historyCell}>{h.sets}×</span>
                        <span style={{ ...s.historyCell, width: 36 }}>{h.rpe ? (() => { const rc = h.rpe === "easy" ? C.mintDark : h.rpe === "moderate" ? "#B87A4E" : "#C45A6A"; const bars = h.rpe === "easy" ? 1 : h.rpe === "moderate" ? 2 : 3; return <span style={{ display: "inline-flex", gap: 1.5, alignItems: "flex-end", height: 14 }}>{[1,2,3].map(b => <span key={b} style={{ display: "inline-block", width: 3, borderRadius: 1.5, height: b * 3 + 2, background: b <= bars ? rc : C.border }} />)}</span>; })() : "–"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Swap exercise modal */}
      {swapTarget !== null && currentWorkout && (() => {
        const targetEx = currentWorkout.exercises[swapTarget];
        const currentNames = currentWorkout.exercises.map(e => e.name);
        const { mine, other } = getExerciseAlternatives(targetEx, equipment, currentNames);
        const renderAlt = (alt, i) => (
          <button key={i} onClick={() => swapExercise(swapTarget, alt)} style={s.libraryItem}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontWeight: 600, color: C.text, fontSize: 15 }}>{exName(alt.name)}</div>
              {lang === "cs" && NAMES_EN[alt.name] && NAMES_EN[alt.name] !== alt.name && (
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>{NAMES_EN[alt.name]}</div>
              )}
            </div>
            <div style={{ color: C.textSec, fontSize: 12, marginTop: 4 }}>
              {alt.type === "compound" ? t.modal.compoundM : t.modal.isolationM}
              {alt.movementPattern !== "isolation" && alt.movementPattern !== "core" ? ` · ${alt.movementPattern.replace("_", " ")}` : ""}
              {alt.movementPattern === targetEx.movementPattern ? ` · ${t.modal.sameMove}` : ""}
            </div>
          </button>
        );
        return (
          <div style={s.modalOverlay} onClick={() => setSwapTarget(null)}>
            <div style={{ ...s.modal, maxHeight: "80vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 18, color: C.text }}>{t.modal.swap}: {exName(targetEx.name)}</h3>
                <button onClick={() => setSwapTarget(null)} style={s.closeBtn}>{I(IC.x, 18)}</button>
              </div>
              {mine.length === 0 && other.length === 0 && <p style={{ color: C.textSec }}>{t.modal.noAlts}</p>}
              {mine.length > 0 && (
                <>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>{t.modal.yourEquip}</div>
                  {mine.map(renderAlt)}
                </>
              )}
              {other.length > 0 && (
                <>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginTop: mine.length > 0 ? 16 : 0, marginBottom: 8 }}>{t.modal.otherOptions}</div>
                  {other.map(renderAlt)}
                </>
              )}
            </div>
          </div>
        );
      })()}

      {/* ===== HOME VIEW ===== */}
      {view === "home" && (
        <div style={{ ...s.page, animation: `${viewTransition.direction === "forward" ? "viewSlideIn" : "viewSlideInReverse"} 0.3s ease` }}>
          <div style={s.headerArea}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 }}>
              <h1 style={{ ...s.logo, marginBottom: 0, lineHeight: 0.85 }}><span style={{ fontFamily: "'Syne', sans-serif", color: C.accent }}>Peachy</span><br/><span style={{ fontFamily: "'Syne', sans-serif" }}>Pump</span></h1>
              <div style={{ display: "flex", gap: 10, alignItems: "center", paddingBottom: 4 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: C.text }}>{totalWorkouts}</div>
                  <div style={{ fontSize: 8, fontWeight: 700, color: C.textMuted, textTransform: "uppercase" }}>{t.home.total}</div>
                </div>
                <div style={{ width: 1, height: 20, background: C.border }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: C.text }}>{thisWeek}</div>
                  <div style={{ fontSize: 8, fontWeight: 700, color: C.textMuted, textTransform: "uppercase" }}>{t.home.week}</div>
                </div>
              </div>
            </div>

            <img src="/hero.png" alt="" style={{ width: "110%", marginLeft: "-5%", height: "auto", display: "block", marginBottom: 20 }} />

            {currentWorkout ? (
              <button onClick={() => { if (!workoutStartTime) setWorkoutStartTime(Date.now()); navigateView("workout"); }} style={s.generateBtn}>
                <div style={s.shimmer} />
                {I(IC.zap, 22, "#fff")}
                <span>{t.home.continueWorkout}</span>
              </button>
            ) : (
              <button onClick={genWorkout} style={s.generateBtn}>
                <div style={s.shimmer} />
                {I(IC.zap, 22, "#fff")}
                <span>{t.home.generate}</span>
              </button>
            )}
          </div>

          {/* Streak + Calendar + Bento */}
          {(() => {
            const streak = (() => {
              if (history.length === 0) return 0;
              let count = 0;
              const now = new Date();
              const currentWeekStart = new Date(now);
              currentWeekStart.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
              currentWeekStart.setHours(0, 0, 0, 0);
              const hasWorkoutInWeek = (weekStart) => {
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 7);
                return history.some(w => {
                  const d = new Date(w.date);
                  return d >= weekStart && d < weekEnd;
                });
              };
              let checkWeek = new Date(currentWeekStart);
              if (!hasWorkoutInWeek(checkWeek)) {
                checkWeek.setDate(checkWeek.getDate() - 7);
              }
              while (hasWorkoutInWeek(checkWeek)) {
                count++;
                checkWeek.setDate(checkWeek.getDate() - 7);
              }
              return count;
            })();

            const calendarWeeks = 12;
            const calendarData = (() => {
              const cells = [];
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              for (let i = calendarWeeks * 7 - 1; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                const dayStr = d.toISOString().slice(0, 10);
                const count = history.filter(w => w.date?.slice(0, 10) === dayStr).length;
                cells.push({ date: d, count, dayStr });
              }
              return cells;
            })();

            return (<>
              {/* Streak */}
              {streak > 0 && (
                <div style={{
                  marginTop: 16, padding: "16px 20px", borderRadius: C.r, border: C.cardBorder,
                  background: C.cardGrad, boxShadow: C.shadow, display: "flex", alignItems: "center", gap: 14
                }}>
                  <div style={{ display: "flex", gap: 3 }}>
                    {Array.from({ length: Math.min(streak, 8) }, (_, i) => (
                      <div key={i} style={{
                        width: 8, height: 8, borderRadius: "50%", background: C.accent,
                        animation: `countUp 0.3s ${i * 0.08}s ease both`
                      }} />
                    ))}
                    {streak > 8 && <span style={{ fontSize: 11, color: C.accent, fontWeight: 700, lineHeight: "8px" }}>+{streak - 8}</span>}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                    {t.home.streak(streak)}
                  </div>
                </div>
              )}

              {/* Monthly training summary */}
              {history.length > 0 && (() => {
                const now = new Date();
                const monthNamesFull = t.home.months;
                const viewDate = new Date(now.getFullYear(), now.getMonth() + calendarOffset, 1);
                const viewMonth = viewDate.getMonth();
                const viewYear = viewDate.getFullYear();
                const isCurrentMonth = calendarOffset === 0;
                const monthCount = history.filter(w => {
                  const d = new Date(w.date);
                  return d.getMonth() === viewMonth && d.getFullYear() === viewYear;
                }).length;
                const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
                const todayDate = now.getDate();
                const dots = [];
                for (let d = 1; d <= daysInMonth; d++) {
                  const ds = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                  const count = history.filter(w => w.date?.slice(0, 10) === ds).length;
                  const isToday = isCurrentMonth && d === todayDate;
                  const isPast = isCurrentMonth ? d <= todayDate : calendarOffset < 0;
                  dots.push({ day: d, count, isToday, isPast });
                }

                const oldestDate = history.length > 0
                  ? new Date(history[history.length - 1].date)
                  : now;
                const minOffset = (oldestDate.getFullYear() - now.getFullYear()) * 12 + (oldestDate.getMonth() - now.getMonth());

                return (
                  <div style={{
                    marginTop: 12, padding: 16, borderRadius: C.r, border: C.cardBorder,
                    background: C.cardGrad, boxShadow: C.shadow
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button onClick={() => setCalendarOffset(o => Math.max(minOffset, o - 1))} style={{
                          background: "none", border: "none", cursor: "pointer", padding: 4,
                          color: calendarOffset <= minOffset ? C.textMuted : C.text, opacity: calendarOffset <= minOffset ? 0.3 : 1,
                          fontSize: 16, fontWeight: 900, lineHeight: 1
                        }} disabled={calendarOffset <= minOffset}>‹</button>
                        <div style={{ fontSize: 13, fontWeight: 800, color: C.text, minWidth: 80, textAlign: "center" }}>
                          {monthNamesFull[viewMonth]}{!isCurrentMonth && viewYear !== now.getFullYear() ? ` ${viewYear}` : ""}
                        </div>
                        <button onClick={() => setCalendarOffset(o => Math.min(0, o + 1))} style={{
                          background: "none", border: "none", cursor: "pointer", padding: 4,
                          color: isCurrentMonth ? C.textMuted : C.text, opacity: isCurrentMonth ? 0.3 : 1,
                          fontSize: 16, fontWeight: 900, lineHeight: 1
                        }} disabled={isCurrentMonth}>›</button>
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: C.accent }}>{monthCount}<span style={{ fontSize: 12, fontWeight: 700, color: C.textMuted }}> {t.home.workouts(monthCount)}</span></div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
                      {t.home.days.map(d => (
                        <div key={d} style={{ fontSize: 9, fontWeight: 700, color: C.textMuted, textAlign: "center", paddingBottom: 2 }}>{d}</div>
                      ))}
                      {(() => {
                        const firstDay = new Date(viewYear, viewMonth, 1).getDay();
                        const offset = firstDay === 0 ? 6 : firstDay - 1;
                        return Array.from({ length: offset }, (_, i) => <div key={`e${i}`} />);
                      })()}
                      {dots.map(d => (
                        <div key={d.day} style={{
                          aspectRatio: "1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: d.count > 0 ? 800 : 600,
                          color: d.count > 0 ? "#fff" : d.isToday ? C.accent : d.isPast ? C.text : C.textMuted,
                          background: d.count > 0 ? C.accent : d.isToday ? `${C.accent}18` : "transparent",
                          border: d.isToday && d.count === 0 ? `1.5px solid ${C.accent}` : "1.5px solid transparent"
                        }}>
                          {d.day}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </>);
          })()}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
            {/* Cycle indicator with progress ring */}
            {cycle && (() => {
              const phaseColors = { Akumulace: C.accent, Zesilování: "#FFBE98", Peak: "#D47070", Deload: C.mintDark };
              const phaseDesc = t.home.phaseDesc;
              const currentColor = phaseColors[cycleInfo.label] || C.accent;
              const pct = (cycleInfo.week / 4) * 100;
              const circumference = 2 * Math.PI * 40;
              const offset = circumference - (pct / 100) * circumference;
              return (
                <div style={{ ...s.cycleCard, gridColumn: "1 / -1", marginBottom: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ position: "relative", width: 68, height: 68, flexShrink: 0 }}>
                      <svg width="68" height="68" viewBox="0 0 88 88" style={{ transform: "rotate(-90deg)" }}>
                        <circle cx="44" cy="44" r="40" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="6" />
                        <circle cx="44" cy="44" r="40" fill="none" stroke={currentColor} strokeWidth="6"
                          strokeLinecap="round" strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          style={{ animation: "ringProgress 1s ease forwards", transition: "stroke-dashoffset 0.5s ease" }} />
                      </svg>
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 18, fontWeight: 900, color: currentColor }}>{cycleInfo.week}</span>
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{t.home.mesocycle}</div>
                      <div style={{ color: C.text, fontSize: 17, fontWeight: 900, marginTop: 4 }}>
                        {t.home.weekOf} {cycleInfo.week}/4 · {t.home.phases[cycleInfo.label] || cycleInfo.label}
                      </div>
                      <div style={{ color: C.textSec, fontSize: 12, fontWeight: 600, marginTop: 4, lineHeight: 1.4 }}>
                        {phaseDesc[cycleInfo.label]}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>

          {/* Muscle recovery - accordion */}
          <div style={{ ...s.accordionWrap, marginTop: 10 }}>
            <button onClick={() => setOpenSections(p => ({ ...p, recovery: !p.recovery }))}
              style={s.accordionBtn}>
              <span style={s.sectionTitle}>{t.home.recovery}</span>
              <div style={{ ...s.accordionChev, transform: openSections.recovery ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease" }}>
                {I(IC.chevDown, 14, C.textMuted)}
              </div>
            </button>
            {openSections.recovery && (
              <div style={{ ...s.accordionBody, animation: "slideUp 0.2s ease" }}>
                <div style={s.recoveryGrid}>
                  {MUSCLE_GROUPS.map(mg => {
                    const r = recoveries[mg];
                    const color = r.pct >= 80 ? C.mintDark : r.pct >= 50 ? C.accent : "#D47070";
                    return (
                      <div key={mg} style={s.recoveryItem}>
                        <div style={s.recoveryLabel}>{mgL[mg] || mg}</div>
                        <div style={s.recoveryBarBg}>
                          <div style={{ ...s.recoveryBarFill, width: `${r.pct}%`, background: color }} />
                        </div>
                        <div style={{ ...s.recoveryPct, color }}>{r.pct}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Weekly volume - accordion */}
          <div style={{ ...s.accordionWrap, marginTop: 10 }}>
            <button onClick={() => setOpenSections(p => ({ ...p, volume: !p.volume }))}
              style={s.accordionBtn}>
              <span style={s.sectionTitle}>Týdenní objem</span>
              <div style={{ ...s.accordionChev, transform: openSections.volume ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease" }}>
                {I(IC.chevDown, 14, C.textMuted)}
              </div>
            </button>
            {openSections.volume && (
              <div style={{ ...s.accordionBody, animation: "slideUp 0.2s ease" }}>
                {MUSCLE_GROUPS.map(mg => {
                  const vol = getWeeklyVolume(mg, history);
                  const target = VOLUME_TARGETS[mg];
                  const pct = Math.min(100, Math.round((vol / target.max) * 100));
                  const color = vol >= target.min ? (vol <= target.max ? C.mintDark : C.accent) : (vol === 0 ? C.textMuted : "#D47070");
                  return (
                    <div key={mg} style={s.recoveryItem}>
                      <div style={{ color: C.textSec, fontSize: 14, fontWeight: 600 }}>{mg}</div>
                      <div style={s.recoveryBarBg}>
                        <div style={{ height: "100%", borderRadius: 4, background: color, width: `${pct}%`, transition: "width 0.5s ease" }} />
                      </div>
                      <div style={{ color, fontSize: 14, fontWeight: 700, textAlign: "right" }}>{vol}/{target.max}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Strength progression */}
          {history.length >= 2 && (() => {
            const exerciseNames = new Set();
            history.forEach(w => w.exercises.forEach(ex => {
              if (ex.logged && ex.setDetails?.some(s => s.done && s.weight)) exerciseNames.add(ex.name);
            }));
            const progressData = [];
            for (const name of exerciseNames) {
              const pts = getStrengthHistory(name, history, 10);
              if (pts.length >= 2) {
                const first = pts[0].weight;
                const last = pts[pts.length - 1].weight;
                const diff = last - first;
                if (diff !== 0) progressData.push({ name, first, last, diff, pts });
              }
            }
            if (progressData.length === 0) return null;
            progressData.sort((a, b) => b.diff - a.diff);
            return (
              <div style={s.section}>
                <h2 style={{ ...s.sectionTitle, marginBottom: 12 }}>Progrese</h2>
                {progressData.slice(0, 6).map((p, i) => (
                  <div key={i} style={s.progressItem}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                      <div style={{ color: C.textMuted, fontSize: 12, marginTop: 2 }}>
                        {p.first} → {p.last} kg
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: p.diff > 0 ? C.mintDark : "#D47070" }}>
                      {p.diff > 0 ? "+" : ""}{p.diff} kg
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Weak points */}
          {weakPoints.length > 0 && (
            <div style={s.section}>
              <h2 style={{ ...s.sectionTitle, marginBottom: 12 }}>Slabé stránky</h2>
              {weakPoints.map((wp, i) => (
                <div key={i} style={s.weakPointCard}>
                  <div style={{ color: C.text, fontWeight: 700, fontSize: 13 }}>{wp.label}</div>
                  <div style={{ color: C.textMuted, fontSize: 12, marginTop: 3 }}>{wp.message}</div>
                </div>
              ))}
            </div>
          )}

          {history.length > 0 && (
            <div style={s.section}>
              <h2 style={{ ...s.sectionTitle, marginBottom: 12 }}>Poslední tréninky</h2>
              {history.slice(0, 5).map((w, i) => (
                <div key={i} style={s.historyCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{w.splitLabel}</div>
                      <div style={{ color: C.textMuted, fontSize: 12, marginTop: 3 }}>
                        {new Date(w.date).toLocaleDateString("cs-CZ", { day: "numeric", month: "short" })}
                        {w.weekLabel ? ` · ${w.weekLabel}` : ""}
                        {" · "}{w.exercises.length} cviků
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 12, background: w.completed ? C.mint : C.bg }}>{I(w.completed ? IC.check : IC.clock, 16, w.completed ? C.mintDark : C.textMuted)}</div>
                      <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(i); }}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 4, opacity: 0.4 }}>
                        {I(IC.trash, 14, C.textMuted)}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {deleteConfirm !== null && (
            <div style={s.modalOverlay} onClick={() => setDeleteConfirm(null)}>
              <div style={{ ...s.modal, textAlign: "center" }} onClick={e => e.stopPropagation()}>
                <div style={{ marginBottom: 16 }}>{I(IC.trash, 36, "#D47070")}</div>
                <h3 style={{ fontFamily: F, fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 8 }}>Smazat trénink?</h3>
                <p style={{ fontFamily: F, fontSize: 14, color: C.textSec, marginBottom: 24 }}>Tohle nejde vrátit zpět.</p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setDeleteConfirm(null)}
                    style={{ ...s.secondaryBtn, flex: 1, padding: "14px" }}>Zrušit</button>
                  <button onClick={() => deleteWorkout(deleteConfirm)}
                    style={{ ...s.primaryBtn, flex: 1, padding: "14px", background: "#D47070" }}>Smazat</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== WORKOUT VIEW ===== */}
      {view === "workout" && currentWorkout && (
        <div style={{ ...s.page, animation: `${viewTransition.direction === "forward" ? "viewSlideIn" : "viewSlideInReverse"} 0.3s ease` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <button onClick={() => navigateView("home")} style={s.backBtn}>{I(IC.back, 22)}</button>
            <div>
              <h2 style={{ margin: 0, color: C.text, fontSize: 22 }}>{t.workout.title}</h2>
              <div style={{ color: C.accent, fontSize: 14, fontWeight: 600, marginTop: 2 }}>
                {currentWorkout.splitLabel}
                {currentWorkout.weekLabel && <span style={{ color: C.textSec, fontWeight: 400 }}> · {currentWorkout.weekLabel}</span>}
              </div>
            </div>
          </div>

          {/* Rest timer toggle + timer display */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, padding: "10px 16px", borderRadius: C.r, background: C.cardGrad, border: C.cardBorder, boxShadow: C.shadow }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {I(IC.clock, 18, restTimer.enabled ? C.accent : C.textMuted)}
              <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{t.workout.rest}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {restTimer.enabled && (
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {[60, 90, 120].map(sec => (
                    <button key={sec} onClick={() => setRestTimer(prev => ({ ...prev, seconds: sec }))}
                      style={{ padding: "4px 8px", borderRadius: 8, border: "none", background: restTimer.seconds === sec ? C.accent : C.bg, color: restTimer.seconds === sec ? "#fff" : C.textMuted, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: F }}>
                      {sec}s
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => setRestTimer(prev => ({ ...prev, enabled: !prev.enabled, active: false, remaining: 0 }))}
                style={{
                  width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", position: "relative",
                  background: restTimer.enabled ? C.accent : "rgba(0,0,0,0.1)", transition: "background 0.2s", padding: 0
                }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 10, background: "#fff", position: "absolute", top: 2,
                  left: restTimer.enabled ? 22 : 2, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)"
                }} />
              </button>
            </div>
          </div>

          {restTimer.active && restTimer.remaining > 0 && (
            <div style={{
              textAlign: "center", padding: "16px", marginBottom: 14, borderRadius: C.r,
              background: `linear-gradient(135deg, ${C.accent}15, ${C.rose}15)`,
              border: `2px solid ${C.accent}40`, animation: "timerPulse 2s ease infinite"
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{t.workout.rest}</div>
              <div style={{ fontFamily: "Syne, " + F, fontSize: 42, fontWeight: 900, color: C.accent, marginTop: 4 }}>
                {Math.floor(restTimer.remaining / 60)}:{(restTimer.remaining % 60).toString().padStart(2, "0")}
              </div>
              <button onClick={() => { clearInterval(restTimerRef.current); setRestTimer(prev => ({ ...prev, active: false, remaining: 0 })); }}
                style={{ marginTop: 8, padding: "6px 20px", borderRadius: C.rPill, border: "none", background: C.bg, color: C.textSec, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: F }}>
                {t.workout.skip}
              </button>
            </div>
          )}

          <div style={s.progressBarBg}>
            <div style={{
              ...s.progressBarFill,
              width: `${currentWorkout.exercises.length > 0 ? (currentWorkout.exercises.filter(e => e.logged).length / currentWorkout.exercises.length) * 100 : 0}%`
            }} />
          </div>
          <div style={{ color: C.textSec, fontSize: 13, marginBottom: 20, textAlign: "center" }}>
            {currentWorkout.exercises.filter(e => e.logged).length} / {currentWorkout.exercises.length} {t.workout.done}
          </div>

          {(() => {
            const renderCard = (ex, exIdx) => (
              <div key={ex.id} style={{ ...s.exerciseCard, borderLeftColor: (GROUP_COLORS[ex.muscleGroup] || {}).bg || "transparent", ...(ex.logged ? s.exerciseCardDone : {}), marginBottom: ex.pairId ? 0 : 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <button onClick={() => setSelectedExercise(ex)} style={s.exNameBtn}>
                        {exName(ex.name)} <span style={{ opacity: 0.35, marginLeft: 4, display: "inline-flex", verticalAlign: "middle" }}>{I(IC.info, 15)}</span>
                      </button>
                      <button onClick={() => setSwapTarget(exIdx)} style={s.swapBtn} title="Vyměnit cvik">{I(IC.swap, 16)}</button>
                    </div>
                    {lang === "cs" && NAMES_EN[ex.name] && NAMES_EN[ex.name] !== ex.name && (
                      <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, marginTop: 1 }}>{NAMES_EN[ex.name]}</div>
                    )}
                    <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                      <span style={{ ...s.tagBadge, background: (GROUP_COLORS[ex.muscleGroup] || {}).bg, color: (GROUP_COLORS[ex.muscleGroup] || {}).text }}>{mgL[ex.muscleGroup] || ex.muscleGroup}</span>
                      <span style={{ ...s.tagBadge, background: C.accentLight, color: C.accent }}>
                        {ex.sets}×{ex.reps}
                      </span>
                      {ex.progressTag === "up" && (
                        <span style={{ ...s.tagBadge, background: "rgba(108,191,108,0.12)", color: "#4A9A4A" }}>{t.workout.tags.up}</span>
                      )}
                      {ex.progressTag === "same" && ex.lastWeight && (
                        <span style={{ ...s.tagBadge, background: "rgba(255,190,152,0.15)", color: "#C47040" }}>{t.workout.tags.same}</span>
                      )}
                      {ex.progressTag === "new" && (
                        <span style={{ ...s.tagBadge, background: "rgba(138,180,248,0.12)", color: "#5A8AD4" }}>{t.workout.tags.new}</span>
                      )}
                      {ex.progressTag === "deload" && (
                        <span style={{ ...s.tagBadge, background: "rgba(138,180,248,0.12)", color: "#5A8AD4" }}>{t.workout.tags.deload}</span>
                      )}
                      {ex.progressTag === "comeback" && (
                        <span style={{ ...s.tagBadge, background: "rgba(255,190,152,0.15)", color: "#C47040" }}>{t.workout.tags.comeback}</span>
                      )}
                      {ex.progressTag === "profile" && (
                        <span style={{ ...s.tagBadge, background: "rgba(138,180,248,0.12)", color: "#5A8AD4" }}>{t.workout.tags.profile}</span>
                      )}
                      {ex.noWeight && (
                        <span style={{ ...s.tagBadge, background: C.bg, color: C.textSec }}>{t.workout.tags.bodyweight}</span>
                      )}
                      {ex.isHold && (
                        <span style={{ ...s.tagBadge, background: C.sky, color: "#4E8EB8" }}>{t.workout.tags.hold}</span>
                      )}
                    </div>
                    {ex.noteKey && t.notes[ex.noteKey] && (
                      <div style={{ fontSize: 12, color: C.textSec, marginTop: 6, lineHeight: 1.4, fontStyle: "italic" }}>
                        {typeof t.notes[ex.noteKey] === "function" ? t.notes[ex.noteKey](ex.noteData || {}) : t.notes[ex.noteKey]}
                      </div>
                    )}
                  </div>
                  {ex.logged && <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 10, background: C.mint }}>{I(IC.check, 18, C.mintDark)}</span>}
                </div>
                <div style={s.setsContainer}>
                  <div style={{ ...s.setsHeader, gridTemplateColumns: ex.noWeight ? "36px 1fr 48px" : "36px 1fr 1fr 48px" }}>
                    <span style={s.setsHeaderCell}>{t.workout.set}</span>
                    {!ex.noWeight && <span style={s.setsHeaderCell}>{t.workout.weightKg}</span>}
                    <span style={s.setsHeaderCell}>{ex.isHold ? t.workout.timeS : t.workout.reps}</span>
                    <span style={{ ...s.setsHeaderCell, width: 48 }}></span>
                  </div>
                  {ex.setDetails.map((set, si) => (
                    <div key={si} style={{ ...s.setRow, gridTemplateColumns: ex.noWeight ? "36px 1fr 48px" : "36px 1fr 1fr 48px", ...(set.done ? s.setRowDone : {}) }}>
                      <span style={{ ...s.setCell, fontWeight: 700, color: C.textSec }}>{si + 1}</span>
                      {!ex.noWeight && (
                        <input type="number" placeholder={set.weight ? "–" : "kg?"} value={set.weight}
                          onChange={e => updateSetDetail(exIdx, si, "weight", e.target.value)} style={s.setInput} />
                      )}
                      <input type="number" placeholder={ex.isHold ? "30" : ex.reps} value={set.reps}
                        onChange={e => updateSetDetail(exIdx, si, "reps", e.target.value)}
                        style={{ ...s.setInput, ...(ex.isHold ? { background: C.sky } : {}) }} />
                      <button onClick={() => toggleSetDone(exIdx, si)}
                        style={{ ...s.checkBtn, ...(set.done ? s.checkBtnDone : {}), ...(setPopId === `${exIdx}-${si}` ? { animation: "popIn 0.4s ease" } : {}) }}>
                        {set.done ? I(IC.check, 16) : ""}
                      </button>
                    </div>
                  ))}
                </div>
                {ex.setDetails.every(s => s.done) && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "10px 18px 6px" }}>
                    {[
                      { val: "easy", color: C.mintDark, bg: C.mint, label: t.workout.easy },
                      { val: "moderate", color: C.accent, bg: C.accentLight, label: t.workout.moderate },
                      { val: "hard", color: "#C45A6A", bg: C.rose, label: t.workout.hard },
                    ].map(r => {
                      const active = ex.rpe === r.val;
                      return (
                        <button key={r.val} onClick={() => updateExerciseRpe(exIdx, r.val)}
                          style={{
                            flex: 1, padding: "8px 0", borderRadius: 10, border: "none", cursor: "pointer",
                            fontFamily: F, fontSize: 12, fontWeight: 700,
                            background: active ? r.bg : "rgba(0,0,0,0.03)",
                            color: active ? r.color : C.textMuted,
                            boxShadow: active ? `inset 0 0 0 2px ${r.color}` : "none",
                            transition: "all 0.2s ease",
                            opacity: ex.rpe && !active ? 0.4 : 1,
                          }}>
                          {r.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );

            const groups = [];
            const processed = new Set();
            const exs = currentWorkout.exercises;
            for (let i = 0; i < exs.length; i++) {
              if (processed.has(i)) continue;
              if (exs[i].pairId) {
                const j = exs.findIndex((e, idx) => idx > i && e.pairId === exs[i].pairId);
                if (j !== -1 && !processed.has(j)) {
                  processed.add(i);
                  processed.add(j);
                  groups.push({ type: "superset", indices: [i, j] });
                  continue;
                }
              }
              processed.add(i);
              groups.push({ type: "solo", indices: [i] });
            }

            return groups.map((g, gi) => {
              if (g.type === "superset") {
                const [a, b] = g.indices;
                return (
                  <div key={`ss_${gi}`} style={s.supersetWrap}>
                    <div style={s.supersetHeader}>
                      <span style={s.supersetBadge}>{t.workout.superset}</span>
                      <span style={{ color: C.textSec, fontSize: 12 }}>{t.workout.supersetHint}</span>
                    </div>
                    <div style={{ ...s.supersetCards, display: "flex", flexDirection: "column", gap: 20 }}>
                      <div>
                        <div style={{ ...s.supersetLabel, marginBottom: 8 }}>A</div>
                        {renderCard(exs[a], a)}
                      </div>
                      <div>
                        <div style={{ ...s.supersetLabel, marginBottom: 8 }}>B</div>
                        {renderCard(exs[b], b)}
                      </div>
                    </div>
                  </div>
                );
              }
              return renderCard(exs[g.indices[0]], g.indices[0]);
            });
          })()}

          <button onClick={finishWorkout} style={{ ...s.generateBtn, marginTop: 20 }}>
            {I(IC.flag, 22, "#fff")}
            <span>{t.workout.finish}</span>
          </button>
        </div>
      )}

      {/* ===== LIBRARY VIEW ===== */}
      {view === "library" && (
        <div style={{ ...s.page, animation: `${viewTransition.direction === "forward" ? "viewSlideIn" : "viewSlideInReverse"} 0.3s ease` }}>
          <h2 style={{ color: C.text, fontSize: 22, marginBottom: 16 }}>{t.library.title}</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {["Vše", ...MUSCLE_GROUPS].map(f => (
              <button key={f} onClick={() => setLibraryFilter(f)}
                style={{ ...s.filterBtn, ...(libraryFilter === f ? s.filterBtnActive : {}) }}>
                {f === "Vše" ? t.library.all : mgL[f] || f}
              </button>
            ))}
          </div>
          {(libraryFilter === "Vše" ? MUSCLE_GROUPS : [libraryFilter]).map(grp => (
            <div key={grp}>
              <h3 style={{ color: (GROUP_COLORS[grp] || {}).text || C.text, fontSize: 16, margin: "16px 0 10px", fontWeight: 800 }}>{mgL[grp] || grp}</h3>
              {(EXERCISE_LIBRARY[grp] || []).map((ex, i) => (
                <button key={i} onClick={() => setSelectedExercise({ ...ex, muscleGroup: grp })} style={s.libraryItem}>
                  <div style={{ fontWeight: 600, color: C.text, fontSize: 15 }}>{exName(ex.name)}</div>
                  <div style={{ color: C.textSec, fontSize: 13, marginTop: 4 }}>
                    <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, marginRight: 6, background: ex.difficulty === "beginner" ? C.mint : ex.difficulty === "intermediate" ? C.peach : C.rose, color: ex.difficulty === "beginner" ? C.mintDark : ex.difficulty === "intermediate" ? "#B87A4E" : "#C45A6A" }}>#{t.library[ex.difficulty]}</span>
                    {ex.type === "compound" ? t.library.compound : t.library.isolation}
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ===== SETTINGS VIEW ===== */}
      {view === "settings" && (
        <div style={{ ...s.page, animation: `${viewTransition.direction === "forward" ? "viewSlideIn" : "viewSlideInReverse"} 0.3s ease` }}>
          <h2 style={{ color: C.text, fontSize: 22, marginBottom: 16 }}>{t.settings.title}</h2>

          <h3 style={s.settingsHeading}>{t.settings.language}</h3>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[{ id: "cs", label: "Čeština" }, { id: "en", label: "English" }].map(l => (
              <button key={l.id} onClick={() => setLang(l.id)}
                style={{ ...s.genderBtn, flex: 1, ...(lang === l.id ? s.genderBtnActive : {}) }}>{l.label}</button>
            ))}
          </div>

          <h3 style={s.settingsHeading}>{t.settings.profile}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <label style={s.inputLabel}>{t.settings.age}
              <input type="number" value={profile.age || ""} onChange={e => setProfile(p => ({ ...p, age: e.target.value }))} style={s.profileInput} placeholder="25" />
            </label>
            <label style={s.inputLabel}>{t.settings.weight}
              <input type="number" value={profile.weight || ""} onChange={e => setProfile(p => ({ ...p, weight: e.target.value }))} style={s.profileInput} placeholder="70" />
            </label>
          </div>
          <label style={s.inputLabel}>{t.settings.gender}
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <button onClick={() => setProfile(p => ({ ...p, gender: "female" }))}
                style={{ ...s.genderBtn, ...(profile.gender === "female" ? s.genderBtnActive : {}) }}>{t.settings.female}</button>
              <button onClick={() => setProfile(p => ({ ...p, gender: "male" }))}
                style={{ ...s.genderBtn, ...(profile.gender === "male" ? s.genderBtnActive : {}) }}>{t.settings.male}</button>
            </div>
          </label>

          <h3 style={{ ...s.settingsHeading, marginTop: 28 }}>{t.settings.keyLifts}</h3>
          {KEY_LIFT_EXERCISES.map(name => (
            <label key={name} style={s.inputLabel}>{exName(name)}
              <input type="number" value={profile.keyLifts?.[name] || ""}
                onChange={e => setProfile(p => ({ ...p, keyLifts: { ...p.keyLifts, [name]: e.target.value ? parseFloat(e.target.value) : "" } }))}
                style={s.profileInput} placeholder="kg" />
            </label>
          ))}

          <h3 style={{ ...s.settingsHeading, marginTop: 28 }}>{t.settings.mesocycle}</h3>
          {cycle ? (
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: C.textSec, fontSize: 14 }}>{t.home.weekOf} {cycleInfo.week}/4 · {t.home.phases[cycleInfo.label] || cycleInfo.label}</div>
              <button onClick={() => setCycle({ startDate: new Date().toISOString() })}
                style={{ ...s.secondaryBtn, marginTop: 8, fontSize: 13, padding: "10px 16px" }}>
                {t.settings.restartCycle}
              </button>
            </div>
          ) : (
            <div style={{ color: C.textSec, fontSize: 14 }}>{t.settings.cycleInfo}</div>
          )}

          <h3 style={{ ...s.settingsHeading, marginTop: 28 }}>{t.settings.equipment}</h3>
          <div style={s.eqGrid}>
            {EQUIPMENT_OPTIONS.map(eqOpt => (
              <button key={eqOpt.id} onClick={() => toggleEquipment(eqOpt.id)}
                style={{ ...s.eqBtn, ...(equipment.includes(eqOpt.id) ? s.eqBtnActive : {}) }}>
                {I(EQ_ICONS[eqOpt.id] || IC.dumbbell, 28)}
                <span style={{ fontSize: 13 }}>{eq[eqOpt.id]}</span>
              </button>
            ))}
          </div>

          <button onClick={() => {
            if (confirm(t.settings.deleteConfirm)) {
              setHistory([]);
              setCurrentWorkout(null);
              setOnboarded(false);
              setProfile({ age: "", weight: "", gender: "female", keyLifts: {} });
              setCycle(null);
              try { localStorage.removeItem("powerfit-data"); } catch {}
              toast(t.toast.dataDeleted);
            }
          }} style={{ ...s.secondaryBtn, marginTop: 32, borderColor: "#D47070", color: "#D47070" }}>
            <span style={{ display: "inline-flex", verticalAlign: "middle", marginRight: 8 }}>{I(IC.trash, 16, "#D47070")}</span>{t.settings.deleteAll}
          </button>
        </div>
      )}

      {/* ===== NAVIGATION ===== */}
      <nav style={s.nav}>
        {[
          { id: "home", icon: IC.home, label: t.nav.home },
          { id: "workout", icon: IC.dumbbell, label: t.nav.workout },
          { id: "library", icon: IC.book, label: t.nav.library },
          { id: "settings", icon: IC.gear, label: t.nav.settings },
        ].map(tab => {
          const isActive = view === tab.id;
          return (
            <button key={tab.id} onClick={() => {
              if (tab.id === "workout" && !currentWorkout) genWorkout();
              else navigateView(tab.id);
            }} style={{ ...s.navBtn, ...(isActive ? s.navBtnActive : {}) }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 48, height: 34, borderRadius: 14, transition: "all 0.25s",
                background: isActive ? C.accentLight : "transparent",
              }}>
                {I(tab.icon, 20, isActive ? C.accent : C.textMuted)}
              </div>
              <span style={{ fontSize: 10, marginTop: 2, color: isActive ? C.accent : C.textMuted, fontWeight: isActive ? 800 : 600, transition: "color 0.2s" }}>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// ========== STYLES ==========

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Syne:wght@700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #F5EFE6; }
  body::before {
    content: "";
    position: fixed;
    inset: 0;
    opacity: 0.03;
    pointer-events: none;
    z-index: 9999;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 200px 200px;
  }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
  input[type=number] { -moz-appearance: textfield; }
  @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
  @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes toastIn { from { opacity: 0; transform: translate(-50%, 16px); } to { opacity: 1; transform: translate(-50%, 0); } }
  @keyframes popIn { 0% { transform: scale(1); } 40% { transform: scale(1.35); } 100% { transform: scale(1); } }
  @keyframes confettiFall {
    0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
  }
  @keyframes celebFadeIn {
    from { opacity: 0; transform: scale(0.85); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes bgColorShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes burstExpand {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 0.7; }
    60% { opacity: 0.4; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
  }
  @keyframes ringExpand {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 0.8; border-width: 6px; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 0; border-width: 1px; }
  }
  @keyframes viewSlideIn {
    from { opacity: 0; transform: translateX(60px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes viewSlideOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(-60px); }
  }
  @keyframes viewSlideInReverse {
    from { opacity: 0; transform: translateX(-60px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes timerPulse {
    0%, 100% { box-shadow: 0 0 0 0px rgba(255,155,123,0.3); }
    50% { box-shadow: 0 0 0 10px rgba(255,155,123,0); }
  }
  @keyframes streakFlame {
    0%, 100% { transform: scale(1) rotate(-2deg); }
    25% { transform: scale(1.1) rotate(2deg); }
    50% { transform: scale(1.05) rotate(-1deg); }
    75% { transform: scale(1.12) rotate(1deg); }
  }
  @keyframes prGlow {
    0% { box-shadow: 0 0 0 0px rgba(255,155,123,0.5); }
    50% { box-shadow: 0 0 20px 8px rgba(255,155,123,0.3); }
    100% { box-shadow: 0 0 0 0px rgba(255,155,123,0); }
  }
  @keyframes ringProgress {
    from { stroke-dashoffset: 251; }
  }
`;

const C = {
  bg: "#F5EFE6",
  card: "#FFFFFF",
  cardGrad: "linear-gradient(145deg, #FFFFFF, #FDF9F4)",
  text: "#2D2D2D",
  textSec: "#7A7A7A",
  textMuted: "#AAAAAA",
  dark: "#2D2D2D",
  accent: "#FF9B7B",
  accentLight: "#FFF0EB",
  mint: "#B8E6C8",
  mintDark: "#5CA87A",
  lavender: "#E0D4FF",
  sky: "#D4EEFF",
  peach: "#FFE0CC",
  rose: "#FFD4E0",
  border: "rgba(0,0,0,0.06)",
  cardBorder: "1px solid rgba(0,0,0,0.08)",
  shadow: "0 2px 16px rgba(45,45,45,0.06)",
  shadowLg: "0 6px 32px rgba(45,45,45,0.08)",
  r: 14,
  rLg: 18,
  rPill: 28,
};

const F = "'Nunito', sans-serif";

const styles = {
  appWrap: { fontFamily: F, background: C.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", paddingBottom: 84, overflow: "hidden" },
  toast: { position: "fixed", bottom: 94, left: "50%", transform: "translateX(-50%)", background: C.dark, color: "#fff", padding: "12px 28px", borderRadius: C.rPill, fontWeight: 800, fontSize: 15, zIndex: 999, animation: "toastIn 0.3s ease", boxShadow: C.shadowLg, fontFamily: F },
  page: { padding: "24px 18px 40px" },
  eqGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, width: "100%", marginBottom: 24 },
  eqBtn: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "18px 12px", background: C.cardGrad, border: C.cardBorder, borderRadius: C.r, color: C.textSec, cursor: "pointer", transition: "all 0.2s", boxShadow: C.shadow, fontFamily: F, fontWeight: 700 },
  eqBtnActive: { background: C.accentLight, borderColor: C.accent, color: C.text },
  headerArea: { marginBottom: 28 },
  logo: { fontSize: "min(12vw, 48px)", fontWeight: 900, color: C.text, letterSpacing: -2, marginBottom: 20 },
  statsRow: { display: "flex", gap: 10 },
  statCard: { background: C.card, borderRadius: C.r, padding: "18px 12px", textAlign: "center", boxShadow: C.shadow, border: C.cardBorder },
  statNum: { fontSize: 30, fontWeight: 900, color: C.text },
  statLabel: { fontSize: 12, color: C.textMuted, marginTop: 6, fontWeight: 700 },
  cycleCard: { background: C.cardGrad, borderRadius: C.r, padding: "18px 20px", marginBottom: 22, boxShadow: C.shadow, border: C.cardBorder },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 0 },
  accordionWrap: { background: C.cardGrad, borderRadius: C.r, boxShadow: C.shadow, overflow: "hidden", border: C.cardBorder },
  accordionBtn: {
    display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
    background: "none", border: "none", padding: "16px 18px", cursor: "pointer", WebkitTapHighlightColor: "transparent",
  },
  accordionChev: { width: 28, height: 28, borderRadius: 14, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  accordionBody: { padding: "0 18px 16px 18px" },
  recoveryGrid: { display: "flex", flexDirection: "column", gap: 12 },
  recoveryItem: { display: "grid", gridTemplateColumns: "80px 1fr 42px", alignItems: "center", gap: 12 },
  recoveryLabel: { color: C.text, fontSize: 14, fontWeight: 700 },
  recoveryBarBg: { height: 10, background: "rgba(0,0,0,0.05)", borderRadius: C.rPill, overflow: "hidden" },
  recoveryBarFill: { height: "100%", borderRadius: C.rPill, transition: "width 0.5s ease" },
  recoveryPct: { fontSize: 14, fontWeight: 800, textAlign: "right" },
  generateBtn: { width: "100%", padding: "20px 32px", background: `linear-gradient(135deg, ${C.accent}, #FF7B9B)`, border: "none", borderRadius: C.rPill, color: "#fff", fontSize: 18, fontWeight: 800, fontFamily: F, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 0, boxShadow: "0 4px 20px rgba(255,155,123,0.35)", position: "relative", overflow: "hidden" },
  shimmer: { position: "absolute", top: 0, left: 0, width: "50%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)", animation: "shimmer 3s ease-in-out infinite", pointerEvents: "none" },
  historyCard: { background: C.cardGrad, borderRadius: C.r, padding: "16px 18px", marginBottom: 12, boxShadow: C.shadow, border: C.cardBorder },
  backBtn: { background: C.card, border: C.cardBorder, borderRadius: 12, color: C.text, fontSize: 18, width: 40, height: 40, cursor: "pointer", fontFamily: F, boxShadow: "none", display: "flex", alignItems: "center", justifyContent: "center" },
  progressBarBg: { height: 8, background: "rgba(0,0,0,0.05)", borderRadius: C.rPill, marginBottom: 10, overflow: "hidden" },
  progressBarFill: { height: "100%", background: C.accent, borderRadius: C.rPill, transition: "width 0.4s ease" },
  exerciseCard: { background: C.cardGrad, borderRadius: C.r, padding: "18px", marginBottom: 14, transition: "all 0.3s", boxShadow: C.shadow, border: C.cardBorder, borderLeft: "5px solid transparent" },
  exerciseCardDone: { background: "#F0FAF0", borderLeftColor: C.mint },
  exNameBtn: { background: "none", border: "none", color: C.text, fontFamily: F, fontSize: 18, fontWeight: 800, cursor: "pointer", textAlign: "left", padding: 0 },
  swapBtn: { background: C.bg, border: "none", borderRadius: C.r, padding: "6px 10px", fontSize: 15, cursor: "pointer", flexShrink: 0 },
  tagBadge: { display: "inline-block", padding: "4px 12px", background: C.bg, borderRadius: C.rPill, color: C.textSec, fontSize: 12, fontWeight: 700 },
  setsContainer: { marginTop: 16 },
  setsHeader: { display: "grid", gridTemplateColumns: "36px 1fr 1fr 48px", gap: 8, marginBottom: 8 },
  setsHeaderCell: { fontSize: 11, color: C.textMuted, fontWeight: 800, textTransform: "uppercase", textAlign: "center" },
  setRow: { display: "grid", gridTemplateColumns: "36px 1fr 1fr 48px", gap: 8, marginBottom: 8, alignItems: "center" },
  setRowDone: { opacity: 0.45 },
  setCell: { textAlign: "center", fontSize: 15, color: C.textSec, fontWeight: 700 },
  setInput: { background: C.bg, border: "none", borderRadius: 14, padding: "10px 10px", color: C.text, fontSize: 16, textAlign: "center", fontFamily: F, fontWeight: 700, width: "100%", outline: "none" },
  checkBtn: { width: 28, height: 28, borderRadius: 8, border: "2px solid rgba(0,0,0,0.1)", background: C.bg, color: "transparent", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", justifySelf: "center", fontFamily: F, fontWeight: 800, transition: "all 0.2s" },
  checkBtnDone: { background: C.mint, borderColor: C.mintDark, color: C.text },
  filterBtn: { padding: "8px 16px", background: C.card, border: "none", borderRadius: C.rPill, color: C.textMuted, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: F, boxShadow: C.shadow },
  filterBtnActive: { background: C.dark, color: "#fff" },
  libraryItem: { display: "block", width: "100%", textAlign: "left", background: C.card, border: C.cardBorder, borderRadius: C.r, padding: "14px 18px", marginBottom: 10, cursor: "pointer", fontFamily: F, boxShadow: C.shadow },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(45,45,45,0.4)", backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100, padding: 0 },
  modal: { background: "rgba(255,255,255,0.85)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderRadius: "20px 20px 0 0", padding: "28px 24px 32px", maxWidth: 480, width: "100%", boxShadow: "0 -8px 40px rgba(0,0,0,0.1)", borderTop: C.cardBorder },
  modalBadge: { display: "inline-block", marginTop: 8, padding: "5px 14px", borderRadius: C.rPill, fontSize: 13, fontWeight: 700 },
  closeBtn: { background: "rgba(0,0,0,0.05)", border: "none", borderRadius: "50%", color: C.textSec, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  nav: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: C.cardBorder, borderRadius: "18px 18px 0 0", padding: "10px 0 14px", zIndex: 50 },
  navBtn: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontFamily: F, padding: "6px 0", transition: "color 0.2s", fontWeight: 700, fontSize: 11 },
  navBtnActive: { color: C.text },
  progressItem: { display: "flex", alignItems: "center", justifyContent: "space-between", background: C.cardGrad, borderRadius: C.r, padding: "14px 18px", marginBottom: 10, boxShadow: C.shadow, border: C.cardBorder },
  supersetWrap: { border: "none", borderRadius: C.rLg, padding: "6px 12px 12px", marginBottom: 14, background: C.lavender },
  supersetHeader: { display: "flex", alignItems: "center", gap: 10, padding: "10px 8px 6px" },
  supersetBadge: { fontSize: 12, fontWeight: 900, color: "#7A54B8", letterSpacing: 1.5, textTransform: "uppercase" },
  supersetCards: { position: "relative" },
  supersetLabel: { display: "inline-block", width: 28, height: 28, lineHeight: "28px", textAlign: "center", borderRadius: 10, background: "rgba(122,84,184,0.15)", color: "#7A54B8", fontSize: 14, fontWeight: 900, marginBottom: 4, marginLeft: 6 },
  weakPointCard: { background: C.cardGrad, borderRadius: C.r, padding: "14px 18px", marginBottom: 10, boxShadow: C.shadow, border: C.cardBorder },
  settingsHeading: { color: C.textSec, fontSize: 15, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 },
  inputLabel: { display: "block", color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 16 },
  profileInput: { width: "100%", background: C.bg, border: "none", borderRadius: 10, padding: "12px 14px", color: C.text, fontSize: 16, fontFamily: F, fontWeight: 600, outline: "none", marginTop: 0 },
  genderBtn: { flex: 1, padding: "12px", background: C.bg, border: "2px solid transparent", borderRadius: 10, color: C.textMuted, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: F, transition: "all 0.2s" },
  genderBtnActive: { background: C.accentLight, borderColor: C.accent, color: C.text },
  rpeRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", background: C.bg, borderRadius: `0 0 ${C.r}px ${C.r}px`, gap: 8, flexWrap: "wrap" },
  rpeLabel: { fontSize: 13, color: C.textSec, fontWeight: 700 },
  rpeBtns: { display: "flex", gap: 6 },
  rpeBtn: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "8px 12px", background: C.card, border: "2px solid transparent", borderRadius: 14, cursor: "pointer", color: C.textMuted, fontFamily: F, fontWeight: 700, transition: "all 0.2s", boxShadow: C.shadow },
  rpeBtnActive: { borderColor: C.accent, background: C.accentLight, color: C.text },
  modalSection: { marginTop: 20, borderTop: `1px solid ${C.border}`, paddingTop: 16 },
  modalSectionTitle: { margin: "0 0 10px 0", fontSize: 15, fontWeight: 800, color: C.text, letterSpacing: 0.3 },
  modalList: { margin: 0, paddingLeft: 22 },
  modalListItem: { color: C.textSec, fontSize: 15, lineHeight: 1.8, marginBottom: 4 },
  historyTable: { borderRadius: 16, overflow: "hidden", background: C.bg },
  historyHeader: { display: "flex", padding: "8px 10px", fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5 },
  historyRow: { display: "flex", padding: "8px 10px", borderTop: "1px solid rgba(0,0,0,0.04)", fontSize: 14, color: C.textSec, fontWeight: 600 },
  historyCell: { flex: 1, textAlign: "center" },
  videoBtn: { display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: C.dark, border: "none", borderRadius: C.rPill, color: "#fff", fontSize: 15, fontWeight: 700, textDecoration: "none", marginTop: 14, cursor: "pointer", fontFamily: F, boxShadow: C.shadow },
  cyclePhases: { display: "flex", gap: 6, marginTop: 12 },
  cyclePhaseItem: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 4px", borderRadius: 14, background: C.bg, color: C.textMuted, transition: "all 0.2s", fontWeight: 700 },
  cyclePhaseActive: { background: C.accentLight, color: C.accent },
};
