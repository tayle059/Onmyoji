# Onmyoji: Charmbound

A dark, isometric top-down pixel-art web prototype where you play as **Rei Kurogami**, a shaman who defeats demons in battle and seals them into paper charms.

## Why there was no preview
There is currently **no deployed hosting target** (such as GitHub Pages, Vercel, or Netlify) in this repository, so no automatic online preview URL is generated.


## Hosted preview
After this workflow runs on GitHub, a live preview is available via **GitHub Pages** (repo Settings → Pages).

## Local preview
Open `index.html` directly, or serve locally:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Features
- Isometric pixel-art battlefield rendered on HTML5 canvas.
- Three selectable starter demons with different attack/trapping profiles:
  - **Kagewolf** (Bleak Fang)
  - **Ember Oni** (Ash Drinker)
  - **Mirecrow** (Rot Oracle)
- Battle loop:
  - Attack to reduce enemy HP.
  - Seal defeated demons using ritual paper charms.
  - Summon new enemies and keep hunting.
- Dark/edgy visual theme and atmospheric UI.
