Perfect. Hieronder staat de **gefinaliseerde versie** van `@project_description.md`, **volledig aangepast** aan je laatste antwoorden.
Dit document is nu **implementatie-klaar** voor een React 19 + Vite webapp en kan zo in de root van je repo geplaatst worden.

Ik heb geen Electron, geen overbodige opties en geen vaagheden meer laten staan.

---

```md
# 🎼 Notenleer – Notenbalk Trainer

Een minimalistische educatieve webapp om kinderen (±10 jaar) te helpen bij het leren herkennen van muzieknoten op de notenbalk, met **solsleutel** en **fasleutel**.

De app toont één noot per keer op een SVG-notenbalk. De gebruiker antwoordt via knoppen met **do, re, mi, fa, sol, la, si**. Er is puntentelling, moeilijkheidsniveaus en een lokale highscore per niveau.

Deploy: **https://notenleer.kubuz.net**

---

## 🎯 Doel

- Leren herkennen van noten op de notenbalk
- Oefenen met **solsleutel** en **fasleutel**
- Spelenderwijs vooruitgang maken via score en herhaling
- Volledig client-side, zonder accounts of backend

---

## 👧 Doelgroep

- Kinderen rond **10 jaar**
- Beginnende muziekleerlingen
- Zelfstandig gebruik

---

## 🎼 Notensysteem

- **Fixed Do**
  - Do = C
  - Re = D
  - Mi = E
  - Fa = F
  - Sol = G
  - La = A
  - Si = B
- Geen toonaarden of transpositie

---

## 🎚️ Moeilijkheidsniveaus

### 🟢 Makkelijk
- Alleen noten **binnen de notenbalk**
- Nootnaam staat **onder de noot geschreven**
- Noot wordt **automatisch afgespeeld**
- Klik op de noot herhaalt het geluid

### 🟡 Gemiddeld
- Noten **binnen én buiten de notenbalk**
- Inclusief **hulplijntjes**
- Geen geschreven nootnaam
- Noot wordt **automatisch afgespeeld**
- Klik op de noot herhaalt het geluid

### 🔴 Moeilijk
- Alle mogelijke noten
- Inclusief meerdere hulplijntjes boven en onder de notenbalk
- Geen geschreven nootnaam
- **Geen geluid**
- Klik op de noot doet niets

---

## 🎲 Sleutelverdeling (Sol / Fa)

- Sol- en fasleutel komen door elkaar voor
- De verdeling wordt ingesteld met een **slider**
- Sliderstappen: **per 25%**

| Sliderpositie | Betekenis |
|--------------|----------|
| 100% links   | Alleen solsleutel |
| 75% links    | 75% sol / 25% fa |
| Midden       | 50% sol / 50% fa |
| 75% rechts   | 25% sol / 75% fa |
| 100% rechts  | Alleen fasleutel |

- Actieve sleutel wordt visueel aangeduid boven of naast de notenbalk

---

## 🧠 Spelverloop

- Een sessie bestaat standaard uit **10 noten**
- Noten verschijnen **één voor één**
- De volgende noot verschijnt zodra de vorige:
  - juist beantwoord is, of
  - twee keer fout beantwoord is

---

## ❌ Pogingen & Feedback

Per noot zijn er **maximaal 2 pogingen**.

### Eerste fout
- Noot kleurt **oranje**
- **Geen punt**
- Gebruiker mag opnieuw kiezen

### Tweede fout
- Noot kleurt **rood**
- **-1 punt**
- Automatisch naar volgende noot

### Juist antwoord
- **+1 punt**
- Automatisch naar volgende noot

Er is **geen aparte feedback of pauze**.  
Het spel blijft in een continue flow.

---

## 🔊 Audio

- Instrument: **piano**
- Lichtgewicht browser-audio
- Gedrag:
  - Makkelijk & gemiddeld: automatische playback
  - Klik op de noot herhaalt het geluid
  - Moeilijk: audio volledig uitgeschakeld

---

## 🏆 Score & Highscore

- Score loopt per sessie
- Highscore:
  - Wordt lokaal opgeslagen via **localStorage**
  - **Apart per moeilijkheidsniveau**
  - Geen accounts
  - Geen cloud

---

## 🎨 UI / UX

- Minimalistisch design
- Kleuren:
  - Wit (achtergrond)
  - Zwart (notenbalk, tekst)
  - Eén accentkleur (status, highlights)
- Notenbalk staat **gecentreerd**
- Alles is **SVG**
- Subtiele animaties toegestaan:
  - Fade-in van noot
  - Zachte kleurtransitie bij fout
  - Kleine bevestiging bij juist antwoord

---

## 🖥️ Technische stack

- React 19
- TypeScript
- Vite (SPA)
- Geen SSR
- Geen backend
- Geen externe services

---

## 📁 Projectstructuur (aanbevolen)

```

src/
app/
App.tsx
Router.tsx
features/
trainer/
TrainerPage.tsx
components/
StaffSvg.tsx
NoteSvg.tsx
ClefIndicator.tsx
AnswerButtons.tsx
ScoreBar.tsx
ClefSlider.tsx
hooks/
useTrainerSession.ts
useNoteGenerator.ts
useAudio.ts
useHighScore.ts
types.ts
utils/
noteRanges.ts
clefMapping.ts
random.ts
shared/
ui/
hooks/
utils/

```

---

## 🚀 Deploy

- Repository: **GitHub**
- Hosting: **Netlify**
- Subdomain:
  - `notenleer.kubuz.net`


## 📌 Samenvatting

Een strakke, educatieve notenleer-webapp met SVG-rendering, sol- en fasleutel, vaste do-notatie, duidelijke moeilijkheidsniveaus, scoremechanisme met twee pogingen per noot en lokale highscore, volledig in het Nederlands en gehost via Netlify.
```

