import React, { useRef, useState, useEffect, useCallback } from "react";
import ProgressBar from "./ProgressBar.jsx";
import styles from "./VideoCard.module.css";

export default function VideoCard({ video, isActive, isMuted }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [progress, setProgress]       = useState(0);
  const [showHeart, setShowHeart]     = useState(false); 

  const playIconTimerRef  = useRef(null);
  const lastTapRef        = useRef(0);    // stores timestamp of last tap
  const singleTapTimerRef = useRef(null); //  delays single tap to wait for possible 2nd tap

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.currentTime = 0;
      v.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setIsPlaying(false);
      setProgress(0);
    }
  }, [isActive]);

  // unchanged from step 15
  const handleTap = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setIsPlaying(false);
    }
    clearTimeout(playIconTimerRef.current);
    setShowPlayIcon(true);
    playIconTimerRef.current = setTimeout(() => setShowPlayIcon(false), 900);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (v && v.duration) setProgress(v.currentTime / v.duration);
  }, []);

  const handleEnded = useCallback(() => {
    const v = videoRef.current;
    if (v) { v.currentTime = 0; v.play().catch(() => {}); }
  }, []);

  // shows big heart in center for 900ms then hides
  const handleDoubleTap = useCallback(() => {
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 900);
  }, []);

  //  decides if the tap is a single or double tap
  const handleTapOrDouble = useCallback(() => {
    const now = Date.now();
    const gap = now - lastTapRef.current; // ms since last tap
    lastTapRef.current = now;

    if (gap < 300) {
      // Second tap came within 300ms — it's a double tap
      clearTimeout(singleTapTimerRef.current); // cancel the pending single tap
      handleDoubleTap();
    } else {
      // First tap — wait 280ms to see if a second tap comes
      clearTimeout(singleTapTimerRef.current);
      singleTapTimerRef.current = setTimeout(() => {
        handleTap(); // no second tap came, treat as single
      }, 280);
    }
  }, [handleTap, handleDoubleTap]);

  return (
    <div className={styles.card}>
      <video
        ref={videoRef}
        src={video.url}
        className={styles.video}
        playsInline
        muted={isMuted}
        preload="metadata"
        crossOrigin="anonymous"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* CHANGED: onClick now uses handleTapOrDouble instead of handleTap */}
      <div className={styles.tapLayer} onClick={handleTapOrDouble} />

      {showPlayIcon && (
        <div className={styles.playIconWrap}>
          {isPlaying ? (
            <svg viewBox="0 0 24 24" className={styles.playIcon} fill="white">
              <rect x="6" y="4" width="4" height="16"/>
              <rect x="14" y="4" width="4" height="16"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className={styles.playIcon} fill="white">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          )}
        </div>
      )}

      {/* NEW: big heart that appears on double tap */}
      {showHeart && (
        <div className={styles.heartWrap}>
          <svg viewBox="0 0 24 24" className={styles.bigHeart} fill="#fe2c55">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
      )}

      <ProgressBar progress={progress} />
    </div>
  );
}