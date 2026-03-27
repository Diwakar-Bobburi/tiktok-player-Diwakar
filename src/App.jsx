import React, { useState, useRef, useEffect } from "react";
import VideoCard from "./components/VideoCard.jsx";
import { useVideoFeed } from "./hooks/useVideoFeed.js";
import { videos } from "./data/videos.js";
import styles from "./App.module.css";

export default function App() {
  const [isMuted, setIsMuted] = useState(true);
  const feedRef = useRef(null);
  const { activeIndex, registerRef } = useVideoFeed();

  // infinite loop — when user scrolls past last video, jump to first
  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;

    const handleScroll = () => {
      const atBottom =
        feed.scrollTop + feed.clientHeight >= feed.scrollHeight - 10;

      if (atBottom && activeIndex === videos.length - 1) {
        feed.scrollTo({ top: 0, behavior: "instant" });
      }
    };

    feed.addEventListener("scroll", handleScroll, { passive: true });
    return () => feed.removeEventListener("scroll", handleScroll);
  }, [activeIndex]);

  return (
    <div className={styles.app}>
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