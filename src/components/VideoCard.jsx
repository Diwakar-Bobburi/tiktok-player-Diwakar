import React, { useRef, useState, useEffect, useCallback } from "react";
import ProgressBar from "./ProgressBar.jsx"; 
import styles from "./VideoCard.module.css";

export default function VideoCard({ video, isActive, isMuted }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [progress, setProgress] = useState(0); 

  const playIconTimerRef = useRef(null);

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
      setProgress(0); // NEW — reset bar when video leaves view
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

  // NEW: fires every ~250ms while video plays, updates progress 0→1
  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (v && v.duration) {
      setProgress(v.currentTime / v.duration);
    }
  }, []);

  // NEW: when video ends, loop it back to start
  const handleEnded = useCallback(() => {
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  }, []);

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
        onTimeUpdate={handleTimeUpdate} {/* NEW */}
        onEnded={handleEnded}           {/* NEW */}
      />

      <div className={styles.tapLayer} onClick={handleTap} />

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

      {/* NEW: progress bar sits at the very bottom of the card */}
      <ProgressBar progress={progress} />
    </div>
  );
}