# IndustrCons Engineering Comics (IRE‑3)

A fully client-side, offline-capable interactive comic reader for learning real engineering & construction practice — no backend, no database. Pure HTML/CSS/JS.

## ✨ v3 — Premium Upgrade
This version restyles and extends the platform into a premium digital-comic experience while keeping every v2 feature intact:
- **Dark-luxury glassmorphism UI** (now the default theme) with an animated ambient background, 3D-hover comic cards, and a splash/loading screen.
- **New Home sections**: Featured Comics slider (auto-rotating + swipe arrows), Trending, Editor's Choice, Recently Added, smarter "Recommended For You" (based on your most-completed genre), a "Construction Universe" row of clickable characters, and auto-generated Collections.
- **Richer comic cards**: star rating, mentor/author line, skills-learned tags, share button (native share sheet or clipboard link), and a "save for offline" indicator.
- **Reading experience**: a Classic (page-by-page) / Vertical Scroll (Webtoon-style) mode switch, tap-to-zoom on any panel, hidden clickable easter-egg collectibles per comic, real voice narration (browser SpeechSynthesis, distinct pitch per speaker), and a procedurally generated ambient construction soundscape (no audio files, pure Web Audio).
- **Deeper library filters**: genre chips (Engineering, AI, Business, Leadership, etc. — additive to the original categories), a "Downloaded Only" filter, and character-based filtering from the Construction Universe row.
- **Deeper profile**: collectibles tracker, a new "Treasure Hunter" badge, favorite-genre detection, personalized recommendations, and a private "Reading Journal" where you can star-rate and leave yourself notes on any comic (stored locally only, clearly labeled as such).
- **Basic offline support**: a service worker (`sw.js`) caches the whole app shell so it keeps working after the first visit, even with no connection.

### What's intentionally *not* included (and why)
Real multi-user **comments, reviews, ratings, discussions, fan art, creator profiles, and a comic-creation contest** all require a backend (a database and shared storage across visitors) — this project is a zero-backend static site by design. The "Reading Journal" and "Site Crew Leaderboard" are the closest honest equivalents: they're clearly labeled as local/private/on-device rather than pretending to be shared community features. If you want real community features later, the natural next step is adding a small backend (e.g. Supabase/Firebase) — happy to help design that when you're ready.

## Run it locally
Just open `index.html` in a browser, or serve the folder:
```bash
python3 -m http.server 8000
```
then visit `http://localhost:8000`.

## Deploy to GitHub Pages
1. Create a new repo (or use an existing one) and push all files in this folder to the root (or a `/docs` folder).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)` (or `/docs`).
4. Save — your app will be live at `https://<username>.github.io/<repo>/` within a minute or two.

No build step, no dependencies to install — it's ready as-is.

## Files
- `index.html` — app shell (topbar, views, reader overlay, bottom nav, splash screen, zoom overlay) + full SEO head (meta, Open Graph, canonical, JSON-LD)
- `styles.css` — dark-luxury glassmorphism design system, animated background, 3D card hovers, dark/light mode
- `illustrations.js` — original SVG scene + character generator (no external images)
- `data.js` — 10 branching interactive comics across construction disciplines, each with genres/skills/rating/mentor metadata and a hidden collectible
- `app.js` — navigation, reader engine (classic + vertical modes), XP/levels/badges/collectibles, search/filters, voice narration, ambient sound, sharing, offline-save, dynamic SEO
- `sw.js` — service worker for offline caching of the app shell
- `assets/logo.png` — official IndustrCons logo (on-page display, favicon)
- `assets/logo-og.jpg` — compact JPG version of the logo for Open Graph/Twitter previews and schema.org ImageObject
- `sitemap.xml` — generated from the real comic catalog in `data.js`
- `robots.txt` — allows crawling and points to `sitemap.xml`


## ✅ Site URL already set
This copy is pre-configured for:
```
https://elvinasgar.github.io/IndustrCons-Engineering-Comics/
```
It's baked into `index.html` (the `window.INDUSTRCONS_SITE_URL` line, canonical link, and every OG/JSON-LD block), `sitemap.xml`, and `robots.txt`. If you ever move the site to a different URL, find-and-replace that string in those three files (no change needed in `app.js` — it reads `window.INDUSTRCONS_SITE_URL` automatically).

