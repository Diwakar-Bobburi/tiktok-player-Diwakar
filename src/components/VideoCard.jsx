import React, { useRef, useState } from "react";
import styles from "./VideoCard.module.css";

export default function VideoCard({ video, isActive, isMuted }) {
  const videoRef = useRef(null);

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
      />
    </div>
  );
}