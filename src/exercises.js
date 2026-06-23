// ============================================================
// EXERCISE LIBRARY
// Each exercise is tagged with:
//   movementPattern — used for slot-based workout generation
//   slot — which SS slot(s) this exercise can fill
//   type — compound | isolation | accessory | mobility
// ============================================================

export const MUSCLE_GROUPS = ["Prsa", "Záda", "Ramena", "Biceps", "Triceps", "Nohy", "Core", "Hýždě"];

export const GROUP_COLORS = {
  Prsa:    { bg: "#FFE0E0", text: "#B85454" },
  Záda:    { bg: "#DCE8FF", text: "#5472A8" },
  Ramena:  { bg: "#FFE8D4", text: "#B87A4E" },
  Biceps:  { bg: "#E8DCFF", text: "#7A54B8" },
  Triceps: { bg: "#DCFFE8", text: "#4EA87A" },
  Nohy:    { bg: "#FFF4DC", text: "#B8A04E" },
  Core:    { bg: "#FFD4E8", text: "#B8547A" },
  Hýždě:  { bg: "#D4F0FF", text: "#4E8EB8" },
};

// Movement patterns used for slot matching
export const PATTERNS = {
  SQUAT:               "squat",
  HIP_HINGE:           "hip_hinge",
  HIP_HINGE_ISO:       "hip_hinge_isolation",
  KNEE_ISO:            "knee_isolation",
  UNILATERAL_LOWER:    "unilateral_lower",
  HORIZONTAL_PUSH:     "horizontal_push",
  HORIZONTAL_PULL:     "horizontal_pull",
  VERTICAL_PUSH:       "vertical_push",
  VERTICAL_PULL:       "vertical_pull",
  SHOULDER_ISO:        "shoulder_isolation",
  CORE_ANTIEXTENSION:  "core_antiextension",
  CORE_ROTATION:       "core_rotation",
  CORE_FLEXION:        "core_flexion",
  ACCESSORY_UPPER:     "accessory_upper",
  ACCESSORY_LOWER:     "accessory_lower",
  MOBILITY_UPPER:      "mobility_upper",
  MOBILITY_LOWER:      "mobility_lower",
};

// Antagonist pairs for superset pairing
export const ANTAGONIST_PAIRS = {
  [PATTERNS.SQUAT]:              PATTERNS.HIP_HINGE,
  [PATTERNS.HIP_HINGE]:          PATTERNS.SQUAT,
  [PATTERNS.HORIZONTAL_PUSH]:    PATTERNS.HORIZONTAL_PULL,
  [PATTERNS.HORIZONTAL_PULL]:    PATTERNS.HORIZONTAL_PUSH,
  [PATTERNS.VERTICAL_PUSH]:      PATTERNS.VERTICAL_PULL,
  [PATTERNS.VERTICAL_PULL]:      PATTERNS.VERTICAL_PUSH,
  [PATTERNS.CORE_ANTIEXTENSION]: PATTERNS.CORE_ROTATION,
  [PATTERNS.CORE_ROTATION]:      PATTERNS.CORE_ANTIEXTENSION,
};

