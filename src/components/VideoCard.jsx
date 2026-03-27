import React, { useRef, useState, useEffect, useCallback } from "react";
import ProgressBar from "./ProgressBar.jsx";
import { useLongPress } from "../hooks/useLongPress.js"; // NEW
import styles from "./VideoCard.module.css";

export default function VideoCard({ video, isActive, isMuted }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [progress, setProgress]         = useState(0);
  const [showHeart, setShowHeart]       = useState(false);
  const [longPressing, setLongPressing] = useState(false); // NEW

  const playIconTimerRef  = useRef(null);
  const lastTapRef        = useRef(0);
  const singleTapTimerRef = useRef(null);

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

  const handleDoubleTap = useCallback(() => {
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 900);
  }, []);

  const handleTapOrDouble = useCallback(() => {
    const now = Date.now();
    const gap = now - lastTapRef.current;
    lastTapRef.current = now;
    if (gap < 300) {
      clearTimeout(singleTapTimerRef.current);
      handleDoubleTap();
    } else {
      clearTimeout(singleTapTimerRef.current);
      singleTapTimerRef.current = setTimeout(() => {
        handleTap();
      }, 280);
    }
  }, [handleTap, handleDoubleTap]);

  // NEW: fires after 450ms hold — pauses video and shows dim
  const handleLongPressStart = useCallback(() => {
    const v = videoRef.current;
    if (v && !v.paused) {
      v.pause();
      setIsPlaying(false);
      setLongPressing(true);
    }
  }, []);

  // NEW: fires when finger lifts — resumes video
  const handleLongPressEnd = useCallback(() => {
    const v = videoRef.current;
    if (v && longPressing) {
      v.play().then(() => setIsPlaying(true)).catch(() => {});
      setLongPressing(false);
    }
  }, [longPressing]);

  // NEW: wire both handlers into useLongPress
  // handleTapOrDouble is passed as the "onClick" — fires on short press
  const longPressHandlers = useLongPress(
    handleLongPressStart,  // fires after 450ms hold
    handleTapOrDouble,     // fires on short tap
    450                    // hold duration in ms
  );

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

      {/* CHANGED: removed onClick, now uses spread of longPressHandlers */}
      {/* also adds dimmed class when long pressing */}
      <div
        className={`${styles.tapLayer} ${longPressing ? styles.dimmed : ""}`}
        {...longPressHandlers}
      />

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

      {showHeart && (
        <div className={styles.heartWrap}>
          <svg viewBox="0 0 24 24" className={styles.bigHeart} fill="#fe2c55">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
      )}

      {/* NEW: shows "Paused" label while holding */}
      {longPressing && (
        <div className={styles.longPressHint}>
          <span>Paused</span>
        </div>
      )}

      <ProgressBar progress={progress} />
    </div>
  );
}