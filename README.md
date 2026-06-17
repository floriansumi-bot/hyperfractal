# HyperFractal — portfolio demo site

A portfolio landing page for **HyperFractal**, a real-time, audio-reactive psychedelic
fractal visualizer built for raves, parties and projection mapping. The landing page
explains the project and **launches the actual live demo** (`app.html`).

## Live
- Site:  https://floriansumi-bot.github.io/hyperfractal/
- Demo:  https://floriansumi-bot.github.io/hyperfractal/app.html

## What's here
- `index.html` — the portfolio landing page (animated hero, features, controls, tech)
- `app.html` — the real visualizer: a single self-contained WebGL + Web Audio app
- `css/styles.css`, `js/app.js` — landing styling and behavior (hero canvas, nav, reveal)
- `assets/` — favicon, PWA icons, mandala art, social card
- `manifest.webmanifest`, `sw.js`, `robots.txt`, `sitemap.xml`

Pure static — no build step, no backend, no keys. Music and microphone are processed
locally in the browser; nothing is uploaded.

> `app.html` is a copy of the standalone visualizer kept at `Documents\fractal-visualizer\index.html`
> (whose desktop launcher stays intact). If you update the visualizer there, re-copy it here.

## Run locally
```bash
python -m http.server 8000
# visit http://localhost:8000
```

## Hosting
GitHub Pages (branch `main`, root). Any push to `main` redeploys.

Best experienced fullscreen on a desktop in Chrome or Edge.

---
A portfolio project by Florian Sumi.