export const EXERCISE_LIBRARY = {
  // ── LOWER BODY ──────────────────────────────────────────
  Nohy: [
    {
      name: "Dřep (squat)", equipment: ["barbell", "rack"], difficulty: "intermediate",
      type: "compound", movementPattern: PATTERNS.SQUAT, muscles: "Quadriceps, hamstringy, hýždě, core",
      desc: "Král cviků — compound pohyb na celý spodek těla.",
      howTo: ["Činku polož na horní trapézy (ne na krk!), uchop šířeji než ramena", "Nohy na šířku ramen nebo lehce šířeji, špičky lehce ven", "Nadechni se, zpevni core, začni pohyb tím, že tlačíš hýždě dozadu", "Dřepni alespoň do rovnoběžky stehen se zemí", "Vytlač se zpět nahoru, tlač kolena nad špičky"],
      mistakes: ["Kolena padají dovnitř — tlač je aktivně ven", "Kulatá záda — hrudník nahoru, core zpevněný", "Zvedání pat — celá plocha chodidla na zemi"],
    },
    {
      name: "Goblet squat", equipment: ["dumbbells", "kettlebell"], difficulty: "beginner",
      type: "compound", movementPattern: PATTERNS.SQUAT, muscles: "Quadriceps, hýždě, core",
      desc: "Dřep se závažím u hrudi — perfektní pro učení techniky.",
      howTo: ["Drž jednoručku nebo kettlebell vertikálně u hrudi oběma rukama", "Nohy na šířku ramen nebo šířeji, špičky ven", "Dřepni hluboko — lokty jdou mezi kolena", "Vytlač se zpět nahoru, kolena nad špičky"],
      mistakes: ["Závaží daleko od těla — drž těsně u hrudníku", "Zvedání pat — celá plocha chodidla", "Mělký dřep — jdi hluboko"],
    },
    {
      name: "Bulharské dřepy", equipment: ["dumbbells", "bench"], difficulty: "intermediate",
      type: "compound", movementPattern: PATTERNS.UNILATERAL_LOWER, muscles: "Quadriceps, hýždě, hamstringy, stabilizátory",
      desc: "Jednonožní dřep se zadní nohou na lavičce.",
      howTo: ["Stůj zády k lavičce, polož nárt zadní nohy na lavičku", "Přední noha asi krok před lavičkou", "Dřepni na přední noze dolů — zadní koleno ke k zemi", "Vytlač se zpět nahoru silou přední nohy"],
      mistakes: ["Příliš blízko lavičky", "Naklánění dopředu", "Koleno přední nohy padá dovnitř"],
    },
    {
      name: "Výpady", equipment: ["dumbbells", "bodyweight"], difficulty: "beginner",
      type: "compound", movementPattern: PATTERNS.UNILATERAL_LOWER, muscles: "Quadriceps, hýždě, hamstringy",
      desc: "Krokové výpady vpřed nebo na místě.",
      howTo: ["Stůj vzpřímeně, jednoručky v rukou", "Udělej krok dopředu, délka kroku asi 1 metr", "Spouštěj se dolů — obě kolena se ohýbají do 90°", "Odraz z přední nohy zpět do stoje"],
      mistakes: ["Koleno přední nohy přes špičku", "Úzká stopa", "Naklánění dopředu"],
    },
    {
      name: "Step-up", equipment: ["dumbbells", "bench"], difficulty: "beginner",
      type: "compound", movementPattern: PATTERNS.UNILATERAL_LOWER, muscles: "Hýždě, quadriceps, hamstringy",
      desc: "Výstupy na lavičku jednou nohou.",
      howTo: ["Stůj před lavičkou, jednoručky v rukou", "Postav celé chodidlo na lavičku", "Vytlač se nahoru silou přední nohy", "Pomalu se spouštěj zpět"],
      mistakes: ["Odraz ze zadní nohy", "Příliš vysoká lavička na začátek", "Koleno padá dovnitř"],
    },
    {
      name: "Leg press", equipment: ["machines"], difficulty: "beginner",
      type: "compound", movementPattern: PATTERNS.SQUAT, muscles: "Quadriceps, hýždě, hamstringy",
      desc: "Bezpečná strojová alternativa dřepu.",
      howTo: ["Sedni si do stroje, záda a hýždě pevně na sedátku", "Nohy na plošinu na šířku ramen", "Spouštěj plošinu dolů, kolena k hrudníku", "Tlač zpět nahoru, nezamykej kolena nahoře"],
      mistakes: ["Hýždě se odlepují od sedátka", "Zamykání kolen nahoře — NEBEZPEČNÉ!", "Kolena dovnitř"],
    },
    {
      name: "Leg extension", equipment: ["machines"], difficulty: "beginner",
      type: "isolation", movementPattern: PATTERNS.KNEE_ISO, muscles: "Quadriceps",
      desc: "Izolace quadricepsu na stroji.",
      howTo: ["Sedni si, polštář na přední straně holení", "Natahuj nohy dopředu do plného napnutí", "Nahoře stiskni quadriceps na 1 sekundu", "Pomalu spouštěj"],
      mistakes: ["Zvedání hýždí ze sedátka", "Trhání na začátku pohybu"],
    },
    {
      name: "Mrtvý tah", equipment: ["barbell"], difficulty: "advanced",
      type: "compound", movementPattern: PATTERNS.HIP_HINGE, muscles: "Hamstringy, hýždě, záda, core",
      desc: "Nejtěžší compound cvik — zvednutí činky ze země.",
      howTo: ["Činku na zem, stůj s chodidly pod činkou", "Předkloň se, uchop činku na šířku ramen, rovná záda!", "Zvedej tažením nohou a zad současně", "Nahoře se napřim, stiskni hýždě"],
      mistakes: ["Kulatá záda — NEJNEBEZPEČNĚJŠÍ chyba!", "Tyč daleko od těla", "Zvedání hýždí dřív než ramen"],
    },
    {
      name: "Rumunský mrtvý tah", equipment: ["barbell", "dumbbells"], difficulty: "intermediate",
      type: "compound", movementPattern: PATTERNS.HIP_HINGE, muscles: "Hamstringy, hýždě, spodní záda",
      desc: "Mrtvý tah s důrazem na hamstringy.",
      howTo: ["Stůj s činkou před stehny, kolena mírně pokrčená", "Předkláněj se v bocích, hýždě tlač dozadu", "Jdi dolů dokud ucítíš natažení hamstringů", "Stiskni hýždě a vrať se nahoru"],
      mistakes: ["Kulatá záda", "Ohýbání a propínání kolen", "Příliš hluboké spouštění"],
    },
    {
      name: "Leg curl", equipment: ["machines"], difficulty: "beginner",
      type: "isolation", movementPattern: PATTERNS.KNEE_ISO, muscles: "Hamstringy",
      desc: "Izolace hamstringů na stroji.",
      howTo: ["Lehni si na stroj, polštář těsně nad patami", "Ohýbej nohy nahoru ke hýždím", "Stiskni hamstringy nahoře", "Pomalu spouštěj zpět"],
      mistakes: ["Zvedání boků od podložky", "Příliš rychlý pohyb"],
    },
  ],

  // ── GLUTES ──────────────────────────────────────────────
  Hýždě: [
    {
      name: "Hip thrust", equipment: ["barbell", "bench"], difficulty: "intermediate",
      type: "compound", movementPattern: PATTERNS.HIP_HINGE_ISO, muscles: "Hýždě, hamstringy, spodní záda",
      desc: "Nejúčinnější cvik na hýždě — tlak boky s činkou.",
      howTo: ["Sedni si na zem, lopatky opřené o hranu lavičky, činku přes boky", "Chodidla na zemi na šířku ramen", "Tlač boky nahoru do rovné linie od ramen po kolena", "Maximálně stiskni hýždě nahoře na 1-2 sekundy", "Pomalu spouštěj boky dolů"],
      mistakes: ["Prohýbání zad nahoře", "Chodidla příliš blízko nebo daleko", "Zvedání na špičky"],
    },
    {
      name: "Glute bridge", equipment: ["bodyweight", "dumbbells"], difficulty: "beginner",
      type: "compound", movementPattern: PATTERNS.HIP_HINGE_ISO, noWeight: true, muscles: "Hýždě, hamstringy",
      desc: "Jednodušší verze hip thrustu na zemi.",
      howTo: ["Na zádech, kolena pokrčená, chodidla blízko hýždí", "Tlač boky ke stropu, stiskni hýždě nahoře", "Pomalu dolů — hýždě téměř k zemi"],
      mistakes: ["Zvedání z beder místo z hýždí", "Rychlé odrazy"],
    },
    {
      name: "Sumo dřep", equipment: ["barbell", "dumbbells", "kettlebell"], difficulty: "intermediate",
      type: "compound", movementPattern: PATTERNS.SQUAT, muscles: "Hýždě, vnitřní stehna, quadriceps",
      desc: "Široký dřep zaměřený na hýždě a vnitřní stehna.",
      howTo: ["Široký postoj, špičky vytočené ven (45°)", "Dřepni rovně dolů, kolena sledují směr špiček", "Vytlač se zpět nahoru, stiskni hýždě nahoře"],
      mistakes: ["Kolena padají dovnitř", "Naklánění dopředu"],
    },
    {
      name: "Kickback na kladce", equipment: ["cables"], difficulty: "beginner",
      type: "isolation", movementPattern: PATTERNS.HIP_HINGE_ISO, muscles: "Hýždě",
      desc: "Kopy nohou za sebe na spodní kladce.",
      howTo: ["Připni manžetu na kotník, stůj čelem ke kladce", "Kopni pracovní nohou za sebe a nahoru, stiskni hýždi", "Nahoře zadrž na 1 sekundu", "Pomalu vracej zpět"],
      mistakes: ["Prohýbání zad", "Kopání příliš vysoko", "Rychlé švihání"],
    },
  ],

  // ── CHEST ────────────────────────────────────────────────
  Prsa: [
    {
      name: "Bench press", equipment: ["barbell", "bench", "rack"], difficulty: "intermediate",
      type: "compound", movementPattern: PATTERNS.HORIZONTAL_PUSH, muscles: "Prsa, triceps, přední ramena",
      desc: "Základní tlakový cvik na prsa.",
      howTo: ["Lehni si na lavičku, uchop činku o něco šířeji než ramena", "Stáhni lopatky k sobě a dolů", "Spusť činku kontrolovaně k dolní části hrudníku", "Vytlač nahoru do plného napnutí"],
      mistakes: ["Odlepování hýždí od lavičky", "Odsazování činky od hrudníku", "Lokty příliš od těla (90°)"],
    },
    {
      name: "Bench press s jednoručkami", equipment: ["dumbbells", "bench"], difficulty: "intermediate",
      type: "compound", movementPattern: PATTERNS.HORIZONTAL_PUSH, muscles: "Prsa, triceps, přední ramena",
      desc: "Bench press s jednoručkami pro větší rozsah pohybu.",
      howTo: ["Lehni si na lavičku s jednoručkami nad prsy", "Spouštěj kontrolovaně dolů, lokty ~45° od těla", "Vytlač nahoru, jednoručky nesrážej"],
      mistakes: ["Příliš těžké jednoručky", "Prohýbání zad", "Nerovnoměrné tempo"],
    },
    {
      name: "Kliky", equipment: ["bodyweight"], difficulty: "beginner",
      type: "compound", movementPattern: PATTERNS.HORIZONTAL_PUSH, noWeight: true, muscles: "Prsa, triceps, přední ramena, core",
      desc: "Klasický cvik s vlastní vahou na prsa a paže.",
      howTo: ["Ruce na šířku ramen, tělo v rovné linii", "Spusť hrudník ke 2-3 cm od země, lokty ~45°", "Vytlač se zpět nahoru"],
      mistakes: ["Prohnutá záda", "Hlava visí dolů", "Poloviční rozsah"],
    },
    {
      name: "Šikmý bench press", equipment: ["dumbbells", "bench"], difficulty: "intermediate",
      type: "compound", movementPattern: PATTERNS.HORIZONTAL_PUSH, muscles: "Horní prsa, přední ramena, triceps",
      desc: "Bench press na šikmé lavičce pro horní část prsou.",
      howTo: ["Nastav lavičku na 30-45°", "Spouštěj ke klíčním kostem, lokty ~45° od těla", "Vytlač nahoru, soustřeď se na horní prsa"],
      mistakes: ["Lavička příliš šikmo (nad 45°)", "Lopatky nestažené"],
    },
    {
      name: "Chest press na stroji", equipment: ["machines"], difficulty: "beginner",
      type: "compound", movementPattern: PATTERNS.HORIZONTAL_PUSH, muscles: "Prsa, triceps, přední ramena",
      desc: "Bezpečná alternativa bench pressu na stroji.",
      howTo: ["Nastav sedátko — úchopy na úrovni středu hrudníku", "Tlač dopředu do plného napnutí", "Pomalu vracej zpět"],
      mistakes: ["Špatná výška sedátka", "Odlepování zad od opěrky"],
    },
    {
      name: "Rozpažky s jednoručkami", equipment: ["dumbbells", "bench"], difficulty: "intermediate",
      type: "isolation", movementPattern: PATTERNS.HORIZONTAL_PUSH, muscles: "Prsa, přední ramena",
      desc: "Izolační cvik zaměřený na natažení prsou.",
      howTo: ["Na lavičce, jednoručky nad hrudníkem, dlaně k sobě", "Mírně pokrč lokty a drž tento úhel", "Rozpažuj do úrovně ramen", "Stáhni zpět nahoru obloukem"],
      mistakes: ["Rovné lokty", "Příliš hluboký rozsah", "Moc těžké"],
    },
  ],

  // ── BACK ─────────────────────────────────────────────────
  Záda: [
    {
      name: "Bent-over row", equipment: ["barbell"], difficulty: "intermediate",
      type: "compound", movementPattern: PATTERNS.HORIZONTAL_PULL, muscles: "Střed zad, lats, trapézy, biceps",
      desc: "Klíčový compound cvik na celá záda v předklonu.",
      howTo: ["Předkloň se v bocích do ~45°, rovná záda", "Táhni činku k pupku, lokty jdou dozadu těsně kolem těla", "Stiskni lopatky k sobě, pomalu spusť"],
      mistakes: ["Kulatá záda — NEBEZPEČNÉ!", "Kývání trupu", "Tahání bicepsy"],
    },
    {
      name: "Jednoruční přítah", equipment: ["dumbbells", "bench"], difficulty: "beginner",
      type: "compound", movementPattern: PATTERNS.HORIZONTAL_PULL, muscles: "Lats, střed zad, biceps",
      desc: "Jednoruční přítah na lavičce.",
      howTo: ["Koleno a ruku jedné strany polož na lavičku", "Táhni jednoručku k boku, loket jde nahoru a dozadu", "Stiskni záda nahoře, pomalu spusť"],
      mistakes: ["Rotace trupu", "Táhnutí k hrudníku místo k boku"],
    },
    {
      name: "Seated row", equipment: ["cables", "machines"], difficulty: "beginner",
      type: "compound", movementPattern: PATTERNS.HORIZONTAL_PULL, muscles: "Střed zad, lats, trapézy, biceps",
      desc: "Veslování vsedě na kladce.",
      howTo: ["Sedni si, záda rovně, hrudník vystrčený", "Táhni madlo k břichu, lokty těsně podél těla", "Stiskni lopatky nahoře, pomalu vracej"],
      mistakes: ["Houpání trupu", "Kulatá záda při vracení"],
    },
    {
      name: "Přítahy na kladce", equipment: ["cables"], difficulty: "beginner",
      type: "compound", movementPattern: PATTERNS.VERTICAL_PULL, muscles: "Lats, biceps, zadní ramena",
      desc: "Přítahy shora na kladce.",
      howTo: ["Sedni si, uchop tyč širokým nadhmatem", "Zatáhni lopatky dolů a k sobě", "Táhni tyč k horní části hrudníku", "Pomalu vracej nahoru s kontrolou"],
      mistakes: ["Tahání rukama místo zády", "Záklony trupu", "Tyč za hlavu"],
    },
    {
      name: "Lat pulldown", equipment: ["machines"], difficulty: "beginner",
      type: "compound", movementPattern: PATTERNS.VERTICAL_PULL, muscles: "Lats, biceps, střed zad",
      desc: "Strojová alternativa shybů.",
      howTo: ["Sedni si, uchop tyč široce nadhmatem", "Táhni tyč k horní části hrudníku, lokty dolů", "Stiskni lopatky dole, pomalu vracej"],
      mistakes: ["Tahání za hlavu", "Příliš velký záklon trupu"],
    },
    {
      name: "Shyby", equipment: ["pullup_bar"], difficulty: "advanced",
      type: "compound", movementPattern: PATTERNS.VERTICAL_PULL, noWeight: true, muscles: "Lats, biceps, střed zad",
      desc: "Král cviků na záda.",
      howTo: ["Uchop hrazdu nadhmatem, šířeji než ramena", "Táhni nahoru — bradou nad hrazdu", "Pomalu se spouštěj do plného svisu"],
      mistakes: ["Kývání a švihání", "Poloviční rozsah", "Kulatá ramena nahoře"],
    },
  ],

  // ── SHOULDERS ────────────────────────────────────────────
  Ramena: [
    {
      name: "Tlaky nad hlavu", equipment: ["barbell", "rack"], difficulty: "intermediate",
      type: "compound", movementPattern: PATTERNS.VERTICAL_PUSH, muscles: "Přední a střední ramena, triceps",
      desc: "Hlavní compound cvik na ramena.",
      howTo: ["Činku drž na horní části hrudníku, lokty lehce před činkou", "Zpevni core a hýždě", "Tlač činku přímo nahoru nad hlavu", "Nahoře plně napni paže"],
      mistakes: ["Prohýbání zad", "Tlačení šikmo dopředu", "Příliš široký úchop"],
    },
    {
      name: "Tlaky s jednoručkami", equipment: ["dumbbells"], difficulty: "beginner",
      type: "compound", movementPattern: PATTERNS.VERTICAL_PUSH, muscles: "Přední a střední ramena, triceps",
      desc: "Tlaky nad hlavu s jednoručkami.",
      howTo: ["Jednoručky na úrovni uší, lokty pod zápěstími", "Tlač obě nahoru nad hlavu", "Pomalu spouštěj zpět k uším"],
      mistakes: ["Kývání trupem", "Jednoručky příliš vpředu", "Nerovnoměrné tlačení"],
    },
    {
      name: "Arnold press", equipment: ["dumbbells"], difficulty: "intermediate",
      type: "compound", movementPattern: PATTERNS.VERTICAL_PUSH, muscles: "Přední a střední ramena, triceps",
      desc: "Rotační tlak — zapojí celý deltoid.",
      howTo: ["Jednoručky před obličejem, dlaně k sobě", "Současně rotuj dlaněmi ven a tlač nahoru", "Při spouštění rotuj zpět"],
      mistakes: ["Trhavý pohyb", "Rychlé spouštění", "Prohýbání zad"],
    },
    {
      name: "Upažování", equipment: ["dumbbells"], difficulty: "beginner",
      type: "isolation", movementPattern: PATTERNS.SHOULDER_ISO, muscles: "Střední ramena",
      desc: "Izolační cvik na střední deltoidy.",
      howTo: ["Stůj s jednoručkami podél těla, mírně pokrč lokty", "Zvedej do stran na úroveň ramen", "Pomalu spouštěj"],
      mistakes: ["Příliš těžké jednoručky", "Zvedání ramen k uším", "Zvedání nad úroveň ramen"],
    },
    {
      name: "Face pulls", equipment: ["cables", "bands"], difficulty: "beginner",
      type: "isolation", movementPattern: PATTERNS.SHOULDER_ISO, muscles: "Zadní ramena, rotátorová manžeta",
      desc: "Klíčový cvik pro zdraví ramen.",
      howTo: ["Nastav kladku do výšky obličeje, uchop lano", "Táhni lano k obličeji, lokty do stran a dozadu", "V konečné pozici ruce vedle uší"],
      mistakes: ["Příliš těžká váha", "Tahání k hrudi místo k obličeji", "Lokty dole"],
    },
    {
      name: "Předpažování", equipment: ["dumbbells"], difficulty: "beginner",
      type: "isolation", movementPattern: PATTERNS.SHOULDER_ISO, muscles: "Přední ramena",
      desc: "Izolační cvik na přední deltoidy.",
      howTo: ["Zvedni jednoručky před sebe na úroveň ramen", "Mírně pokrčené lokty", "Pomalu spouštěj zpět"],
      mistakes: ["Kývání trupem", "Zvedání výš než ramena"],
    },
  ],

  // ── BICEPS ───────────────────────────────────────────────
  Biceps: [
    {
      name: "Bicepsový curl", equipment: ["barbell", "dumbbells"], difficulty: "beginner",
      type: "isolation", movementPattern: PATTERNS.ACCESSORY_UPPER, muscles: "Biceps",
      desc: "Základní izolační cvik na biceps.",
      howTo: ["Lokty přitiskni k bokům — tady zůstanou", "Ohýbej ruce nahoru, zatni biceps", "Pomalu spouštěj dolů"],
      mistakes: ["Pohyb loktů dopředu", "Kývání trupem", "Houpání váhy"],
    },
    {
      name: "Hammer curl", equipment: ["dumbbells"], difficulty: "beginner",
      type: "isolation", movementPattern: PATTERNS.ACCESSORY_UPPER, muscles: "Biceps, brachialis, předloktí",
      desc: "Curl s neutrálním úchopem.",
      howTo: ["Jednoručky podél těla, dlaně k sobě (palce nahoru)", "Ohýbej ruce nahoru, úchop se nemění", "Pomalu dolů"],
      mistakes: ["Rotace zápěstí", "Lokty od těla"],
    },
    {
      name: "Cable curl", equipment: ["cables"], difficulty: "beginner",
      type: "isolation", movementPattern: PATTERNS.ACCESSORY_UPPER, muscles: "Biceps",
      desc: "Curl na spodní kladce — konstantní napětí.",
      howTo: ["Stůj čelem ke spodní kladce, lokty u boků", "Ohýbej ruce nahoru, stiskni nahoře", "Pomalu spouštěj"],
      mistakes: ["Odstupování od kladky", "Kývání lokty"],
    },
  ],

  // ── TRICEPS ──────────────────────────────────────────────
  Triceps: [
    {
      name: "Triceps pushdown", equipment: ["cables"], difficulty: "beginner",
      type: "isolation", movementPattern: PATTERNS.ACCESSORY_UPPER, muscles: "Triceps",
      desc: "Základní izolace tricepsu na kladce.",
      howTo: ["Lokty přitiskni k bokům, předloktí vodorovně", "Tlač dolů do plného napnutí, stiskni triceps", "Pomalu vracej do 90°"],
      mistakes: ["Lokty se odlepují od boků", "Naklánění nad kladku"],
    },
    {
      name: "Overhead triceps extension", equipment: ["dumbbells"], difficulty: "beginner",
      type: "isolation", movementPattern: PATTERNS.ACCESSORY_UPPER, muscles: "Triceps (dlouhá hlava)",
      desc: "Jednoručka za hlavou — natahuj ruce nahoru.",
      howTo: ["Jednoručku drž oběma rukama za hlavou, nadloktí svisle", "Natahuj předloktí nahoru do plného napnutí", "Pomalu spouštěj za hlavu"],
      mistakes: ["Nadloktí se kýve", "Lokty jdou do stran", "Prohýbání zad"],
    },
    {
      name: "Francouzský tlak", equipment: ["barbell", "bench"], difficulty: "intermediate",
      type: "isolation", movementPattern: PATTERNS.ACCESSORY_UPPER, muscles: "Triceps",
      desc: "Ležíš na lavičce a spouštíš činku za hlavu.",
      howTo: ["Na lavičce, činku drž nad hrudníkem, úzký úchop", "Ohýbej pouze v loktech — spouštěj za hlavu", "Napni triceps a vrať zpět"],
      mistakes: ["Pohyb loktů", "Lokty se rozevírají do stran", "Příliš těžká váha"],
    },
  ],

  // ── CORE ─────────────────────────────────────────────────
  Core: [
    {
      name: "Plank", equipment: ["bodyweight"], difficulty: "beginner",
      type: "isolation", movementPattern: PATTERNS.CORE_ANTIEXTENSION, noWeight: true, isHold: true,
      muscles: "Přímý břišní sval, šikmé břišní, spodní záda",
      desc: "Statický výdrž — základ core tréninku.",
      howTo: ["Na předloktích a špičkách, lokty pod rameny", "Tělo v rovné linii od hlavy po paty", "Zpevni břicho, dýchej"],
      mistakes: ["Hýždě příliš vysoko", "Prohnutá záda", "Zadržování dechu"],
    },
    {
      name: "Dead bug", equipment: ["bodyweight"], difficulty: "beginner",
      type: "isolation", movementPattern: PATTERNS.CORE_ANTIEXTENSION, noWeight: true,
      muscles: "Hluboké břišní svaly, spodní záda",
      desc: "Cvik na stabilitu core a spodní záda.",
      howTo: ["Na zádech, ruce ke stropu, kolena pokrčená v 90°", "Záda přitiskni k zemi — nesmí se odlepit!", "Natáhni pravou ruku za hlavu a levou nohu dopředu", "Vrať zpět, opakuj druhou stranu"],
      mistakes: ["Záda se odlepují od země", "Příliš rychlé tempo", "Zadržování dechu"],
    },
    {
      name: "Ab rollout", equipment: ["barbell"], difficulty: "advanced",
      type: "isolation", movementPattern: PATTERNS.CORE_ANTIEXTENSION,
      muscles: "Přímý břišní sval, lats, ramena",
      desc: "Vyrolování s činkou — pokročilý core cvik.",
      howTo: ["Na kolenou, core zpevněný, záda rovná", "Pomalu se vyroluj dopředu", "Silou břicha se stáhni zpět"],
      mistakes: ["Prohýbání zad — okamžitě zastav", "Příliš velký rozsah na začátku"],
    },
    {
      name: "Bicycle crunches", equipment: ["bodyweight"], difficulty: "beginner",
      type: "isolation", movementPattern: PATTERNS.CORE_FLEXION, noWeight: true,
      muscles: "Přímý a šikmé břišní svaly",
      desc: "Střídavé přitahování kolen a loktů.",
      howTo: ["Na zádech, ruce za hlavou, lopatky zvednuté", "Natáhni pravou nohu, otočení trupu — levý loket k pravému kolenu", "Plynulé střídání, pomalé a kontrolované"],
      mistakes: ["Tahání za krk", "Příliš rychlé otáčení", "Spouštění lopatek"],
    },
    {
      name: "Russian twists", equipment: ["bodyweight", "dumbbells"], difficulty: "beginner",
      type: "isolation", movementPattern: PATTERNS.CORE_ROTATION, noWeight: true,
      muscles: "Šikmé břišní svaly",
      desc: "Rotační cvik vsedě.",
      howTo: ["Sedni si, trup asi 45° od země", "Otáčej trup ze strany na stranu", "Pohyb jde z trupu, ne z paží"],
      mistakes: ["Jen pohyb rukama bez rotace trupu", "Příliš velký záklon", "Záda se hroutí"],
    },
    {
      name: "Cable woodchops", equipment: ["cables"], difficulty: "intermediate",
      type: "isolation", movementPattern: PATTERNS.CORE_ROTATION,
      muscles: "Šikmé břišní, core, ramena",
      desc: "Rotační pohyb na kladce — funkční core trénink.",
      howTo: ["Stůj bokem ke kladce, uchop madlo oběma rukama", "Rotuj trupem a táhni šikmo přes tělo", "Kontrolovaně vracej zpět"],
      mistakes: ["Ohýbání paží", "Pohyb z ramen místo z core"],
    },
    {
      name: "Hanging leg raises", equipment: ["pullup_bar"], difficulty: "advanced",
      type: "isolation", movementPattern: PATTERNS.CORE_FLEXION, noWeight: true,
      muscles: "Spodní břicho, celý core",
      desc: "Zvedání nohou ve visu — pokročilý core cvik.",
      howTo: ["Vis na hrazdě, plný svis", "Zvedej nohy před sebe co nejvýš", "Pomalu spouštěj zpět"],
      mistakes: ["Kývání a švihání", "Ztráta úchopu"],
    },
  ],
};

