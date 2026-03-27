import React from "react";
import styles from "./MusicDisc.module.css";

export default function MusicDisc({ avatar, isPlaying }) {
  return (
    <div className={`${styles.disc} ${isPlaying ? styles.spinning : ""}`}>
      <img src={avatar} alt="music disc" className={styles.img} />
      <div className={styles.center} />
    </div>
  );
}