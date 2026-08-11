# 🍑 Peachy Pump

A progressive workout generator built around antagonist superset logic. React + Vite, PWA, no backend.

---

## How it works

Workouts follow a fixed structural template — antagonist supersets (8–9 exercises total) plus a light accessory/mobility finisher. Exercises are selected dynamically based on available equipment and training history.

### Antagonist training

Each superset pairs muscles that work against each other — while one contracts, the other stretches and recovers. This allows shorter rest times, better muscular balance, and lower injury risk.

```
horizontal_push  ↔  horizontal_pull   (chest vs back)
vertical_push    ↔  vertical_pull     (shoulders vs back)
squat            ↔  hip_hinge         (quads vs hamstrings)
core_antiextension ↔ core_rotation
```

### Three rotating templates

**Workout A — Lower dominant**
- SS1: `squat` ↔ `hip_hinge`
- SS2: `glute/hamstring isolation` ↔ `upper body` ↔ `quad isolation`
- SS3: `horizontal_push` ↔ `horizontal_pull`
- SS4: accessory / mobility (shoulders, upper body)

**Workout B — Upper + Core**
- SS1: `vertical_push` ↔ `vertical_pull`
- SS2: `horizontal_push` ↔ `horizontal_pull` ↔ `shoulder_isolation`
- SS3: `core_antiextension` ↔ `core_rotation`
- SS4: accessory / mobility (hips, lower body)

**Workout C — Full body · Upper focus**
- SS1: `squat` ↔ `hip_hinge`
- SS2: `horizontal_push` ↔ `horizontal_pull` ↔ `shoulder_isolation`
- SS3: `vertical_push` ↔ `core_antiextension`
- SS4: `hip_hinge_isolation` ↔ `core_rotation` (lighter, 2 sets)

Rotation is A → B → C → A → B → C. At 3×/week this gives each body region roughly equal coverage across a week. The SS4 finisher rotates through neglected muscles and mobility work — things like Copenhagen planks, face pulls, thoracic rotation.

---

## Progressive overload

The app tracks every session and suggests weight automatically — increments when targets are hit, reduces after a break, and runs a deload every 4th week.

---

## Run

```bash
npm install
npm run dev
```
