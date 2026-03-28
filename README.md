# TikTok Player — React + Vite

A TikTok-style vertical video player built as a React web application for the **Kamao.ai React Developer Intern** assessment.

---

## Video Demo

📹 [Watch Demo](#) 

---

## Quick Start
```bash
git clone https://github.com/Diwakar-Bobburi/tiktok-player-Diwakar.git
cd tiktok-player-Diwakar
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)
---

## Features

### Core (Required)

| Feature | Details |
|---|---|
| Full-screen vertical feed | One video per viewport, `height: 100vh` per card |
| Smooth swipe navigation | `scroll-snap-type: y mandatory` — browser handles snapping natively |
| 5 sample videos | Google public CDN — CORS-open, no auth required |
| Infinite loop | Scroll listener detects last video → `scrollTo({ top: 0, behavior: "instant" })` |
| Auto-play on scroll | `IntersectionObserver` at 60% threshold via `useVideoFeed` hook |
| Auto-pause on scroll away | `isActive` prop — only the visible card plays |
| Tap to play/pause | Transparent tap layer + icon flashes for 900ms then fades |
| Play/pause icon overlay | CSS `fadeOut` keyframe animation |
| Progress bar | `onTimeUpdate` → `currentTime / duration` fills left to right |
| Like with animation + count | Bounce keyframe + count ±1 on toggle |
| Comment button + count | Speech bubble icon with count display |
| Share button | Share icon with count display |
| Bookmark/Save toggle | Teal glow when saved |
| Username + caption | `UserInfo` component bottom-left |
| Caption 2-line truncation | `-webkit-line-clamp: 2` + tap **more** to expand |
| Spinning music disc | Rotates via `spin` keyframe while video plays |
| Sound toggle mute/unmute | Tap upper center → mute icon flashes briefly |

### Bonus

| Feature | Details |
|---|---|
| Double-tap to like | Two taps within 300ms → large heart `heartPop` animation |
| Follow button | Avatar `+` / `✓` toggle with Following badge |
| Long-press to pause | Hold 450ms → dims screen + "PAUSED" label, release resumes |
| Video loading skeleton | Shimmer placeholder on `onWaiting`, hides on `onCanPlay` |
| Responsive design | `max-width: 480px` centered — works on mobile and desktop |
| Dark mode toggle | Settings gear → swaps CSS variables on `:root` live |
| Keyboard navigation | `↑` / `↓` arrows scroll feed · `Space` toggles mute |

---

## Tech Stack

| Choice | Reason |
|---|---|
| **Vite** | Sub-second HMR, preferred per task spec |
| **React 18** | Functional components + hooks only — no class components |
| **CSS Modules** | Scoped styles, zero runtime cost, no extra dependency |
| **Native `<video>`** | Task spec explicitly forbids video player libraries |
| **IntersectionObserver** | Spec-recommended — efficient active video detection |
| **No Redux / Zustand** | `isMuted` is the only shared state — prop drilling is sufficient |

---

## Project Structure
```
src/
├── components/
│   ├── VideoCard.jsx / .module.css     # Core card — video + all overlays
│   ├── ActionBar.jsx / .module.css     # Like, comment, share, bookmark
│   ├── UserInfo.jsx  / .module.css     # Username, caption, follow button
│   ├── MusicDisc.jsx / .module.css     # Spinning disc bottom-right
│   ├── ProgressBar.jsx / .module.css   # Elapsed time bar
│   └── VideoSkeleton.jsx / .module.css # Shimmer loading placeholder
├── hooks/
│   ├── useVideoFeed.js    # IntersectionObserver → activeIndex
│   └── useLongPress.js    # Long-press vs single-tap discrimination
├── data/
│   └── videos.js          # Sample video array + formatCount()
├── styles/
│   └── global.css         # CSS variables, keyframes, reset
├── App.jsx                # Feed, infinite loop, keyboard nav, settings
├── App.module.css
└── main.jsx
```

---

## Architecture Decisions

**Component tree kept shallow**

Exactly three levels deep — `App` → `VideoCard` → leaf components (`ActionBar`, `UserInfo`, `MusicDisc`, `ProgressBar`). Each component has one clear responsibility.

**Logic separated from UI**

`useVideoFeed` and `useLongPress` are pure logic hooks with zero JSX. Components stay focused on rendering — hooks stay focused on behaviour.

**Bottom-up build order**

Components were built leaf-first: `ProgressBar` → `MusicDisc` → `VideoSkeleton` → `ActionBar` → `UserInfo` → `VideoCard` → `App`. Each was fully working before the next one depended on it.

**CSS variables for theming**

All colours live in `:root`. Dark mode swaps three variables on `document.documentElement` — no class toggling, no React context, just one `useEffect`.

**Muted by default**

Videos start muted. Browsers block unmuted autoplay — this is required behaviour, not a limitation. The mute tap zone lets users unmute instantly.

**IntersectionObserver with Map**

Elements are stored in a `Map` (DOM element → index) instead of an array. This eliminates a race condition where refs registered before the observer was ready would never trigger play/pause.

---

## Known Limitations

| Limitation | Reason |
|---|---|
| Starts muted | Browser autoplay policy blocks unmuted autoplay |
| Infinite loop uses scroll jump | True virtual list recycling needs `react-virtual` — out of scope for this prototype |
| Comment / Share are UI only | No backend — counts are static display values |
| Videos stream from CDN | Dependent on Google CDN availability — swap URLs in `data/videos.js` for local files if needed |

---