import React, { useRef, useState, useEffect, useCallback } from "react";
import ProgressBar   from "./ProgressBar.jsx";
import ActionBar     from "./ActionBar.jsx";
import UserInfo      from "./UserInfo.jsx";
import MusicDisc     from "./MusicDisc.jsx";
import VideoSkeleton from "./VideoSkeleton.jsx";
import { useLongPress } from "../hooks/useLongPress.js";
import styles from "./VideoCard.module.css";

export default function VideoCard({ video, isActive, isMuted, onMuteToggle }) {
  const videoRef = useRef(null);

  const [isPlaying,    setIsPlaying]    = useState(false);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [showMuteIcon, setShowMuteIcon] = useState(false);
  const [progress,     setProgress]     = useState(0);
  const [showHeart,    setShowHeart]    = useState(false);
  const [longPressing, setLongPressing] = useState(false);
  const [isLoading,    setIsLoading]    = useState(true);

  const playIconTimerRef  = useRef(null);
  const muteTimerRef      = useRef(null);
  const lastTapRef        = useRef(0);
  const singleTapTimerRef = useRef(null);

  // sync mute state to video element
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  // auto play/pause when active changes
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

  // tap to play/pause + icon flash
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

  // progress bar
  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (v && v.duration) setProgress(v.currentTime / v.duration);
  }, []);

  // loop video when it ends
  const handleEnded = useCallback(() => {
    const v = videoRef.current;
    if (v) { v.currentTime = 0; v.play().catch(() => {}); }
  }, []);

  // double-tap heart animation
  const handleDoubleTap = useCallback(() => {
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 900);
  }, []);

  // discriminate single tap vs double tap
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

  // long press — pause on hold
  const handleLongPressStart = useCallback(() => {
    const v = videoRef.current;
    if (v && !v.paused) {
      v.pause();
      setIsPlaying(false);
      setLongPressing(true);
    }
  }, []);

  // long press — resume on release
const handleLongPressEnd = useCallback(() => {
  const v = videoRef.current;
  if (!v) return;
  setLongPressing(false);        // always clear the label
  if (v.paused) {
    v.play().then(() => setIsPlaying(true)).catch(() => {});
  }
}, []);

 const longPressHandlers = useLongPress(
  handleLongPressStart,  // fires after 450ms hold
  handleTapOrDouble,     // fires on short tap
  handleLongPressEnd,    // fires when finger lifts after long press
  450
);

  // mute tap — flash icon then hide
  const handleMuteTap = useCallback((e) => {
    e.stopPropagation();
    onMuteToggle();
    clearTimeout(muteTimerRef.current);
    setShowMuteIcon(true);
    muteTimerRef.current = setTimeout(() => setShowMuteIcon(false), 900);
  }, [onMuteToggle]);

  // loading skeleton handlers
  const handleCanPlay = useCallback(() => setIsLoading(false), []);
  const handleWaiting = useCallback(() => setIsLoading(true),  []);
  const handleError   = useCallback(() => setIsLoading(false), []);

  return (
    <div className={styles.card}>

      {/* shimmer while buffering — only on active card */}
      {isLoading && isActive && <VideoSkeleton />}

      {/* native HTML5 video — no external libraries */}
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
        onCanPlay={handleCanPlay}
        onWaiting={handleWaiting}
        onError={handleError}
      />

      {/* full-screen tap layer — play/pause + long press */}
      // AFTER — let useLongPress handle everything internally
<div
  className={`${styles.tapLayer} ${longPressing ? styles.dimmed : ""}`}
  {...longPressHandlers}
/>

      {/* invisible mute tap zone — upper center only */}
      <button
        className={styles.muteTapZone}
        onClick={handleMuteTap}
        aria-label={isMuted ? "Unmute" : "Mute"}
      />

      {/* center stack — mute flash on top, play/pause flash below */}
      <div className={styles.centerStack}>

        {/* mute icon — flashes for 900ms then fades */}
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

        {/* play/pause icon — flashes for 900ms then fades */}
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

      {/* double-tap heart — pops and fades */}
      {showHeart && (
        <div className={styles.heartWrap}>
          <svg viewBox="0 0 24 24" className={styles.bigHeart} fill="#fe2c55">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
      )}

      {/* long press paused hint */}
      {longPressing && (
        <div className={styles.longPressHint}>
          <span>Paused</span>
        </div>
      )}

      {/* bottom overlay row — UserInfo left, MusicDisc right */}
      <div className={styles.overlayRow}>
        <div className={styles.userInfoWrap}>
          <UserInfo video={video} />
        </div>
        <div className={styles.discWrap}>
          <MusicDisc avatar={video.user.avatar} isPlaying={isPlaying} />
        </div>
      </div>

      {/* right side action bar */}
      <div className={styles.actionBarWrap}>
        <ActionBar video={video} />
      </div>

      {/* progress bar at the very bottom */}
      <ProgressBar progress={progress} />

    </div>
  );
}