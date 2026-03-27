import React, { useState } from "react";
import { formatCount } from "../data/videos.js";
import styles from "./ActionBar.module.css";

export default function ActionBar({ video }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes);
  const [bookmarked, setBookmarked] = useState(false);
  const [bouncing, setBouncing] = useState(false);

  const handleLike = () => {
    setLiked(prev => {
      setLikeCount(c => prev ? c - 1 : c + 1);
      return !prev;
    });
    setBouncing(true);
    setTimeout(() => setBouncing(false), 500);
  };

  return (
    <div className={styles.bar}>
      <button
        className={`${styles.btn} ${liked ? styles.liked : ""} ${bouncing ? styles.bounce : ""}`}
        onClick={handleLike} aria-label="Like"
      >
        <svg viewBox="0 0 24 24" className={styles.icon}
          fill={liked ? "#fe2c55" : "none"}
          stroke={liked ? "#fe2c55" : "white"} strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <span className={styles.count}>{formatCount(likeCount)}</span>
      </button>

      <button className={styles.btn} aria-label="Comment">
        <svg viewBox="0 0 24 24" className={styles.icon} fill="none" stroke="white" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span className={styles.count}>{formatCount(video.comments)}</span>
      </button>

      <button className={styles.btn} aria-label="Share">
        <svg viewBox="0 0 24 24" className={styles.icon} fill="none" stroke="white" strokeWidth="2">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        <span className={styles.count}>{formatCount(video.shares)}</span>
      </button>

      <button
        className={`${styles.btn} ${bookmarked ? styles.bookmarked : ""}`}
        onClick={() => setBookmarked(p => !p)} aria-label="Save"
      >
        <svg viewBox="0 0 24 24" className={styles.icon}
          fill={bookmarked ? "#25f4ee" : "none"}
          stroke={bookmarked ? "#25f4ee" : "white"} strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
    </div>
  );
}