// ── ACCESSORY & MOBILITY LIBRARY ────────────────────────────
// These exercises fill SS4 — light, no progressive overload tracking needed

export const ACCESSORY_LIBRARY = {
  // For Workout A finisher (upper/shoulder focus)
  accessory_upper: [
    { name: "Face pulls", equipment: ["cables", "bands"], movementPattern: PATTERNS.ACCESSORY_UPPER, muscles: "Zadní ramena, rotátorová manžeta", noWeight: false, isAccessory: true, desc: "Prevence zranění ramen — nikdy nevynechávej.", howTo: ["Kladka na úrovni obličeje, táhni lano k obličeji", "Lokty do stran a dozadu, ruce vedle uší"], mistakes: [] },
    { name: "Bicepsový curl", equipment: ["dumbbells", "barbell", "cables"], movementPattern: PATTERNS.ACCESSORY_UPPER, muscles: "Biceps", noWeight: false, isAccessory: true, desc: "Izolace bicepsu.", howTo: ["Lokty u těla, ohýbej ruce nahoru", "Pomalá negativní fáze"], mistakes: [] },
    { name: "Triceps pushdown", equipment: ["cables"], movementPattern: PATTERNS.ACCESSORY_UPPER, muscles: "Triceps", noWeight: false, isAccessory: true, desc: "Izolace tricepsu.", howTo: ["Lokty u boků, tlač dolů", "Stiskni triceps nahoře"], mistakes: [] },
    { name: "Upažování", equipment: ["dumbbells", "bands"], movementPattern: PATTERNS.ACCESSORY_UPPER, muscles: "Střední ramena", noWeight: false, isAccessory: true, desc: "Tvarování středních deltoidů.", howTo: ["Zvedej do stran na úroveň ramen", "Pomalý kontrolovaný pohyb"], mistakes: [] },
    { name: "Shrágy", equipment: ["barbell", "dumbbells"], movementPattern: PATTERNS.ACCESSORY_UPPER, muscles: "Trapézy", noWeight: false, isAccessory: true, desc: "Horní trapézy.", howTo: ["Zvedni ramena přímo nahoru k uším", "Nahoře drž, pomalu dolů"], mistakes: [] },
  ],
  // For Workout A — mobility upper
  mobility_upper: [
    { name: "Thoracic rotation", equipment: ["bodyweight"], movementPattern: PATTERNS.MOBILITY_UPPER, muscles: "Hrudní páteř", noWeight: true, isAccessory: true, isHold: false, desc: "Mobilita hrudní páteře — důležité při sedavém zaměstnání.", howTo: ["Na čtyřech, jedna ruka za hlavou", "Rotuj hrudník — loket k druhé ruce, pak ke stropu", "Pomalu, plný rozsah"], mistakes: [] },
    { name: "Shoulder dislocates", equipment: ["bands"], movementPattern: PATTERNS.MOBILITY_UPPER, muscles: "Ramena, hrudní páteř", noWeight: true, isAccessory: true, desc: "Mobilita ramenního kloubu.", howTo: ["Drž gumu před sebou na šířku víc než ramen", "Pomalu zvedni obloukem přes hlavu až za záda", "Zpět dopředu — plynulý pohyb"], mistakes: [] },
    { name: "Cat-cow", equipment: ["bodyweight"], movementPattern: PATTERNS.MOBILITY_UPPER, muscles: "Páteř, core", noWeight: true, isAccessory: true, isHold: false, desc: "Mobilizace celé páteře.", howTo: ["Na čtyřech, záda rovně", "Prohni záda dolů, hlava nahoru (cow)", "Zakulaťi záda nahoru, hlava dolů (cat)", "Pomalý plynulý pohyb"], mistakes: [] },
  ],
  // For Workout B finisher (hip/lower focus)
  accessory_lower: [
    { name: "Copenhagen plank", equipment: ["bench", "bodyweight"], movementPattern: PATTERNS.ACCESSORY_LOWER, muscles: "Vnitřní stehna, core", noWeight: true, isAccessory: true, isHold: true, desc: "Vnitřní stehna — jeden z nejvíc zanedbávaných svalů.", howTo: ["Bok ke lavičce, horní noha na lavičce", "Zvedni boky — tělo v rovné linii", "Drž — nebo pulzuj spodní nohou nahoru"], mistakes: [] },
    { name: "Banded clamshell", equipment: ["bands", "bodyweight"], movementPattern: PATTERNS.ACCESSORY_LOWER, muscles: "Zevní rotátory kyčle, hýždě", noWeight: true, isAccessory: true, desc: "Aktivace zevních rotátorů kyčle — prevence kolení bolesti.", howTo: ["Na boku, guma nad koleny, kolena pokrčená", "Otevři horní koleno jako škeble — hýždě zůstávají na místě", "Pomalu dolů, opakuj"], mistakes: [] },
    { name: "Donkey kicks", equipment: ["bodyweight", "bands"], movementPattern: PATTERNS.ACCESSORY_LOWER, muscles: "Hýždě", noWeight: true, isAccessory: true, desc: "Aktivace hýžďového svalu.", howTo: ["Na čtyřech, jedna noha nahoru — koleno v 90°", "Kopni nohou ke stropu, stiskni hýždi nahoře", "Pomalu dolů"], mistakes: [] },
  ],
  // For Workout B — mobility lower
  mobility_lower: [
    { name: "Hip flexor stretch", equipment: ["bodyweight"], movementPattern: PATTERNS.MOBILITY_LOWER, muscles: "Bedrokyčlostehenní sval", noWeight: true, isAccessory: true, isHold: true, desc: "Uvolnění flexorů kyčle — zkrácené u většiny lidí.", howTo: ["Výpad dolů — zadní koleno na zemi", "Posuň boky dopředu, cítíš natažení v přední části zadního stehna", "Drž 30-60s, pak aktivuj hýždi — zatlač přední nohou do země"], mistakes: [] },
    { name: "Ankle circles", equipment: ["bodyweight"], movementPattern: PATTERNS.MOBILITY_LOWER, muscles: "Kotník, lýtko", noWeight: true, isAccessory: true, isHold: false, desc: "Mobilita kotníků — limituje hloubku dřepu.", howTo: ["Sedni si nebo stůj na jedné noze", "Pomalu kroužej kotníkem v celém rozsahu", "10 opakování každým směrem"], mistakes: [] },
    { name: "World's greatest stretch", equipment: ["bodyweight"], movementPattern: PATTERNS.MOBILITY_LOWER, muscles: "Kyčle, hrudní páteř, hamstringy", noWeight: true, isAccessory: true, isHold: false, desc: "Komplexní mobilizační cvik — výpad + rotace.", howTo: ["Výpad dopředu, přední ruka na zemi vedle přední nohy", "Rotuj hrudník — jedna ruka ke stropu", "Drž 2s nahoře, vracej zpět"], mistakes: [] },
  ],
};

