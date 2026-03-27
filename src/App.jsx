import React, { useState, useRef } from "react";
import VideoCard from "./components/VideoCard.jsx";
import { useVideoFeed } from "./hooks/useVideoFeed.js";
import { videos } from "./data/videos.js";
import styles from "./App.module.css";

export default function App() {
  const [isMuted, setIsMuted] = useState(true); // start muted — browser autoplay requires it
  const feedRef = useRef(null);
  const { activeIndex, registerRef } = useVideoFeed();

  return (
    <div className={styles.app}>

      {/* vertical scroll-snap feed */}
      <main ref={feedRef} className={styles.feed}>
        {videos.map((video, index) => (
          <div
            key={video.id}
            ref={(el) => registerRef(el, index)}
            className={styles.feedItem}
          >
            <VideoCard
              video={video}
              isActive={activeIndex === index}
              isMuted={isMuted}
              onMuteToggle={() => setIsMuted(p => !p)}
            />
          </div>
        ))}
      </main>

    </div>
  );
}