## Deploying updates safely
Always replace the **entire** set of files together (delete the old ones first, then upload the new set) rather than hand-editing individual files in GitHub's web editor. A single stray edit inside `data.js` or `app.js` (like a duplicated variable declaration or a broken bracket) will silently break the whole app — since it's plain JavaScript, one syntax error stops everything below it from running, which shows up as a blank comic list with no error visible on screen.

## SEO & structured data included
- **Organization schema** — describes IndustrCons as the publisher.
- **ComicSeries schema** — describes the comic collection as a whole.
- **ImageObject schema** — describes the official logo asset.
- **BreadcrumbList schema** — site-level (Home → Comic Library) statically, plus a deeper one (Home → Library → Category → Comic) injected dynamically while a comic is open.
- **CreativeWork schema** — one per comic. A full catalog (`ItemList` of `CreativeWork`) is generated from `data.js` and injected into `<head>` on load; an additional single `CreativeWork` + updated `<title>`/meta description/Open Graph tags are swapped in dynamically whenever a specific comic is opened, and reverted on close.
- **Open Graph & Twitter Card** meta tags, updated dynamically per comic for accurate link previews.
- **Canonical URL** tag (kept pointed at the root page, since this is a single-page app — see note below).
- **XML sitemap** (`sitemap.xml`) listing the home page, library, profile, and one entry per comic.
- **robots.txt** allowing full crawling and linking to the sitemap.

### A note on SPA + SEO
Because this is a client-rendered single-page app with no server and no per-page routing, true per-page indexing has real limits — search engines that don't execute JavaScript will only ever see the site-level schema in `index.html`. Google's crawler does execute JavaScript and will see the dynamic per-comic schema and meta updates, but for the strongest possible SEO (fully unique indexable URLs per comic), consider a static-site generator or prerendering service later. Everything here is the best achievable version within a zero-backend, zero-build static site.

## Recommended links at the end of every comic
Every ending screen now shows a "📚 Learn More" panel linking out to the rest of the IndustrCons IRE-3 toolkit:
- **Related Knowledge** → IndustrCons Estimator (`industrconsestimator.netlify.app`)
- **Related Documents** → IndustrCons Docs (`industrconsdocs.netlify.app`)
- **Ask IndustrCons AI** → IndustrCons AI (`industrcons-ai.vercel.app`)

All three open in a new tab.


## What's inside
- 10 interactive engineering comics (Concrete, Rebar, Formwork, Excavation, Foundations, Steel, Road, Bridge, Survey/BIM, Procurement) — each is a **decision diamond**: two sequential decision points, up to 5 pages, and **4 distinct endings** (40 unique endings total) covering Excellent Engineer, Zero Accident Award, Client Satisfaction, Project Delay, Quality Failure, Safety Incident, Budget Saved, and Contract Problem.
- Richer illustrations: gradient skies, clouds/birds/stars, weather effects (rain/wind), and character pose variety — all generated as original SVG, no external images.
- After every ending: what happened / what was correct / what went wrong / an engineering tip / common mistakes / real site practice / a mini quiz.
- Gamification: XP, engineer ranks with level-up celebrations, 10 achievement badges, printable certificates for 4★+ endings, a local "site crew" leaderboard, daily challenge, streaks, confetti.
- Discovery: search, category & difficulty filters, bookmarks, favorites, recently read, continue reading, random comic.
- Dark/light theme toggle and a sound-effects toggle (generated with the Web Audio API — no audio files needed).
- All progress is stored in `localStorage` on the user's device — nothing is sent anywhere.

## Extending it
Add a new comic by appending an object to the `STORIES` array in `data.js` — just follow the existing node-graph shape (`start`, `nodes{}`, decisions, endings, quiz). The illustration engine in `illustrations.js` will automatically render any combination of the built-in `SCENES` and `ROLES` you reference, so no image assets are ever required.
