import React, { useState, useRef, useEffect, useCallback } from "react"; // CHANGED: added useCallback
import VideoCard from "./components/VideoCard.jsx";
import { useVideoFeed } from "./hooks/useVideoFeed.js";
import { videos } from "./data/videos.js";
import styles from "./App.module.css";

export default function App() {
  const [isMuted, setIsMuted]           = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode]         = useState(true);
  const feedRef = useRef(null);
  const { activeIndex, registerRef } = useVideoFeed();

  // infinite loop
  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;
    const handleScroll = () => {
      const atBottom =
        feed.scrollTop + feed.clientHeight >= feed.scrollHeight - 10;
      if (atBottom && activeIndex === videos.length - 1) {
        feed.scrollTo({ top: 0, behavior: "instant" });
      }
    };
    feed.addEventListener("scroll", handleScroll, { passive: true });
    return () => feed.removeEventListener("scroll", handleScroll);
  }, [activeIndex]);

  // dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.style.setProperty("--bg",      "#000");
      root.style.setProperty("--surface", "#111");
      root.style.setProperty("--text",    "#fff");
    } else {
      root.style.setProperty("--bg",      "#f0f0f0");
      root.style.setProperty("--surface", "#e0e0e0");
      root.style.setProperty("--text",    "#111");
    }
  }, [darkMode]);

  // NEW: keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      const feed = feedRef.current;
      if (!feed) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();

        if (activeIndex === videos.length - 1) {
          // on last video → wrap to first
          feed.scrollTo({ top: 0, behavior: "instant" });
        } else {
          // scroll to next video
          feed.children[activeIndex + 1]?.scrollIntoView({ behavior: "smooth" });
        }

      } else if (e.key === "ArrowUp") {
        e.preventDefault();

        if (activeIndex === 0) {
          // already on first video → do nothing
          return;
        }
        // scroll to previous video
        feed.children[activeIndex - 1]?.scrollIntoView({ behavior: "smooth" });

      } else if (e.key === " ") {
        // space bar → toggle mute
        e.preventDefault();
        setIsMuted(p => !p);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex]); // re-runs when activeIndex changes so it always has latest index

  return (
    <div className={styles.app}>

      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.tabs}>
          <span className={styles.tab}>Following</span>
          <span className={`${styles.tab} ${styles.activeTab}`}>For You</span>
          <span className={styles.tab}>Live</span>
        </div>
        <button
          className={styles.settingsBtn}
          onClick={() => setShowSettings(p => !p)}
          aria-label="Settings"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </header>

      {/* ── Settings dropdown ── */}
      {showSettings && (
        <div className={styles.settingsMenu}>
          <div className={styles.settingsItem}>
            <span>Dark Mode</span>
            <button
              className={`${styles.toggle} ${darkMode ? styles.toggleOn : ""}`}
              onClick={() => setDarkMode(p => !p)}
              aria-label="Toggle dark mode"
            >
              <span className={styles.toggleThumb} />
            </button>
          </div>
          <div className={styles.settingsItem}>
            <span>Sound</span>
            <button
              className={`${styles.toggle} ${!isMuted ? styles.toggleOn : ""}`}
              onClick={() => setIsMuted(p => !p)}
              aria-label="Toggle sound"
            >
              <span className={styles.toggleThumb} />
            </button>
          </div>

          {/* NEW: keyboard hint row */}
          <div className={styles.settingsHint}>
            <p>⌨️ ↑ ↓ navigate &nbsp;·&nbsp; Space mute</p>
          </div>

        </div>
      )}

      {/* ── Feed ── */}
      <main ref={feedRef} className={styles.feed}>
        {videos.map((video, index) => (
          <div
            key={video.id}
            ref={(el) => registerRef(el, index)}
            className={styles.feedItem}
          >
            <VideoCard
              video={video}
              isActive={activeIndex === index}
              isMuted={isMuted}
              onMuteToggle={() => setIsMuted(p => !p)}
            />
          </div>
        ))}
      </main>

      {/* ── Bottom nav ── */}
      <nav className={styles.bottomNav}>
        <button className={`${styles.navBtn} ${styles.navActive}`} aria-label="Home">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
          <span>Home</span>
        </button>

        <button className={styles.navBtn} aria-label="Discover">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span>Discover</span>
        </button>

        <button className={styles.plusBtn} aria-label="Create">
          <span className={styles.plusInner}>+</span>
        </button>

        <button className={styles.navBtn} aria-label="Inbox">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span>Inbox</span>
        </button>

        <button className={styles.navBtn} aria-label="Profile">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>Profile</span>
        </button>
      </nav>

    </div>
  );
}