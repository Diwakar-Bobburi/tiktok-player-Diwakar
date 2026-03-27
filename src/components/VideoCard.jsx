import React, { useRef, useState, useEffect, useCallback } from "react";
import styles from "./VideoCard.module.css";

export default function VideoCard({ video, isActive, isMuted }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // --- NEW: state and ref for the play/pause icon flash ---
  const [showPlayIcon, setShowPlayIcon] = useState(false);
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
    }
  }, [isActive]);

  // --- NEW: tap handler ---
  const handleTap = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      v.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setIsPlaying(false);
    }

    // show the icon, then hide it after 900ms
    clearTimeout(playIconTimerRef.current);
    setShowPlayIcon(true);
    playIconTimerRef.current = setTimeout(() => setShowPlayIcon(false), 900);
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
      />

      {/* NEW: invisible layer that catches taps */}
      <div className={styles.tapLayer} onClick={handleTap} />

      {/* NEW: play/pause icon that flashes and fades */}
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

    </div>
  );
}