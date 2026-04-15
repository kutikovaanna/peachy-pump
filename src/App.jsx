import { useState, useEffect, useRef, useCallback, useMemo } from "react";

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

const MUSCLE_GROUPS = ["Prsa", "Záda", "Ramena", "Biceps", "Triceps", "Nohy", "Core", "Hýždě"];

const GROUP_COLORS = {
  Prsa:    { bg: "#FFE0E0", text: "#B85454" },
  Záda:    { bg: "#DCE8FF", text: "#5472A8" },
  Ramena:  { bg: "#FFE8D4", text: "#B87A4E" },
  Biceps:  { bg: "#E8DCFF", text: "#7A54B8" },
  Triceps: { bg: "#DCFFE8", text: "#4EA87A" },
  Nohy:    { bg: "#FFF4DC", text: "#B8A04E" },
  Core:    { bg: "#FFD4E8", text: "#B8547A" },
  Hýždě:  { bg: "#D4F0FF", text: "#4E8EB8" },
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
const EQUIPMENT_OPTIONS = [
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

const KEY_LIFT_EXERCISES = ["Bench press", "Dřep (squat)", "Mrtvý tah", "Tlaky nad hlavu", "Bent-over row"];

const EXERCISE_LIBRARY = {
  Prsa: [
    { name: "Bench press", equipment: ["barbell", "bench", "rack"], difficulty: "intermediate", type: "compound", movementPattern: "horizontal_push", muscles: "Prsa, triceps, přední ramena",
      desc: "Základní tlakový cvik na prsa s činkou na lavičce.",
      howTo: ["Lehni si na lavičku, chodidla pevně na zemi, hýždě a lopatky přitisknuté", "Uchop činku o něco šířeji než ramena, palce kolem tyče", "Stáhni lopatky k sobě a dolů — vytvoř pevný základ", "Nadechni se, spusť činku kontrolovaně k dolní části hrudníku", "Vytlač nahoru do plného napnutí, vydechni nahoře"],
      mistakes: ["Odlepování hýždí od lavičky — ztrácíš stabilitu", "Odsazování (bouncing) činky od hrudníku — ztráta kontroly", "Lokty příliš od těla (90°) — riziko pro ramena, drž ~75°"] },
    { name: "Bench press s jednoručkami", equipment: ["dumbbells", "bench"], difficulty: "intermediate", type: "compound", movementPattern: "horizontal_push", muscles: "Prsa, triceps, přední ramena, stabilizátory",
      desc: "Bench press s jednoručkami pro větší rozsah pohybu.",
      howTo: ["Sedni si na lavičku s jednoručkami na stehnech, lehni si a zvedni je nad prsa", "Drž jednoručky tak, aby palce směřovaly k sobě", "Spouštěj kontrolovaně dolů, lokty pod úhlem ~45° od těla", "Dole ucítíš natažení prsou, pak vytlač nahoru", "Nahoře jednoručky nesrážej — zastavuj těsně před dotykem"],
      mistakes: ["Příliš těžké jednoručky — ztráta kontroly hned na začátku", "Prohýbání zad — drž lopatky stažené", "Nerovnoměrné tempo — obě ruce stejně"] },
    { name: "Kliky", equipment: ["bodyweight"], difficulty: "beginner", type: "compound", movementPattern: "horizontal_push", noWeight: true, muscles: "Prsa, triceps, přední ramena, core",
      desc: "Klasický cvik s vlastní vahou na prsa a paže.",
      howTo: ["Ruce na zem na šířku ramen, prsty směřují dopředu", "Tělo v rovné linii od hlavy po paty — nezvedej hýždě", "Spusť hrudník ke 2-3 cm od země, lokty ~45° od těla", "Vytlač se zpět nahoru do plného napnutí", "Lehčí varianta: kliky na kolenou se stejnou technikou"],
      mistakes: ["Prohnutá záda — zpevni břicho jako bys čekala ránu", "Hlava visí dolů — dívej se na zem kousek před rukama", "Poloviční rozsah — jdi opravdu dolů, jinak cvičíš napůl"] },
    { name: "Rozpažky s jednoručkami", equipment: ["dumbbells", "bench"], difficulty: "intermediate", type: "isolation", movementPattern: "isolation", muscles: "Prsa (natažení), přední ramena",
      desc: "Izolační cvik zaměřený na natažení a kontrakci prsou.",
      howTo: ["Na lavičce drž jednoručky nad hrudníkem, dlaně k sobě", "Mírně pokrč lokty a tento úhel drž po celý pohyb", "Rozpažuj do stran, dokud neucítíš natažení prsou", "Zastav na úrovni ramen — ne níž!", "Stáhni zpět nahoru obloukem, jako bys objímala strom"],
      mistakes: ["Rovné lokty — vždycky mírně pokrčené, jinak trpí klouby", "Příliš hluboký rozsah — stačí na úroveň ramen", "Moc těžké — tohle je cvik na kontrolu, ne na maximální váhu"] },
    { name: "Cable crossover", equipment: ["cables"], difficulty: "intermediate", type: "isolation", movementPattern: "isolation", muscles: "Prsa (vnitřní část), přední ramena",
      desc: "Izolační cvik na kladkách pro vytvarování prsou.",
      howTo: ["Stůj mezi dvěma horními kladkami, úchopy v rukou", "Nakroč jednou nohou dopředu pro stabilitu, mírný předklon", "Táhni ruce před sebe a dolů v oblouku — lokty lehce pokrčené", "Dole stiskni prsa k sobě na 1 sekundu", "Pomalu vracej zpět, kontroluj pohyb"],
      mistakes: ["Příliš rychlý pohyb — pomalá negativní fáze je klíčová", "Pohyb z ramen místo z prsou — soustřeď se na stisk prsou", "Přílišná váha — tohle je cvik na pocit, ne na sílu"] },
    { name: "Šikmý bench press", equipment: ["dumbbells", "bench"], difficulty: "intermediate", type: "compound", movementPattern: "horizontal_push", muscles: "Horní prsa, přední ramena, triceps",
      desc: "Bench press na šikmé lavičce pro horní část prsou.",
      howTo: ["Nastav lavičku na 30-45° (ne víc, jinak to přebírají ramena)", "S jednoručkami lehni na lavičku, chodidla na zemi", "Drž jednoručky nad horní částí hrudníku", "Spouštěj ke klíčním kostem, lokty ~45° od těla", "Vytlač nahoru, soustřeď se na horní prsa"],
      mistakes: ["Lavička příliš šikmo (nad 45°) — cvičíš ramena místo prsou", "Stejné chyby jako u bench pressu — lopatky stažené!", "Jednoručky se kývou — zpevni zápěstí"] },
    { name: "Chest press na stroji", equipment: ["machines"], difficulty: "beginner", type: "compound", movementPattern: "horizontal_push", muscles: "Prsa, triceps, přední ramena",
      desc: "Bezpečná alternativa bench pressu na stroji.",
      howTo: ["Nastav sedátko tak, aby úchopy byly na úrovni středu hrudníku", "Sedni si, záda přitiskni k opěrce, chodidla na zemi", "Uchop madla, tlač dopředu do plného napnutí", "Pomalu vracej zpět — kontroluj celý pohyb", "Nedovírej úplně — drž napětí v prsou"],
      mistakes: ["Špatná výška sedátka — úchopy musí být na úrovni prsou", "Odlepování zad od opěrky", "Používání hybnosti — pomalý, kontrolovaný pohyb"] },
    { name: "Diamantové kliky", equipment: ["bodyweight"], difficulty: "advanced", type: "compound", movementPattern: "horizontal_push", noWeight: true, muscles: "Triceps, vnitřní prsa, přední ramena",
      desc: "Pokročilá varianta kliků s důrazem na triceps.",
      howTo: ["Ruce na zem blízko u sebe — palce a ukazováčky tvoří trojúhelník (diamant)", "Tělo v rovné linii, core zpevněný", "Spusť hrudník k rukám, lokty jdou podél těla dozadu", "Vytlač se zpět nahoru", "Příliš těžké? Začni na kolenou"],
      mistakes: ["Lokty do stran — musí jít dozadu podél těla", "Slabé zápěstí — pokud bolí, dej ruce na pěsti", "Příliš rychlé opakování — pomalý pohyb dolů"] },
  ],
  Záda: [
    { name: "Shrágy", equipment: ["barbell", "dumbbells"], difficulty: "beginner", type: "isolation", movementPattern: "isolation", muscles: "Trapézy (horní část)",
      desc: "Jednoduchý cvik na horní trapézy.",
      howTo: ["Stůj s činkou/jednoručkami podél těla, ramena stažená dolů", "Zvedni ramena přímo nahoru k uším — jako bys krčila rameny", "Nahoře na sekundu vydrž a stiskni trapézy", "Pomalu spusť zpět dolů", "Nekruž rameny — pohyb je jen nahoru a dolů"],
      mistakes: ["Krouživý pohyb ramen — zbytečné a riskantní pro klouby", "Příliš těžká váha a kývání tělem", "Ohýbání loktů — ruce jsou jen háky, práci dělají trapézy"] },
    { name: "Přítahy na kladce", equipment: ["cables"], difficulty: "beginner", type: "compound", movementPattern: "vertical_pull", muscles: "Široký sval zádový (lats), biceps, zadní ramena",
      desc: "Přítahy shora na kladce — skvělý úvod k shybům.",
      howTo: ["Sedni si, stehna zajištěná pod polštáři, chodidla na zemi", "Uchop tyč širokým nadhmatem (širší než ramena)", "Zatáhni lopatky dolů a k sobě, prsa vystrč dopředu", "Táhni tyč k horní části hrudníku, lokty směřují dolů a dozadu", "Pomalu vracej nahoru s kontrolou — nepouštěj naráz"],
      mistakes: ["Tahání rukama místo zády — soustřeď se na lopatky", "Záklony trupu — mírný záklon OK, velký ne", "Tyč za hlavu — tahej k hrudníku, za hlavu trpí ramena"] },
    { name: "Bent-over row", equipment: ["barbell"], difficulty: "intermediate", type: "compound", movementPattern: "horizontal_pull", muscles: "Střed zad, lats, trapézy, biceps, zadní ramena",
      desc: "Klíčový compound cvik na celá záda v předklonu.",
      howTo: ["Stůj s činkou, nohy na šířku ramen, kolena lehce pokrčená", "Předkloň se v bocích do ~45°, rovná záda — jako stůl", "Činku nech viset s nataženými pažemi", "Táhni činku k pupku, lokty jdou dozadu těsně kolem těla", "Nahoře stiskni lopatky k sobě, pomalu spusť"],
      mistakes: ["Kulatá záda — NEBEZPEČNÉ! Záda musí být rovná", "Zvedání trupu u každého opakování (kývání)", "Tahání bicepsy — soustřeď se na lokty dozadu, ne ruce nahoru"] },
    { name: "Jednoruční přítah", equipment: ["dumbbells", "bench"], difficulty: "beginner", type: "compound", movementPattern: "horizontal_pull", muscles: "Lats, střed zad, biceps",
      desc: "Jednoruční přítah na lavičce — skvělý pro začátečníky.",
      howTo: ["Koleno a ruku jedné strany polož na lavičku — opora", "Druhou rukou uchop jednoručku, záda rovně, rovnoběžně se zemí", "Táhni jednoručku k boku (k pupku), loket jde nahoru a dozadu", "Nahoře stiskni záda na sekundu", "Pomalu spusť, napni celý rozsah, pak opakuj"],
      mistakes: ["Rotace trupu — trup musí zůstat rovný, pohybuje se jen ruka", "Táhnutí k hrudníku místo k boku", "Příliš rychlé trhaní — pomalý kontrolovaný pohyb"] },
    { name: "Shyby", equipment: ["pullup_bar"], difficulty: "advanced", type: "compound", movementPattern: "vertical_pull", noWeight: true, muscles: "Lats, biceps, střed zad, předloktí",
      desc: "Král cviků na záda — přítahy vlastní váhy na hrazdě.",
      howTo: ["Uchop hrazdu nadhmatem (dlaně od tebe), šířeji než ramena", "Ze svisu se zatáhni nahoru — bradou nad hrazdu", "Táhni lokty dolů a dozadu, prsa k hrazdě", "Pomalu se spouštěj zpět do plného svisu", "Nezvládáš? Použij gumu na pomoc nebo negativ (jen spouštění)"],
      mistakes: ["Kývání a švihání — pohyb musí být čistý, kontrolovaný", "Poloviční rozsah — jdi opravdu nahoru (brada nad) a dolů (plný svis)", "Kulatá ramena nahoře — vytáhni hrudník k hrazdě"] },
    { name: "Lat pulldown", equipment: ["machines"], difficulty: "beginner", type: "compound", movementPattern: "vertical_pull", muscles: "Lats, biceps, střed zad",
      desc: "Strojová alternativa shybů — příprava na shyby.",
      howTo: ["Sedni si, stehna pod polštáři, uchop tyč široce nadhmatem", "Vystrč hrudník dopředu, mírný záklon v trupu", "Táhni tyč k horní části hrudníku, lokty dolů a dozadu", "Stiskni lopatky k sobě dole", "Pomalu vracej — kontroluj váhu, nepouštěj ji"],
      mistakes: ["Tahání za hlavu — tahej k hrudníku!", "Příliš velký záklon trupu — max 10-15°", "Pouštění váhy nahoru bez kontroly"] },
    { name: "Seated row", equipment: ["cables", "machines"], difficulty: "beginner", type: "compound", movementPattern: "horizontal_pull", muscles: "Střed zad, lats, trapézy, biceps",
      desc: "Veslování vsedě na kladce pro střed zad.",
      howTo: ["Sedni si, nohy opřené o desku, kolena lehce pokrčená", "Uchop madlo, záda rovně, hrudník vystrčený", "Táhni madlo k břichu, lokty těsně podél těla dozadu", "Stiskni lopatky nahoře na sekundu", "Pomalu vracej — nech záda pracovat v natažení"],
      mistakes: ["Houpání trupu dopředu a dozadu — trup zůstává stabilní", "Kulatá záda při vracení — drž prsa vystrčená", "Tahání z bicepsů — mysli na lokty dozadu"] },
    { name: "T-bar row", equipment: ["barbell"], difficulty: "intermediate", type: "compound", movementPattern: "horizontal_pull", muscles: "Střed zad, lats, trapézy, biceps",
      desc: "Silové veslování s jedním koncem činky zapřeným do rohu.",
      howTo: ["Zapři jeden konec činky do rohu nebo do T-bar držáku", "Obkroč činku, předkloň se, rovná záda", "Uchop činku oběma rukama (nebo V-madlem) blízko závaží", "Táhni k hrudníku, lokty dozadu a nahoru", "Kontrolovaně spusť, drž záda rovně celou dobu"],
      mistakes: ["Kulatá záda — stejné riziko jako u bent-over row", "Zvedání celého trupu — pohyb je v pažích a lopatkách", "Příliš úzký nebo široký stoj — nohy na šířku ramen"] },
  ],
  Ramena: [
    { name: "Tlaky nad hlavu", equipment: ["barbell", "rack"], difficulty: "intermediate", type: "compound", movementPattern: "vertical_push", muscles: "Přední a střední ramena, triceps, horní hrudník",
      desc: "Hlavní compound cvik na ramena s činkou ve stoji.",
      howTo: ["Uchop činku na šířku ramen, ve stoji nebo ze stojanu", "Činku drž na horní části hrudníku, lokty lehce před činkou", "Zpevni core a hýždě — celé tělo je stabilní sloup", "Tlač činku přímo nahoru nad hlavu, hlavu lehce ucouvni", "Nahoře plně napni paže, činku drž nad středem hlavy"],
      mistakes: ["Prohýbání zad — zpevni břicho a hýždě!", "Tlačení šikmo dopředu — dráha je přímo nahoru", "Příliš široký úchop — šířka ramen stačí"] },
    { name: "Tlaky s jednoručkami", equipment: ["dumbbells"], difficulty: "beginner", type: "compound", movementPattern: "vertical_push", muscles: "Přední a střední ramena, triceps, stabilizátory",
      desc: "Tlaky nad hlavu s jednoručkami — vsedě nebo ve stoji.",
      howTo: ["Sedni si na lavičku (s opěrkou) nebo stůj, jednoručky v rukou", "Zvedni jednoručky na úroveň uší, lokty pod zápěstími", "Tlač obě jednoručky nahoru nad hlavu", "Nahoře plně napni, ale nesrážej jednoručky", "Pomalu spouštěj zpět k uším"],
      mistakes: ["Kývání trupem — zvlášť ve stoji, zpevni core", "Jednoručky příliš vpředu — drž je nad rameny", "Nerovnoměrné tlačení — slabší strana diktuje tempo"] },
    { name: "Upažování", equipment: ["dumbbells"], difficulty: "beginner", type: "isolation", movementPattern: "isolation", muscles: "Střední ramena (deltoid)",
      desc: "Izolační cvik na střední deltoidy — tvar ramen.",
      howTo: ["Stůj s jednoručkami podél těla, mírně pokrč lokty", "Zvedej jednoručky do stran na úroveň ramen — ne výš", "Představ si, že vyléváš čaj z konvičky (malíček jde lehce nahoru)", "Nahoře na moment zadrž", "Pomalu spouštěj — ne padáním, ale aktivním spouštěním"],
      mistakes: ["Příliš těžké jednoručky a kývání — tohle je cvik na preciznost", "Zvedání ramen k uším (trapézy přebírají) — ramena dolů!", "Zvedání nad úroveň ramen — zbytečné a riskantní"] },
    { name: "Face pulls", equipment: ["cables", "bands"], difficulty: "beginner", type: "isolation", movementPattern: "horizontal_pull", muscles: "Zadní ramena, rotátorová manžeta, střední trapézy",
      desc: "Klíčový cvik pro zdraví ramen a prevenci zranění.",
      howTo: ["Nastav kladku do výšky obličeje, uchop lano oběma rukama", "Odstup od kladky, paže natažené před sebou", "Táhni lano k obličeji, lokty jdou do stran a dozadu", "V konečné pozici ruce vedle uší, lopatky stisknuté", "Pomalu vracej — tohle je cvik na kvalitu, ne na váhu"],
      mistakes: ["Příliš těžká váha — tohle je korekční cvik, ne silový", "Tahání k hrudi místo k obličeji", "Lokty dole — musí jít do stran na úroveň ramen"] },
    { name: "Arnold press", equipment: ["dumbbells"], difficulty: "intermediate", type: "compound", movementPattern: "vertical_push", muscles: "Přední a střední ramena, triceps",
      desc: "Rotační tlak od Arnolda Schwarzeneggera — zapojí celý deltoid.",
      howTo: ["Sedni si, jednoručky před obličejem, dlaně k sobě (jako horní pozice curlu)", "Současně rotuj dlaněmi ven a tlač jednoručky nad hlavu", "Nahoře dlaně směřují dopředu, paže plně natažené", "Při spouštění rotuj zpět — dlaně se vrací k sobě", "Celý pohyb je plynulý, jako jeden oblouk"],
      mistakes: ["Trhavý pohyb — rotace a tlak musí být plynulé", "Rychlé spouštění — negativní fáze je důležitá", "Prohýbání zad — zpevni core"] },
    { name: "Předpažování", equipment: ["dumbbells"], difficulty: "beginner", type: "isolation", movementPattern: "isolation", muscles: "Přední ramena (přední deltoid)",
      desc: "Izolační cvik na přední deltoidy.",
      howTo: ["Stůj s jednoručkami před stehny, dlaně k tělu", "Zvedni jednu nebo obě jednoručky před sebe na úroveň ramen", "Paže jsou mírně pokrčené v loktech", "Nahoře na moment zadrž", "Pomalu spouštěj zpět"],
      mistakes: ["Kývání trupem — stůj pevně, jen paže se pohybují", "Zvedání výš než ramena — zbytečné", "Příliš rychlé opakování — pomalá a kontrolovaná práce"] },
  ],
  Biceps: [
    { name: "Bicepsový curl", equipment: ["barbell", "dumbbells"], difficulty: "beginner", type: "isolation", movementPattern: "isolation", muscles: "Biceps (obě hlavy)",
      desc: "Základní izolační cvik na biceps.",
      howTo: ["Stůj s činkou/jednoručkami v rukou, paže podél těla", "Lokty přitiskni k bokům — tady zůstanou po celou dobu!", "Ohýbej ruce v loktech nahoru, zatni biceps", "Nahoře stiskni na sekundu", "Pomalu spouštěj dolů — neházej váhou"],
      mistakes: ["Pohyb loktů dopředu — lokty jsou přilepené k bokům", "Kývání trupem pro pomoc — stůj rovně, pracuje jen biceps", "Houpání váhy — když musíš kývat, váha je moc těžká"] },
    { name: "Hammer curl", equipment: ["dumbbells"], difficulty: "beginner", type: "isolation", movementPattern: "isolation", muscles: "Biceps (dlouhá hlava), brachialis, předloktí",
      desc: "Curl s neutrálním úchopem pro biceps a předloktí.",
      howTo: ["Jednoručky podél těla, dlaně k sobě (palce nahoru) — kladívko", "Ohýbej ruce nahoru, úchop se nemění — palce zůstávají nahoře", "Lokty přitisknuté k bokům", "Nahoře zadrž a stiskni", "Pomalu dolů — střídej ruce nebo obě naráz"],
      mistakes: ["Rotace zápěstí — dlaně musí směřovat k sobě celou dobu", "Stejné chyby jako u klasického curlu — lokty u těla, bez kývání"] },
    { name: "Concentration curl", equipment: ["dumbbells"], difficulty: "beginner", type: "isolation", movementPattern: "isolation", muscles: "Biceps (maximální izolace)",
      desc: "Maximálně izolovaný curl vsedě s oporou o stehno.",
      howTo: ["Sedni si na lavičku, nohy široce od sebe", "Opři loket pracovní ruky o vnitřní stranu stehna", "S jednoručkou v ruce ohýbej loket nahoru", "Nahoře stiskni biceps na 1-2 sekundy", "Pomalu spouštěj dolů — plné natažení"],
      mistakes: ["Zvedání lokte od stehna — loket musí být pevně opřený", "Kývání tělem — pohybuje se jen předloktí", "Příliš rychlé opakování — tohle je cvik na soustředění"] },
    { name: "Cable curl", equipment: ["cables"], difficulty: "beginner", type: "isolation", movementPattern: "isolation", muscles: "Biceps",
      desc: "Curl na spodní kladce — konstantní napětí po celý pohyb.",
      howTo: ["Stůj čelem ke spodní kladce, uchop tyč nebo lano", "Lokty přitiskni k bokům, stůj vzpřímeně", "Ohýbej ruce nahoru, stiskni biceps nahoře", "Pomalu spouštěj — kladka udržuje napětí i dole", "Výhoda oproti činku: napětí v celém rozsahu"],
      mistakes: ["Odstupování od kladky — stůj blízko, stabilní pozice", "Kývání lokty — jako u všech curlů, lokty u těla"] },
    { name: "Chin-upy", equipment: ["pullup_bar"], difficulty: "advanced", type: "compound", movementPattern: "vertical_pull", noWeight: true, muscles: "Biceps, lats, střed zad",
      desc: "Shyby podhmatem — compound cvik na biceps a záda.",
      howTo: ["Uchop hrazdu podhmatem (dlaně k sobě), na šířku ramen", "Ze svisu se táhni nahoru — bradou nad hrazdu", "Soustřeď se na stahování loktů dolů k bokům", "Pomalu se spouštěj zpět do plného svisu", "Nezvládáš? Guma na pomoc nebo negativ (jen se spouštěj pomalu)"],
      mistakes: ["Kývání — stejné jako u shybů, čistý pohyb", "Poloviční rozsah — plný svis dole, brada nad hrazdu nahoře", "Příliš široký úchop — podhmat na šířku ramen"] },
  ],
  Triceps: [
    { name: "Tricepsové kliky na lavičce", equipment: ["bench", "bodyweight"], difficulty: "beginner", type: "compound", movementPattern: "horizontal_push", noWeight: true, muscles: "Triceps, přední ramena, prsa",
      desc: "Kliky s rukama za zády opřenými o lavičku.",
      howTo: ["Ruce za zády na hranu lavičky, prsty dopředu, na šířku ramen", "Nohy natažené dopředu (těžší) nebo pokrčené (lehčí)", "Spouštěj se dolů ohýbáním v loktech — lokty jdou dozadu, ne do stran", "Zastav když lokty jsou v 90°", "Vytlač se zpět nahoru silou tricepsu"],
      mistakes: ["Lokty do stran — musí jít přímo dozadu!", "Příliš hluboký rozsah — nepřekračuj 90° v loktech, trpí ramena", "Prohnutá záda — drž hýždě blízko lavičky"] },
    { name: "Francouzský tlak", equipment: ["barbell", "bench"], difficulty: "intermediate", type: "isolation", movementPattern: "isolation", muscles: "Triceps (dlouhá hlava)",
      desc: "Ležíš na lavičce a spouštíš činku za hlavu — izolace tricepsu.",
      howTo: ["Lehni si na lavičku, činku drž nad hrudníkem, úzký úchop", "Paže jsou svisle — tady začínáš", "Ohýbej POUZE v loktech — spouštěj činku za hlavu/ke čelu", "Lokty zůstávají na místě, nesměřují do stran!", "Napni triceps a vrať činku zpět nahoru"],
      mistakes: ["Pohyb loktů dopředu/dozadu — lokty jsou pevné, pohybuje se jen předloktí", "Lokty se rozevírají do stran — drž je na šířku ramen", "Příliš těžká váha — tohle zatěžuje lokty, buď opatrná"] },
    { name: "Triceps pushdown", equipment: ["cables"], difficulty: "beginner", type: "isolation", movementPattern: "isolation", muscles: "Triceps (všechny hlavy)",
      desc: "Tlaky na triceps na horní kladce — základní izolace.",
      howTo: ["Stůj čelem k horní kladce, uchop tyč nebo lano", "Lokty přitiskni k bokům, předloktí vodorovně", "Tlač dolů do plného napnutí paží — stiskni triceps", "Pomalu vracej zpět do 90° v loktech — ne výš!", "Lokty se nehýbou — jen předloktí"],
      mistakes: ["Lokty se odlepují od boků — přilep je a pohybuj jen předloktím", "Naklánění nad kladku — stůj vzpřímeně", "Příliš velký rozsah nahoru — zastavuj na 90°"] },
    { name: "Kickback", equipment: ["dumbbells"], difficulty: "beginner", type: "isolation", movementPattern: "isolation", muscles: "Triceps",
      desc: "Kopy s jednoručkou za sebe v předklonu.",
      howTo: ["Předkloň se, jednou rukou se opři o lavičku nebo koleno", "Loket pracovní ruky zvedni nahoru podél těla (nadloktí rovnoběžně se zemí)", "Z této pozice natáhni předloktí dozadu — napni triceps", "Nahoře zadrž a stiskni na 1 sekundu", "Pomalu pokrč zpět, nadloktí se nehýbe"],
      mistakes: ["Nadloktí padá dolů — musí být celou dobu rovnoběžně se zemí", "Švihání — pomalý kontrolovaný pohyb", "Příliš těžká váha — kickback je o přesnosti"] },
    { name: "Úzké kliky", equipment: ["bodyweight"], difficulty: "intermediate", type: "compound", movementPattern: "horizontal_push", noWeight: true, muscles: "Triceps, vnitřní prsa",
      desc: "Kliky s úzkým postavením rukou — zaměření na triceps.",
      howTo: ["Kliková pozice, ale ruce blíž k sobě (pod rameny nebo užší)", "Tělo v rovné linii, core zpevněný", "Spouštěj se dolů — lokty jdou dozadu podél těla, ne do stran", "Hrudník ke 2-3 cm od země", "Vytlač se zpět nahoru"],
      mistakes: ["Lokty do stran — musí podél těla dozadu", "Příliš úzký úchop (bolest zápěstí) — stačí pod ramena", "Prohnutá záda — zpevni core"] },
    { name: "Overhead triceps extension", equipment: ["dumbbells"], difficulty: "beginner", type: "isolation", movementPattern: "isolation", muscles: "Triceps (dlouhá hlava)",
      desc: "Jednoručka za hlavou — natahuj ruce nahoru pro triceps.",
      howTo: ["Stůj nebo sedni, jednoručku drž oběma rukama za hlavou", "Nadloktí směřují přímo nahoru k stropu — a tady zůstanou!", "Natahuj předloktí nahoru do plného napnutí", "Nahoře stiskni triceps", "Pomalu spouštěj za hlavu — jen ohyb v loktech"],
      mistakes: ["Nadloktí se kýve dopředu/dozadu — musí být stabilní svisle", "Lokty jdou do stran — drž je blízko hlavy", "Prohýbání zad — zpevni core, vsedě je to jednodušší"] },
  ],
  Nohy: [
    { name: "Dřep (squat)", equipment: ["barbell", "rack"], difficulty: "intermediate", type: "compound", movementPattern: "squat", muscles: "Quadriceps, hamstringy, hýždě, core",
      desc: "Král cviků — compound pohyb na celý spodek těla.",
      howTo: ["Činku polož na horní trapézy (ne na krk!), uchop šířeji než ramena", "Nohy na šířku ramen nebo lehce šířeji, špičky lehce ven", "Nadechni se, zpevni core, začni pohyb tím, že tlačíš hýždě dozadu", "Dřepni alespoň do rovnoběžky stehen se zemí (hlouběji = lepší)", "Vytlač se zpět nahoru, tlač kolena nad špičky, nevychyluj je dovnitř"],
      mistakes: ["Kolena padají dovnitř — tlač je aktivně ven nad špičky", "Kulatá záda — hrudník nahoru, core zpevněný", "Zvedání pat — celá plocha chodidla na zemi, může pomoci podpatek"] },
    { name: "Goblet squat", equipment: ["dumbbells", "kettlebell"], difficulty: "beginner", type: "compound", movementPattern: "squat", muscles: "Quadriceps, hýždě, core",
      desc: "Dřep se závažím u hrudi — perfektní pro učení techniky.",
      howTo: ["Drž jednoručku nebo kettlebell vertikálně u hrudi oběma rukama", "Nohy na šířku ramen nebo šířeji, špičky ven", "Dřepni hluboko — lokty jdou mezi kolena", "Závaží u hrudi automaticky udržuje rovnou záda", "Vytlač se zpět nahoru, kolena nad špičky"],
      mistakes: ["Závaží daleko od těla — drž těsně u hrudníku", "Zvedání pat — celá plocha chodidla", "Mělký dřep — využij výhodu goblet pozice a jdi hluboko"] },
    { name: "Mrtvý tah", equipment: ["barbell"], difficulty: "advanced", type: "compound", movementPattern: "hip_hinge", muscles: "Hamstringy, hýždě, záda, core, trapézy — celé tělo",
      desc: "Nejtěžší compound cvik — zvednutí činky ze země.",
      howTo: ["Činku na zem, stůj s chodidly pod činkou (střed chodidla pod tyčí)", "Předkloň se — uchop činku na šířku ramen, rovná záda!", "Nadechni se, zpevni celé tělo, hrudník nahoru", "Zvedej tažením nohou a zad současně — tyč jede podél nohou", "Nahoře se napřim, stiskni hýždě, ramena stažená dozadu"],
      mistakes: ["Kulatá záda — NEJČASTĚJŠÍ a NEJNEBEZPEČNĚJŠÍ chyba!", "Tyč daleko od těla — musí jet podél holení a stehen", "Zvedání hýždí dřív než ramen — záda a nohy pracují současně"] },
    { name: "Rumunský mrtvý tah", equipment: ["barbell", "dumbbells"], difficulty: "intermediate", type: "compound", movementPattern: "hip_hinge", muscles: "Hamstringy, hýždě, spodní záda",
      desc: "Mrtvý tah s důrazem na hamstringy — předklon s mírně pokrčenými koleny.",
      howTo: ["Stůj s činkou/jednoručkami před stehny, nohy na šířku boků", "Kolena mírně pokrč — a takhle je nech po celou dobu!", "Předkláněj se v bocích, hýždě tlač dozadu — závaží jede podél nohou", "Jdi dolů, dokud ucítíš výrazné natažení v hamstringách", "Stiskni hýždě a vrať se nahoru — záda rovná celou dobu"],
      mistakes: ["Kulatá záda — záda musí být rovná, pohyb je v bocích", "Propínání a ohýbání kolen — kolena jsou fixně lehce pokrčená", "Příliš hluboké spouštění — jdi jen do natažení hamstringů"] },
    { name: "Výpady", equipment: ["dumbbells", "bodyweight"], difficulty: "beginner", type: "compound", movementPattern: "squat", muscles: "Quadriceps, hýždě, hamstringy",
      desc: "Krokové výpady vpřed nebo na místě.",
      howTo: ["Stůj vzpřímeně, jednoručky v rukou (nebo bez závaží)", "Udělej krok dopředu, délka kroku asi 1 metr", "Spouštěj se dolů — obě kolena se ohýbají do 90°", "Zadní koleno téměř k zemi, přední koleno nad špičkou", "Odraz z přední nohy zpět do stoje, opakuj druhou nohou"],
      mistakes: ["Koleno přední nohy přes špičku — krok musí být dostatečně dlouhý", "Úzká stopa — představ si dvě koleje, ne lano", "Naklánění dopředu — trup vzpřímený"] },
    { name: "Leg press", equipment: ["machines"], difficulty: "beginner", type: "compound", movementPattern: "squat", muscles: "Quadriceps, hýždě, hamstringy",
      desc: "Bezpečná strojová alternativa dřepu.",
      howTo: ["Sedni si do stroje, záda a hýždě pevně na sedátku", "Nohy na plošinu na šířku ramen, špičky lehce ven", "Odjisti zarážku, spouštěj plošinu dolů ohýbáním kolen", "Kolena jdou k hrudníku — ne dovnitř!", "Tlač zpět nahoru, ale NEZAMYKEJ kolena nahoře"],
      mistakes: ["Hýždě se odlepují od sedátka — zmenši rozsah", "Zamykání kolen nahoře — NEBEZPEČNÉ! Nech lehce pokrčená", "Kolena dovnitř — tlač je ven nad špičky"] },
    { name: "Leg curl", equipment: ["machines"], difficulty: "beginner", type: "isolation", movementPattern: "isolation", muscles: "Hamstringy",
      desc: "Izolace hamstringů na stroji — ohýbání nohou.",
      howTo: ["Lehni si na stroj na břicho, polštář těsně nad patami", "Uchop madla pro stabilitu", "Ohýbej nohy nahoru ke hýždím — stiskni hamstringy nahoře", "Pomalu spouštěj zpět, kontroluj váhu", "Nedopadej úplně dolů — drž napětí"],
      mistakes: ["Zvedání boků od podložky — boky musí zůstat přilepené", "Příliš rychlý pohyb — pomalá negativní fáze", "Neúplný rozsah — jdi nahoru co nejvíc"] },
    { name: "Leg extension", equipment: ["machines"], difficulty: "beginner", type: "isolation", movementPattern: "isolation", muscles: "Quadriceps",
      desc: "Izolace quadricepsu na stroji — natahování nohou.",
      howTo: ["Sedni si, záda opřená, polštář na přední straně holení (nad kotníky)", "Uchop madla po stranách", "Natahuj nohy dopředu do plného napnutí", "Nahoře stiskni quadriceps na 1 sekundu", "Pomalu spouštěj — kontroluj celý pohyb"],
      mistakes: ["Zvedání hýždí ze sedátka", "Příliš rychlé pouštění váhy", "Trhání na začátku pohybu — plynulý start"] },
    { name: "Bulharské dřepy", equipment: ["dumbbells", "bench"], difficulty: "intermediate", type: "compound", movementPattern: "squat", muscles: "Quadriceps, hýždě, hamstringy, stabilizátory",
      desc: "Jednonožní dřep se zadní nohou na lavičce — skvělý pro hýždě.",
      howTo: ["Stůj zády k lavičce, polož nárt zadní nohy na lavičku", "Přední noha asi krok před lavičkou", "Dřepni na přední noze dolů — zadní koleno ke k zemi", "Přední koleno nad špičkou, trup vzpřímený", "Vytlač se zpět nahoru silou přední nohy"],
      mistakes: ["Příliš blízko lavičky — potřebuješ prostor pro dřep", "Naklánění dopředu — trup rovně", "Koleno přední nohy padá dovnitř — tlač ven"] },
  ],
  Core: [
    { name: "Plank", equipment: ["bodyweight"], difficulty: "beginner", type: "isolation", movementPattern: "core", noWeight: true, isHold: true, muscles: "Přímý břišní sval, šikmé břišní, spodní záda",
      desc: "Statický výdrž v pozici na předloktích — základ core tréninku.",
      howTo: ["Na předloktích a špičkách, lokty pod rameny", "Tělo v rovné linii od hlavy po paty — jako prkno", "Zpevni břicho (jako bys čekala ránu do břicha)", "Dýchej! Nezadržuj dech — krátké kontrolované dechy", "Drž 20-60 sekund — kvalita nad kvantitou"],
      mistakes: ["Hýždě příliš vysoko — tělo musí být rovné", "Prohnutá záda — zpevni břicho víc", "Zadržování dechu — dýchej normálně"] },
    { name: "Bicycle crunches", equipment: ["bodyweight"], difficulty: "beginner", type: "isolation", movementPattern: "core", noWeight: true, muscles: "Přímý a šikmé břišní svaly",
      desc: "Střídavé přitahování kolen a loktů — zapojí celé břicho.",
      howTo: ["Na zádech, ruce za hlavou (netlač na krk!), kolena pokrčená", "Zvedni lopatky od země — tady zůstanou po celou dobu", "Natáhni pravou nohu a otáčej trup — levý loket k pravému kolenu", "Přehoď — pravý loket k levému kolenu", "Plynulé střídání jako na kole, pomalé a kontrolované"],
      mistakes: ["Tahání za krk — ruce jen lehce za hlavou, síla jde z břicha", "Příliš rychlé otáčení — pomalý pohyb s kontrolou", "Spouštění lopatek na zem — lopatky zůstávají zvednuté"] },
    { name: "Russian twists", equipment: ["bodyweight", "dumbbells"], difficulty: "beginner", type: "isolation", movementPattern: "core", noWeight: true, muscles: "Šikmé břišní svaly, přímý sval",
      desc: "Rotační cvik vsedě — tvaruje boky.",
      howTo: ["Sedni si na zem, kolena pokrčená, chodidla na zemi (nebo ve vzduchu pro těžší verzi)", "Zakloň se lehce dozadu — trup asi 45° od země", "Drž ruce (nebo závaží) před hrudníkem", "Otáčej trup ze strany na stranu — závaží se dotýká podlahy po stranách", "Pohyb jde z trupu, ne z paží!"],
      mistakes: ["Jen pohyb rukama bez rotace trupu — otáčej celý hrudní koš", "Příliš velký záklon — 45° stačí", "Záda se hroutí — drž hrudník vystrčený"] },
    { name: "Hanging leg raises", equipment: ["pullup_bar"], difficulty: "advanced", type: "isolation", movementPattern: "core", noWeight: true, muscles: "Spodní břicho, bedrokyčlostehenní sval, celý core",
      desc: "Zvedání nohou ve visu na hrazdě — pokročilý core cvik.",
      howTo: ["Vis na hrazdě, plný svis, paže natažené", "Zvedej natažené (nebo pokrčené pro lehčí verzi) nohy před sebe", "Jdi co nejvýš — ideálně nohy vodorovně nebo výš", "Pomalu spouštěj zpět — NEklátej se!", "Začátečníci: zvedej jen kolena ke hrudi"],
      mistakes: ["Kývání a švihání — čistý kontrolovaný pohyb", "Jen zvednutí kolen a zpět — zkus jít nohy výš", "Ztráta úchopu — posiluj předloktí, používej magnézium"] },
    { name: "Cable woodchops", equipment: ["cables"], difficulty: "intermediate", type: "isolation", movementPattern: "core", muscles: "Šikmé břišní, core, ramena",
      desc: "Rotační pohyb na kladce — funkční core trénink.",
      howTo: ["Nastav kladku nahoru (nebo dolů pro opačný směr)", "Stůj bokem ke kladce, uchop madlo oběma rukama", "Rotuj trupem a táhni madlo šikmo přes tělo — shora dolů", "Paže jsou téměř natažené — pohyb jde z trupu, ne z paží", "Kontrolovaně vracej zpět, udělej všechny repy na jednu stranu, pak otoč"],
      mistakes: ["Ohýbání paží — paže jsou jen prodloužení, rotuje trup", "Pohyb z ramen — síla jde z core a boků", "Příliš rychlý pohyb — pomalá kontrola zvlášť při vracení"] },
    { name: "Dead bug", equipment: ["bodyweight"], difficulty: "beginner", type: "isolation", movementPattern: "core", noWeight: true, muscles: "Hluboké břišní svaly, přímý sval, spodní záda",
      desc: "Skvělý cvik na stabilitu core a spodní záda.",
      howTo: ["Na zádech, ruce natažené ke stropu, kolena pokrčená v 90° (stehna svisle)", "Záda přitiskni k zemi — bederní páteř se nesmí odlepit!", "Současně natáhni pravou ruku za hlavu a levou nohu dopředu", "Vrať zpět, opakuj druhou stranu", "Celou dobu záda přitisknutá — to je to klíčové"],
      mistakes: ["Záda se odlepují od země — zmenši rozsah, dokud to neudrží", "Příliš rychlé tempo — pomalý, kontrolovaný pohyb", "Zadržování dechu — dýchej plynule"] },
    { name: "Ab rollout", equipment: ["barbell"], difficulty: "advanced", type: "isolation", movementPattern: "core", noWeight: true, muscles: "Přímý břišní sval, lats, ramena",
      desc: "Vyrolování s činkou na kolenou — pokročilý core cvik.",
      howTo: ["Na kolenou, ruce na čince s malými kotouči (nebo ab wheel)", "Core zpevněný, záda rovná", "Pomalu se vyroluj dopředu — ruce jedou po zemi před tebe", "Jdi co nejdál, aniž by se prohnula záda", "Silou břicha se stáhni zpět do výchozí pozice"],
      mistakes: ["Prohýbání zad — OKAMŽITĚ zastav, pokud se záda prohnou", "Příliš velký rozsah na začátku — začni s malým rozsahem a přidávej", "Pohyb z ramen místo z core — core tahá zpět, ramena jsou stabilní"] },
  ],
  Hýždě: [
    { name: "Hip thrust", equipment: ["barbell", "bench"], difficulty: "intermediate", type: "compound", movementPattern: "hip_hinge", muscles: "Hýždě (hlavní), hamstringy, spodní záda",
      desc: "Nejúčinnější cvik na hýždě — tlak boky s činkou.",
      howTo: ["Sedni si na zem, lopatky opřené o hranu lavičky, činku přes boky", "Chodidla na zemi na šířku ramen, kolena pokrčená v 90°", "Tlač boky nahoru, dokud tělo netvoří rovnou linii od ramen po kolena", "Nahoře maximálně stiskni hýždě na 1-2 sekundy", "Pomalu spouštěj boky dolů, ale nepoklej úplně"],
      mistakes: ["Prohýbání zad nahoře — stiskni hýždě a drž core", "Chodidla příliš blízko nebo daleko — kolena v 90° nahoře", "Zvedání na špičky — celá plocha chodidla"] },
    { name: "Glute bridge", equipment: ["bodyweight", "dumbbells"], difficulty: "beginner", type: "compound", movementPattern: "hip_hinge", noWeight: true, muscles: "Hýždě, hamstringy",
      desc: "Jednodušší verze hip thrustu na zemi — bez lavičky.",
      howTo: ["Na zádech, kolena pokrčená, chodidla na zemi blízko hýždí", "Jednoručku (pokud používáš) polož na boky", "Tlač boky ke stropu — stiskni hýždě nahoře", "Tělo nahoře: rovná linie od ramen po kolena", "Pomalu dolů — hýždě téměř k zemi, ale nedotýkej se"],
      mistakes: ["Zvedání z beder místo z hýždí — myšlenkově stiskni hýždě", "Příliš daleko chodidla — kolena v 90° nahoře", "Rychlé odrazy — pomalý kontrolovaný pohyb nahoře"] },
    { name: "Sumo dřep", equipment: ["barbell", "dumbbells", "kettlebell"], difficulty: "intermediate", type: "compound", movementPattern: "squat", muscles: "Hýždě, vnitřní stehna, quadriceps",
      desc: "Široký dřep s vytočenými špičkami — zaměřený na hýždě a vnitřní stehna.",
      howTo: ["Široký postoj (1.5-2× šířka ramen), špičky vytočené ven (45°)", "Závaží drž před sebou (kettlebell) nebo na zádech (činka)", "Dřepni rovně dolů — kolena sledují směr špiček", "Jdi do hloubky — ideálně stehna pod rovnoběžku", "Vytlač se zpět nahoru, stiskni hýždě nahoře"],
      mistakes: ["Kolena padají dovnitř — MUSÍ sledovat směr špiček", "Naklánění dopředu — trup co nejvíc vzpřímený", "Příliš úzký postoj — to už je normální dřep"] },
    { name: "Kickback na kladce", equipment: ["cables"], difficulty: "beginner", type: "isolation", movementPattern: "isolation", muscles: "Hýždě (izolace)",
      desc: "Kopy nohou za sebe na spodní kladce — izolace hýždí.",
      howTo: ["Připni manžetu na kotník, stůj čelem ke kladce", "Opři se o rám pro stabilitu, stojná noha lehce pokrčená", "Kopni pracovní nohou za sebe a nahoru — stiskni hýždi", "Nahoře zadrž na 1 sekundu", "Pomalu vracej zpět — kontroluj celý pohyb"],
      mistakes: ["Prohýbání zad — core zpevněný, záda rovná", "Kopání příliš vysoko — pohyb z hýždí, ne ze zad", "Rychlé švihání — pomalý kontrolovaný pohyb"] },
    { name: "Step-up", equipment: ["dumbbells", "bench"], difficulty: "beginner", type: "compound", movementPattern: "squat", muscles: "Hýždě, quadriceps, hamstringy",
      desc: "Výstupy na lavičku jednou nohou — funkční cvik.",
      howTo: ["Stůj před lavičkou (výška kolena nebo nižší), jednoručky v rukou", "Postav celé chodidlo na lavičku — ne jen špičku", "Vytlač se nahoru silou přední nohy — zadní noha jen lehce pomáhá", "Nahoře se napřim, stiskni hýždi", "Pomalu se spouštěj zpět — kontrolovaně"],
      mistakes: ["Odraz ze zadní nohy — síla musí jít z nohy na lavičce", "Příliš vysoká lavička na začátek — začni nižší", "Koleno padá dovnitř — tlač ven nad špičku"] },
  ],
};

const NAMES_EN = {
  "Bench press": "Bench Press", "Bench press s jednoručkami": "Dumbbell Bench Press",
  "Kliky": "Push-ups", "Rozpažky s jednoručkami": "Dumbbell Flyes",
  "Cable crossover": "Cable Crossover", "Šikmý bench press": "Incline Dumbbell Press",
  "Chest press na stroji": "Machine Chest Press", "Diamantové kliky": "Diamond Push-ups",
  "Shrágy": "Shrugs", "Přítahy na kladce": "Cable Lat Pulldown",
  "Bent-over row": "Bent-over Row", "Jednoruční přítah": "Single-arm Dumbbell Row",
  "Shyby": "Pull-ups", "Lat pulldown": "Lat Pulldown",
  "Seated row": "Seated Cable Row", "T-bar row": "T-bar Row",
  "Tlaky nad hlavu": "Overhead Press", "Tlaky s jednoručkami": "Dumbbell Shoulder Press",
  "Upažování": "Lateral Raises", "Face pulls": "Face Pulls",
  "Arnold press": "Arnold Press", "Předpažování": "Front Raises",
  "Bicepsový curl": "Bicep Curl", "Hammer curl": "Hammer Curl",
  "Concentration curl": "Concentration Curl", "Cable curl": "Cable Curl",
  "Chin-upy": "Chin-ups", "Tricepsové kliky na lavičce": "Bench Dips",
  "Francouzský tlak": "Skull Crushers", "Triceps pushdown": "Triceps Pushdown",
  "Kickback": "Triceps Kickback", "Úzké kliky": "Close-grip Push-ups",
  "Overhead triceps extension": "Overhead Triceps Extension",
  "Dřep (squat)": "Barbell Squat", "Goblet squat": "Goblet Squat",
  "Mrtvý tah": "Deadlift", "Rumunský mrtvý tah": "Romanian Deadlift",
  "Výpady": "Lunges", "Leg press": "Leg Press", "Leg curl": "Leg Curl",
  "Leg extension": "Leg Extension", "Bulharské dřepy": "Bulgarian Split Squat",
  "Plank": "Plank", "Bicycle crunches": "Bicycle Crunches",
  "Russian twists": "Russian Twists", "Hanging leg raises": "Hanging Leg Raises",
  "Cable woodchops": "Cable Woodchops", "Dead bug": "Dead Bug", "Ab rollout": "Ab Rollout",
  "Hip thrust": "Hip Thrust", "Glute bridge": "Glute Bridge",
  "Sumo dřep": "Sumo Squat", "Kickback na kladce": "Cable Glute Kickback", "Step-up": "Step-up",
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

const SPLIT_PATTERNS = [
  { label: "Push (Prsa + Ramena + Triceps)", groups: ["Prsa", "Ramena", "Triceps"], zone: "upper" },
  { label: "Pull (Záda + Biceps)", groups: ["Záda", "Biceps"], zone: "upper" },
  { label: "Legs (Nohy + Hýždě + Core)", groups: ["Nohy", "Hýždě", "Core"], zone: "lower" },
  { label: "Upper Body (Prsa + Záda + Ramena)", groups: ["Prsa", "Záda", "Ramena"], zone: "upper" },
  { label: "Lower + Ramena", groups: ["Nohy", "Hýždě", "Ramena"], zone: "mixed" },
  { label: "Záda + Hýždě + Core", groups: ["Záda", "Hýždě", "Core"], zone: "mixed" },
  { label: "Full Body", groups: ["Prsa", "Záda", "Nohy", "Ramena", "Core"], zone: "mixed" },
  { label: "Nohy + Core", groups: ["Nohy", "Core", "Hýždě"], zone: "lower" },
];

const UPPER_GROUPS = new Set(["Prsa", "Záda", "Ramena", "Biceps", "Triceps"]);
const LOWER_GROUPS = new Set(["Nohy", "Hýždě", "Core"]);

const EXERCISE_FAMILY = {
  "Kliky": "pushup", "Diamantové kliky": "pushup", "Úzké kliky": "pushup",
  "Tricepsové kliky na lavičce": "dip",
  "Bench press": "bench", "Bench press s jednoručkami": "bench", "Šikmý bench press": "bench", "Chest press na stroji": "bench",
  "Tlaky nad hlavu": "overhead_press", "Tlaky s jednoručkami": "overhead_press", "Arnold press": "overhead_press",
  "Dřep (squat)": "squat_family", "Goblet squat": "squat_family", "Bulharské dřepy": "squat_family", "Sumo dřep": "squat_family",
  "Mrtvý tah": "deadlift", "Rumunský mrtvý tah": "deadlift",
  "Bicepsový curl": "curl", "Hammer curl": "curl", "Concentration curl": "curl", "Cable curl": "curl",
};

const WEEK_CONFIGS = [
  { label: "Akumulace", weightPct: 1.0, reps: { compound: "6-8", isolation: "10-12" }, setsBonus: 0, deload: false },
  { label: "Zesilování", weightPct: 1.0, reps: { compound: "4-6", isolation: "8-10" }, setsBonus: 0, deload: false },
  { label: "Peak", weightPct: 1.0, reps: { compound: "2-4", isolation: "6-8" }, setsBonus: 1, deload: false },
  { label: "Deload", weightPct: 0.6, reps: { compound: "8-10", isolation: "12-15" }, setsBonus: -1, deload: true },
];

const VOLUME_TARGETS = {
  Prsa: { min: 10, max: 14 },
  Záda: { min: 10, max: 14 },
  Nohy: { min: 10, max: 14 },
  Ramena: { min: 8, max: 12 },
  Biceps: { min: 8, max: 12 },
  Triceps: { min: 8, max: 12 },
  Core: { min: 6, max: 10 },
  Hýždě: { min: 6, max: 10 },
};

const STRENGTH_RATIOS = [
  { a: "Bench press", b: "Bent-over row", idealRatio: 1.0, label: "Prsa vs Záda" },
  { a: "Dřep (squat)", b: "Mrtvý tah", idealRatio: 0.8, label: "Dřep vs Mrtvý tah" },
  { a: "Bench press", b: "Tlaky nad hlavu", idealRatio: 1.5, label: "Bench vs Ramena" },
];

const SUPERSET_PAIR_RULES = {
  horizontal_push: "horizontal_pull",
  horizontal_pull: "horizontal_push",
  vertical_push: "vertical_pull",
  vertical_pull: "vertical_push",
  squat: "hip_hinge",
  hip_hinge: "squat",
};

const BIG_MUSCLE_GROUPS = ["Prsa", "Záda", "Nohy", "Hýždě"];
const SMALL_INCREMENT = 1.25;
const BIG_INCREMENT = 2.5;

// ========== HELPER FUNCTIONS ==========

function getRecoveryStatus(muscleGroup, workoutHistory) {
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
  const recoveryHours = 48;
  const pct = Math.min(100, Math.round((hoursAgo / recoveryHours) * 100));
  return { pct, label: pct >= 80 ? "Odpočatý" : pct >= 50 ? "Skoro OK" : "Regeneruje", hours: Math.round(hoursAgo) };
}

function getLastPerformance(exerciseName, history) {
  for (const w of history) {
    for (const ex of w.exercises) {
      if (ex.name === exerciseName && ex.logged && ex.setDetails) {
        const completedSets = ex.setDetails.filter(s => s.done && s.weight);
        if (completedSets.length > 0) {
          return { sets: completedSets, targetReps: ex.reps, muscleGroup: ex.muscleGroup, date: w.date, rpe: ex.rpe || null };
        }
      }
    }
  }
  return null;
}

function getExerciseHistory(exerciseName, history, limit = 8) {
  const entries = [];
  for (const w of history) {
    for (const ex of w.exercises) {
      if (ex.name === exerciseName && ex.logged && ex.setDetails) {
        const doneSets = ex.setDetails.filter(s => s.done && s.weight);
        if (doneSets.length > 0) {
          const maxW = Math.max(...doneSets.map(s => parseFloat(s.weight) || 0));
          const avgReps = doneSets.reduce((sum, s) => sum + (parseFloat(s.reps) || 0), 0) / doneSets.length;
          entries.push({ date: w.date, sets: doneSets.length, maxWeight: maxW, avgReps: Math.round(avgReps * 10) / 10, rpe: ex.rpe || null });
        }
      }
    }
    if (entries.length >= limit) break;
  }
  return entries;
}

function calcProgression(lastPerf, muscleGroup, targetReps, weekConfig, keyLifts, exerciseName) {
  if (!lastPerf || lastPerf.sets.length === 0) {
    const keyLiftWeight = keyLifts?.[exerciseName];
    if (keyLiftWeight) {
      const w = weekConfig.deload ? Math.round(keyLiftWeight * 0.6 * 4) / 4 : keyLiftWeight;
      const tag = weekConfig.deload ? "deload" : "profile";
      return { suggestedWeight: String(w), tag, noteKey: weekConfig.deload ? "deloadProfile" : "profile", noteData: { w }, lastWeight: null };
    }
    return { suggestedWeight: "", tag: "new", noteKey: "new", noteData: {}, lastWeight: null };
  }

  const avgWeight = lastPerf.sets.reduce((s, set) => s + parseFloat(set.weight || 0), 0) / lastPerf.sets.length;
  const avgReps = lastPerf.sets.reduce((s, set) => s + parseFloat(set.reps || 0), 0) / lastPerf.sets.length;
  const isBig = BIG_MUSCLE_GROUPS.includes(muscleGroup);
  const increment = isBig ? BIG_INCREMENT : SMALL_INCREMENT;

  const daysSinceLast = (Date.now() - new Date(lastPerf.date).getTime()) / (1000 * 60 * 60 * 24);
  let comebackPct = 1.0;
  if (daysSinceLast > 28) comebackPct = 0.80;
  else if (daysSinceLast > 21) comebackPct = 0.85;
  else if (daysSinceLast > 14) comebackPct = 0.90;
  else if (daysSinceLast > 7) comebackPct = 0.95;

  const repsParts = targetReps.split("-");
  const targetMax = parseInt(repsParts[repsParts.length - 1]) || 12;
  const targetMin = parseInt(repsParts[0]) || 8;
  const allSetsHitTarget = lastPerf.sets.every(s => parseFloat(s.reps) >= targetMax);

  if (weekConfig.deload) {
    const deloadWeight = Math.round(avgWeight * 0.6 * 4) / 4;
    return { suggestedWeight: String(deloadWeight), tag: "deload", noteKey: "deload", noteData: { w: deloadWeight, prev: avgWeight }, lastWeight: avgWeight };
  }

  if (comebackPct < 1.0) {
    const comebackWeight = Math.round(avgWeight * comebackPct * 4) / 4;
    const days = Math.round(daysSinceLast);
    return { suggestedWeight: String(comebackWeight), tag: "comeback", noteKey: "comeback", noteData: { w: comebackWeight, days }, lastWeight: avgWeight };
  }

  const lastRpe = lastPerf.rpe;

  if (lastRpe === "easy" && avgWeight > 0) {
    const newWeight = Math.round((avgWeight + increment) * 4) / 4;
    return { suggestedWeight: String(newWeight), tag: "up", noteKey: "rpeEasy", noteData: { w: newWeight, inc: increment }, lastWeight: avgWeight };
  }

  if (lastRpe === "hard" && avgWeight > 0) {
    return { suggestedWeight: String(avgWeight), tag: "same", noteKey: "rpeHard", noteData: { w: avgWeight }, lastWeight: avgWeight };
  }

  if (allSetsHitTarget && avgWeight > 0) {
    const newWeight = Math.round((avgWeight + increment) * 4) / 4;
    return { suggestedWeight: String(newWeight), tag: "up", noteKey: "up", noteData: { prev: avgWeight, reps: Math.round(avgReps), w: newWeight, inc: increment }, lastWeight: avgWeight };
  }

  if (avgReps < targetMin && avgWeight > 0) {
    return { suggestedWeight: String(avgWeight), tag: "same", noteKey: "belowTarget", noteData: { w: avgWeight, reps: Math.round(avgReps), target: targetReps }, lastWeight: avgWeight };
  }

  return {
    suggestedWeight: String(avgWeight || ""),
    tag: "same",
    noteKey: avgWeight ? "stayMax" : "",
    noteData: { w: avgWeight },
    lastWeight: avgWeight || null,
  };
}

function getStrengthHistory(exerciseName, history, limit = 10) {
  const points = [];
  for (const w of [...history].reverse()) {
    for (const ex of w.exercises) {
      if (ex.name === exerciseName && ex.logged && ex.setDetails) {
        const completedSets = ex.setDetails.filter(s => s.done && s.weight);
        if (completedSets.length > 0) {
          const maxWeight = Math.max(...completedSets.map(s => parseFloat(s.weight) || 0));
          points.push({ date: w.date, weight: maxWeight });
        }
      }
    }
    if (points.length >= limit) break;
  }
  return points;
}

function getCycleInfo(cycle) {
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

function getWeeklyVolume(muscleGroup, history) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let totalSets = 0;
  for (const w of history) {
    if (new Date(w.date).getTime() < weekAgo) continue;
    for (const ex of w.exercises) {
      if (ex.muscleGroup === muscleGroup && ex.logged && ex.setDetails) {
        totalSets += ex.setDetails.filter(s => s.done).length;
      }
    }
  }
  return totalSets;
}

function getExerciseMuscleGroup(name) {
  for (const [group, exercises] of Object.entries(EXERCISE_LIBRARY)) {
    if (exercises.some(ex => ex.name === name)) return group;
  }
  return null;
}

function analyzeWeakPoints(history) {
  const maxWeights = {};
  for (const w of history) {
    for (const ex of w.exercises) {
      if (ex.logged && ex.setDetails) {
        const weights = ex.setDetails.filter(s => s.done && s.weight).map(s => parseFloat(s.weight));
        if (weights.length > 0) {
          const max = Math.max(...weights);
          if (!maxWeights[ex.name] || max > maxWeights[ex.name]) maxWeights[ex.name] = max;
        }
      }
    }
  }
  const issues = [];
  for (const ratio of STRENGTH_RATIOS) {
    const wA = maxWeights[ratio.a];
    const wB = maxWeights[ratio.b];
    if (!wA || !wB) continue;
    const actual = wA / wB;
    const deviation = actual / ratio.idealRatio;
    if (deviation > 1.25) {
      issues.push({
        label: ratio.label,
        message: `${ratio.b} zaostává — poměr ${actual.toFixed(1)}:1 (ideál ${ratio.idealRatio}:1)`,
        weakGroup: getExerciseMuscleGroup(ratio.b),
      });
    } else if (deviation < 0.75) {
      issues.push({
        label: ratio.label,
        message: `${ratio.a} zaostává — poměr ${actual.toFixed(1)}:1 (ideál ${ratio.idealRatio}:1)`,
        weakGroup: getExerciseMuscleGroup(ratio.a),
      });
    }
  }
  return issues;
}

function getExerciseAlternatives(exercise, equipment, currentExerciseNames) {
  const eqSet = new Set(equipment);
  const group = exercise.muscleGroup;
  const pattern = exercise.movementPattern;
  const all = (EXERCISE_LIBRARY[group] || []).filter(ex =>
    ex.name !== exercise.name && !currentExerciseNames.includes(ex.name)
  );
  const sort = (list) => [...list.filter(ex => ex.movementPattern === pattern), ...list.filter(ex => ex.movementPattern !== pattern)];
  const mine = sort(all.filter(ex => ex.equipment.some(e => eqSet.has(e))));
  const other = sort(all.filter(ex => !ex.equipment.some(e => eqSet.has(e))));
  return { mine, other };
}

function selectExercises(group, eqSet, history, maxCount, globalUsedPatterns = {}, globalUsedFamilies = {}) {
  const available = (EXERCISE_LIBRARY[group] || []).filter(ex =>
    ex.equipment.some(e => eqSet.has(e))
  );
  if (available.length === 0) return [];

  const recentNames = new Set();
  let wCount = 0;
  for (const w of history) {
    for (const ex of w.exercises) {
      if (ex.muscleGroup === group && ex.logged) recentNames.add(ex.name);
    }
    if (++wCount >= 4) break;
  }

  const scored = available.map(ex => {
    let score = 0;
    if (ex.type === "compound") score += 100;
    if (recentNames.has(ex.name)) score += 50;
    const patternUses = globalUsedPatterns[ex.movementPattern] || 0;
    if (patternUses >= 2) score -= 80;
    else if (patternUses >= 1) score -= 30;
    const family = EXERCISE_FAMILY[ex.name];
    if (family && globalUsedFamilies[family]) score -= 120;
    score += Math.random() * 10;
    return { ...ex, _score: score };
  });
  scored.sort((a, b) => b._score - a._score);

  const selected = [];
  const usedPatterns = new Set();
  const usedFamiliesLocal = new Set();
  const deferred = [];

  for (const ex of scored) {
    if (selected.length >= maxCount) break;
    const family = EXERCISE_FAMILY[ex.name];
    const familyBlocked = family && (globalUsedFamilies[family] || usedFamiliesLocal.has(family));
    if ((!usedPatterns.has(ex.movementPattern) || ex.movementPattern === "isolation" || ex.movementPattern === "core") && !familyBlocked) {
      selected.push(ex);
      usedPatterns.add(ex.movementPattern);
      if (family) usedFamiliesLocal.add(family);
    } else {
      deferred.push(ex);
    }
  }

  for (const ex of deferred) {
    if (selected.length >= maxCount) break;
    selected.push(ex);
  }

  return selected;
}

function getRecentZoneBalance(history) {
  const cutoff = Date.now() - 5 * 24 * 60 * 60 * 1000;
  let upper = 0, lower = 0, mixed = 0;
  for (const w of history) {
    if (new Date(w.date).getTime() < cutoff) break;
    const groups = new Set(w.exercises.filter(e => e.logged).map(e => e.muscleGroup));
    const hasUpper = [...groups].some(g => UPPER_GROUPS.has(g));
    const hasLower = [...groups].some(g => LOWER_GROUPS.has(g));
    if (hasUpper && hasLower) mixed++;
    else if (hasUpper) upper++;
    else if (hasLower) lower++;
  }
  return { upper, lower, mixed };
}

function generateWorkout(equipment, history, cycle, profile, preferredGroups = null) {
  const cycleInfo = getCycleInfo(cycle);
  const weekConfig = cycleInfo.config;
  const recoveries = {};
  MUSCLE_GROUPS.forEach(mg => { recoveries[mg] = getRecoveryStatus(mg, history); });

  const weakPoints = analyzeWeakPoints(history);
  const weakGroups = new Set(weakPoints.map(wp => wp.weakGroup).filter(Boolean));

  const eqSet = new Set(equipment);
  const zoneBalance = getRecentZoneBalance(history);

  let bestSplit;
  if (preferredGroups) {
    bestSplit = { groups: preferredGroups };
  } else {
    const scored = SPLIT_PATTERNS.map(sp => {
      const avgRecovery = sp.groups.reduce((s, g) => s + recoveries[g].pct, 0) / sp.groups.length;
      const weakBonus = sp.groups.some(g => weakGroups.has(g)) ? 10 : 0;
      const patterns = new Set();
      let groupsWithExercises = 0;
      for (const g of sp.groups) {
        const avail = (EXERCISE_LIBRARY[g] || []).filter(ex => ex.equipment.some(e => eqSet.has(e)));
        if (avail.length > 0) groupsWithExercises++;
        avail.forEach(ex => patterns.add(ex.movementPattern));
      }
      const coveragePct = groupsWithExercises / sp.groups.length;
      const varietyScore = patterns.size * 5 + coveragePct * 15;

      let zoneBonus = 0;
      if (sp.zone === "upper" && zoneBalance.upper > zoneBalance.lower + 1) zoneBonus = -25;
      else if (sp.zone === "upper" && zoneBalance.upper > zoneBalance.lower) zoneBonus = -12;
      else if (sp.zone === "lower" && zoneBalance.lower > zoneBalance.upper + 1) zoneBonus = -25;
      else if (sp.zone === "lower" && zoneBalance.lower > zoneBalance.upper) zoneBonus = -12;
      else if (sp.zone === "lower" && zoneBalance.upper > zoneBalance.lower) zoneBonus = 15;
      else if (sp.zone === "upper" && zoneBalance.lower > zoneBalance.upper) zoneBonus = 15;
      if (sp.zone === "mixed") zoneBonus += 5;

      return { ...sp, score: avgRecovery + weakBonus + varietyScore + zoneBonus };
    });
    scored.sort((a, b) => b.score - a.score);
    bestSplit = scored[0];
  }

  const exercises = [];
  const globalUsedPatterns = {};
  const globalUsedFamilies = {};

  const groupCount = bestSplit.groups.length;

  for (const group of bestSplit.groups) {
    const isPrimary = group === bestSplit.groups[0];
    const currentVolume = getWeeklyVolume(group, history);
    const target = VOLUME_TARGETS[group];
    const remaining = Math.max(0, target.max - currentVolume);

    let exerciseCount = isPrimary
      ? (groupCount >= 4 ? 2 : 3)
      : (groupCount >= 4 ? 1 : 2);
    let baseSets = 4;

    if (weekConfig.deload) {
      exerciseCount = Math.max(1, exerciseCount - 1);
      baseSets = 3;
    }

    baseSets += weekConfig.setsBonus;
    baseSets = Math.max(2, baseSets);

    if (remaining <= 2 && remaining > 0) {
      exerciseCount = 1;
      baseSets = Math.min(baseSets, remaining);
    } else if (remaining === 0) {
      exerciseCount = 1;
      baseSets = 2;
    } else if (remaining < exerciseCount * baseSets) {
      exerciseCount = Math.max(1, Math.ceil(remaining / baseSets));
    }

    const selected = selectExercises(group, eqSet, history, exerciseCount, globalUsedPatterns, globalUsedFamilies);

    for (const ex of selected) {
      globalUsedPatterns[ex.movementPattern] = (globalUsedPatterns[ex.movementPattern] || 0) + 1;
      const family = EXERCISE_FAMILY[ex.name];
      if (family) globalUsedFamilies[family] = (globalUsedFamilies[family] || 0) + 1;
      const exType = ex.type === "compound" ? "compound" : "isolation";
      const reps = ex.isHold ? "30-60s" : weekConfig.reps[exType];
      const lastPerformance = getLastPerformance(ex.name, history);
      const overloadResult = ex.noWeight
        ? { suggestedWeight: "", tag: "bodyweight", note: "", lastWeight: null }
        : calcProgression(lastPerformance, group, reps, weekConfig, profile?.keyLifts, ex.name);

      exercises.push({
        id: Math.random().toString(36).substr(2, 9),
        name: ex.name,
        muscleGroup: group,
        desc: ex.desc,
        type: ex.type,
        movementPattern: ex.movementPattern,
        noWeight: ex.noWeight || false,
        isHold: ex.isHold || false,
        sets: baseSets,
        reps,
        weight: overloadResult.suggestedWeight || "",
        logged: false,
        progressTag: overloadResult.tag,
        noteKey: overloadResult.noteKey,
        noteData: overloadResult.noteData,
        lastWeight: overloadResult.lastWeight,
        setDetails: Array.from({ length: baseSets }, () => ({
          reps: "",
          weight: overloadResult.suggestedWeight || "",
          done: false,
        })),
      });
    }
  }

  let pairCounter = 0;
  const pairedIndices = new Set();

  for (let i = 0; i < exercises.length; i++) {
    if (pairedIndices.has(i)) continue;
    const ex = exercises[i];
    const wantedPattern = SUPERSET_PAIR_RULES[ex.movementPattern];
    let found = false;

    if (wantedPattern) {
      for (let j = i + 1; j < exercises.length; j++) {
        if (pairedIndices.has(j)) continue;
        if (exercises[j].movementPattern === wantedPattern && exercises[j].muscleGroup !== ex.muscleGroup) {
          const pid = `pair_${pairCounter++}`;
          exercises[i].pairId = pid;
          exercises[j].pairId = pid;
          pairedIndices.add(i);
          pairedIndices.add(j);
          found = true;
          break;
        }
      }
    }

    if (!found && (ex.movementPattern === "isolation" || ex.movementPattern === "core")) {
      for (let j = i + 1; j < exercises.length; j++) {
        if (pairedIndices.has(j)) continue;
        if ((exercises[j].movementPattern === "isolation" || exercises[j].movementPattern === "core") && exercises[j].muscleGroup !== ex.muscleGroup) {
          const pid = `pair_${pairCounter++}`;
          exercises[i].pairId = pid;
          exercises[j].pairId = pid;
          pairedIndices.add(i);
          pairedIndices.add(j);
          found = true;
          break;
        }
      }
    }

    if (!found) exercises[i].pairId = null;
  }

  const reordered = [];
  const placed = new Set();
  for (let i = 0; i < exercises.length; i++) {
    if (placed.has(i)) continue;
    reordered.push(exercises[i]);
    placed.add(i);
    if (exercises[i].pairId) {
      const partnerIdx = exercises.findIndex((e, j) => j !== i && !placed.has(j) && e.pairId === exercises[i].pairId);
      if (partnerIdx !== -1) {
        reordered.push(exercises[partnerIdx]);
        placed.add(partnerIdx);
      }
    }
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    date: new Date().toISOString(),
    splitLabel: bestSplit.label || bestSplit.groups.join(" + "),
    weekLabel: `T${cycleInfo.week} · ${weekConfig.label}`,
    exercises: reordered,
    completed: false,
  };
}

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
                const thisMonth = now.getMonth();
                const thisYear = now.getFullYear();
                const thisMonthCount = history.filter(w => {
                  const d = new Date(w.date);
                  return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
                }).length;
                const daysInMonth = new Date(thisYear, thisMonth + 1, 0).getDate();
                const today = now.getDate();
                const dots = [];
                for (let d = 1; d <= daysInMonth; d++) {
                  const ds = `${thisYear}-${String(thisMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                  const count = history.filter(w => w.date?.slice(0, 10) === ds).length;
                  dots.push({ day: d, count, isToday: d === today, isPast: d <= today });
                }

                return (
                  <div style={{
                    marginTop: 12, padding: 16, borderRadius: C.r, border: C.cardBorder,
                    background: C.cardGrad, boxShadow: C.shadow
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{monthNamesFull[thisMonth]}</div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: C.accent }}>{thisMonthCount}<span style={{ fontSize: 12, fontWeight: 700, color: C.textMuted }}> {t.home.workouts(thisMonthCount)}</span></div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
                      {t.home.days.map(d => (
                        <div key={d} style={{ fontSize: 9, fontWeight: 700, color: C.textMuted, textAlign: "center", paddingBottom: 2 }}>{d}</div>
                      ))}
                      {(() => {
                        const firstDay = new Date(thisYear, thisMonth, 1).getDay();
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
