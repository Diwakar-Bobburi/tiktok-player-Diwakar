import React from "react";
import styles from "./VideoSkeleton.module.css";

export default function VideoSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.shimmer} />
      <div className={styles.fakeUser}>
        <div className={`${styles.block} ${styles.avatar}`} />
        <div className={styles.lines}>
          <div className={`${styles.block} ${styles.name}`} />
          <div className={`${styles.block} ${styles.desc}`} />
        </div>
      </div>
      <div className={styles.fakeActions}>
        {[1,2,3,4].map(i => (
          <div key={i} className={`${styles.block} ${styles.icon}`} />
        ))}
      </div>
    </div>
  );
}