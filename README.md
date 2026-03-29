# ⚡ PEACHY PUMP — Tréninkový generátor

AI tréninkový generátor s progressive overload, regenerací svalů a historií tréninků.

---

## 🚀 Jak nasadit na Vercel (ZDARMA) — krok za krokem

### Co budeš potřebovat:
- GitHub účet (zdarma na github.com)
- Vercel účet (zdarma na vercel.com — přihlásíš se přes GitHub)

### Postup:

#### 1. Vytvoř GitHub repozitář
1. Jdi na **github.com** → klikni na **+** vpravo nahoře → **New repository**
2. Pojmenuj ho `powerfit`, zvol **Public**, klikni **Create repository**

#### 2. Nahraj soubory
**Nejjednodušší cesta (přes web):**
1. V novém repozitáři klikni na **"uploading an existing file"**
2. Rozbal stažený ZIP soubor na počítači
3. Přetáhni **OBSAH složky `powerfit/`** (ne složku samotnou!) do prohlížeče
   - Měla bys nahrát: `package.json`, `vite.config.js`, `index.html`, složku `src/`, složku `public/`
4. Klikni **Commit changes**

**Nebo přes terminál (pokud máš Git):**
```bash
cd powerfit
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TVUJ-USERNAME/powerfit.git
git push -u origin main
```

#### 3. Nasaď na Vercel
1. Jdi na **vercel.com** → přihlaš se přes GitHub
2. Klikni **"Add New..."** → **Project**
3. Najdi repozitář `powerfit` a klikni **Import**
4. Vercel automaticky detekuje Vite — **nic neměň**, jen klikni **Deploy**
5. Za ~1 minutu budeš mít svou appku na adrese typu `powerfit-xxx.vercel.app`

#### 4. Přidej si appku na plochu telefonu
**iPhone:**
1. Otevři adresu v Safari (NE v Chrome!)
2. Klikni na tlačítko sdílení (čtvereček se šipkou) dole
3. Zvol **Přidat na plochu**

**Android:**
1. Otevři adresu v Chrome
2. Klikni na tři tečky vpravo nahoře
3. Zvol **Přidat na plochu** nebo **Nainstalovat aplikaci**

---

## 📱 Jak to funguje

- **Otevřeš appku** → klikneš "Vygeneruj dnešní trénink" → máš trénink
- **Progressive overload**: Když splníš všechny série s plným počtem opakování, příště ti appka automaticky zvedne váhu
- **Regenerace svalů**: Sleduje, které svaly potřebují odpočinek (48h cyklus)
- **Historie**: Všechny tréninky se ukládají v telefonu
- **Offline**: Funguje i bez internetu (díky PWA)

---

## 🛠 Lokální vývoj

```bash
npm install
npm run dev
```

Appka poběží na `http://localhost:5173`