// For progressive overload tracking
export const EXERCISE_FAMILY = {
  "Bench press": "bench", "Bench press s jednoručkami": "bench",
  "Šikmý bench press": "bench", "Chest press na stroji": "bench",
  "Kliky": "pushup", "Diamantové kliky": "pushup",
  "Tlaky nad hlavu": "overhead_press", "Tlaky s jednoručkami": "overhead_press", "Arnold press": "overhead_press",
  "Dřep (squat)": "squat_family", "Goblet squat": "squat_family",
  "Bulharské dřepy": "squat_family", "Sumo dřep": "squat_family",
  "Mrtvý tah": "deadlift", "Rumunský mrtvý tah": "deadlift",
  "Bicepsový curl": "curl", "Hammer curl": "curl", "Cable curl": "curl",
};

export const KEY_LIFT_EXERCISES = ["Bench press", "Dřep (squat)", "Mrtvý tah", "Tlaky nad hlavu", "Bent-over row"];

export const EQUIPMENT_OPTIONS = [
  { id: "barbell", label: "Činka (barbell)" },
  { id: "dumbbells", label: "Jednoručky" },
  { id: "bench", label: "Lavička" },
  { id: "rack", label: "Stojan/Rack" },
  { id: "cables", label: "Kladky/Kabely" },
  { id: "machines", label: "Stroje" },
  { id: "pullup_bar", label: "Hrazda" },
  { id: "bands", label: "Gumy" },
  { id: "bodyweight", label: "Vlastní váha" },
  { id: "kettlebell", label: "Kettlebell" },
];

