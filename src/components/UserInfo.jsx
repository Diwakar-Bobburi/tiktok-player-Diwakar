import React, { useState } from "react";
import styles from "./UserInfo.module.css";

export default function UserInfo({ video }) {
  const [expanded, setExpanded] = useState(false);
  const [following, setFollowing] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.userRow}>
        <div className={styles.avatarWrap}>
          <img src={video.user.avatar} alt={video.user.name} className={styles.avatar} />
          <button
            className={`${styles.followBtn} ${following ? styles.following : ""}`}
            onClick={() => setFollowing(p => !p)}
          >
            {following ? "✓" : "+"}
          </button>
        </div>
        <span className={styles.username}>@{video.user.name}</span>
        {following && <span className={styles.followingBadge}>Following</span>}
      </div>

      <p
        className={`${styles.description} ${expanded ? styles.expanded : ""}`}
        onClick={() => setExpanded(p => !p)}
      >
        {video.description}
        {!expanded && <span className={styles.more}> more</span>}
      </p>

      <div className={styles.musicRow}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="white">
          <path d="M9 18V5l12-2v13"/>
          <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
        </svg>
        <span className={styles.musicText}>{video.music}</span>
      </div>
    </div>
  );
}