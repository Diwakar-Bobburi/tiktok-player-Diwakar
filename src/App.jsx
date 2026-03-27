import React, { useState, useRef, useEffect } from "react";
import VideoCard from "./components/VideoCard.jsx";
import { useVideoFeed } from "./hooks/useVideoFeed.js";
import { videos } from "./data/videos.js";
import styles from "./App.module.css";

export default function App() {
  const [isMuted, setIsMuted] = useState(true);
  const [showSettings, setShowSettings] = useState(false); // NEW
  const feedRef = useRef(null);
  const { activeIndex, registerRef } = useVideoFeed();

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

  return (
    <div className={styles.app}>

      {/* ── NEW: Header ── */}
      <header className={styles.header}>
        {/* tabs */}
        <div className={styles.tabs}>
          <span className={styles.tab}>Following</span>
          <span className={`${styles.tab} ${styles.activeTab}`}>For You</span>
          <span className={styles.tab}>Live</span>
        </div>

        {/* settings gear button */}
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

      {/* ── NEW: Settings dropdown ── */}
      {showSettings && (
        <div className={styles.settingsMenu}>
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
        </div>
      )}

      {/* ── Feed (unchanged) ── */}
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

      {/* ── NEW: Bottom nav ── */}
      <nav className={styles.bottomNav}>

        {/* Home */}
        <button className={`${styles.navBtn} ${styles.navActive}`} aria-label="Home">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
          <span>Home</span>
        </button>

        {/* Discover */}
        <button className={styles.navBtn} aria-label="Discover">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span>Discover</span>
        </button>

        {/* Plus button */}
        <button className={styles.plusBtn} aria-label="Create">
          <span className={styles.plusInner}>+</span>
        </button>

        {/* Inbox */}
        <button className={styles.navBtn} aria-label="Inbox">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span>Inbox</span>
        </button>

        {/* Profile */}
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