import React from "react";
import styles from "./ProgressBar.module.css";

export default function ProgressBar({ progress }) {
  const pct = Math.min(Math.max(progress * 100, 0), 100);
  return (
    <div className={styles.track}>
      <div className={styles.fill} style={{ width: `${pct}%` }} />
    </div>
  );
}