export const NAMES_EN = {
  "Bench press": "Bench Press", "Bench press s jednoručkami": "Dumbbell Bench Press",
  "Kliky": "Push-ups", "Rozpažky s jednoručkami": "Dumbbell Flyes",
  "Šikmý bench press": "Incline Dumbbell Press", "Chest press na stroji": "Machine Chest Press",
  "Bent-over row": "Bent-over Row", "Jednoruční přítah": "Single-arm Dumbbell Row",
  "Shyby": "Pull-ups", "Lat pulldown": "Lat Pulldown", "Seated row": "Seated Cable Row",
  "Přítahy na kladce": "Cable Lat Pulldown",
  "Tlaky nad hlavu": "Overhead Press", "Tlaky s jednoručkami": "Dumbbell Shoulder Press",
  "Upažování": "Lateral Raises", "Face pulls": "Face Pulls", "Arnold press": "Arnold Press",
  "Předpažování": "Front Raises", "Shrágy": "Shrugs",
  "Bicepsový curl": "Bicep Curl", "Hammer curl": "Hammer Curl", "Cable curl": "Cable Curl",
  "Triceps pushdown": "Triceps Pushdown", "Francouzský tlak": "Skull Crushers",
  "Overhead triceps extension": "Overhead Triceps Extension",
  "Dřep (squat)": "Barbell Squat", "Goblet squat": "Goblet Squat",
  "Mrtvý tah": "Deadlift", "Rumunský mrtvý tah": "Romanian Deadlift",
  "Výpady": "Lunges", "Leg press": "Leg Press", "Leg curl": "Leg Curl",
  "Leg extension": "Leg Extension", "Bulharské dřepy": "Bulgarian Split Squat",
  "Step-up": "Step-up", "Sumo dřep": "Sumo Squat",
  "Hip thrust": "Hip Thrust", "Glute bridge": "Glute Bridge",
  "Kickback na kladce": "Cable Glute Kickback",
  "Plank": "Plank", "Dead bug": "Dead Bug", "Ab rollout": "Ab Rollout",
  "Bicycle crunches": "Bicycle Crunches", "Russian twists": "Russian Twists",
  "Cable woodchops": "Cable Woodchops", "Hanging leg raises": "Hanging Leg Raises",
  "Thoracic rotation": "Thoracic Rotation", "Shoulder dislocates": "Shoulder Dislocates",
  "Cat-cow": "Cat-cow", "Copenhagen plank": "Copenhagen Plank",
  "Banded clamshell": "Banded Clamshell", "Donkey kicks": "Donkey Kicks",
  "Hip flexor stretch": "Hip Flexor Stretch", "Ankle circles": "Ankle Circles",
  "World's greatest stretch": "World's Greatest Stretch",
};
