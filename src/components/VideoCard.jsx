import React, { useRef, useState, useEffect, useCallback } from "react";
import ProgressBar    from "./ProgressBar.jsx";
import ActionBar      from "./ActionBar.jsx";      // NEW
import UserInfo       from "./UserInfo.jsx";        // NEW
import MusicDisc      from "./MusicDisc.jsx";       // NEW
import VideoSkeleton  from "./VideoSkeleton.jsx";   // NEW
import { useLongPress } from "../hooks/useLongPress.js";
import styles from "./VideoCard.module.css";

export default function VideoCard({ video, isActive, isMuted, onMuteToggle }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [showMuteIcon, setShowMuteIcon] = useState(false);
  const [progress, setProgress]         = useState(0);
  const [showHeart, setShowHeart]       = useState(false);
  const [longPressing, setLongPressing] = useState(false);
  const [isLoading, setIsLoading]       = useState(true); // NEW

  const playIconTimerRef  = useRef(null);
  const muteTimerRef      = useRef(null);
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
      singleTapTimerRef.current = setTimeout(() => handleTap(), 280);
    }
  }, [handleTap, handleDoubleTap]);

  const handleLongPressStart = useCallback(() => {
    const v = videoRef.current;
    if (v && !v.paused) {
      v.pause();
      setIsPlaying(false);
      setLongPressing(true);
    }
  }, []);

  const handleLongPressEnd = useCallback(() => {
    const v = videoRef.current;
    if (v && longPressing) {
      v.play().then(() => setIsPlaying(true)).catch(() => {});
      setLongPressing(false);
    }
  }, [longPressing]);

  const longPressHandlers = useLongPress(
    handleLongPressStart,
    handleTapOrDouble,
    450
  );

  const handleMuteTap = useCallback((e) => {
    e.stopPropagation();
    onMuteToggle();
    clearTimeout(muteTimerRef.current);
    setShowMuteIcon(true);
    muteTimerRef.current = setTimeout(() => setShowMuteIcon(false), 900);
  }, [onMuteToggle]);

  // NEW: loading state handlers
  const handleCanPlay = useCallback(() => setIsLoading(false), []);
  const handleWaiting = useCallback(() => setIsLoading(true),  []);
  const handleError   = useCallback(() => setIsLoading(false), []);

  return (
    <div className={styles.card}>

      {/* NEW: shimmer shown while video is buffering */}
      {isLoading && isActive && <VideoSkeleton />}

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
        onCanPlay={handleCanPlay}  {/* NEW */}
        onWaiting={handleWaiting}  {/* NEW */}
        onError={handleError}      {/* NEW */}
      />

      <div
        className={`${styles.tapLayer} ${longPressing ? styles.dimmed : ""}`}
        {...longPressHandlers}
        onMouseUp={handleLongPressEnd}
        onTouchEnd={handleLongPressEnd}
      />

      <button
        className={styles.muteTapZone}
        onClick={handleMuteTap}
        aria-label={isMuted ? "Unmute" : "Mute"}
      />

      <div className={styles.centerStack}>
        {showMuteIcon && (
          <div className={styles.muteIconWrap}>
            {isMuted ? (
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            )}
          </div>
        )}

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

      {showHeart && (
        <div className={styles.heartWrap}>
          <svg viewBox="0 0 24 24" className={styles.bigHeart} fill="#fe2c55">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
      )}

      {longPressing && (
        <div className={styles.longPressHint}>
          <span>Paused</span>
        </div>
      )}

      {/* NEW: bottom overlay row — UserInfo left, MusicDisc right */}
      <div className={styles.overlayRow}>
        <div className={styles.userInfoWrap}>
          <UserInfo video={video} />
        </div>
        <div className={styles.discWrap}>
          <MusicDisc avatar={video.user.avatar} isPlaying={isPlaying} />
        </div>
      </div>

      {/* NEW: right side action bar */}
      <div className={styles.actionBarWrap}>
        <ActionBar video={video} />
      </div>

      <ProgressBar progress={progress} />
    </div>
  );
}