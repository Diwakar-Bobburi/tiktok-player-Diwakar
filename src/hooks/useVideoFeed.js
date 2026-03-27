import { useState, useEffect, useRef, useCallback } from "react";

export function useVideoFeed() {
  const [activeIndex, setActiveIndex] = useState(0);
  const observerRef = useRef(null);
  const elementsRef = useRef(new Map());

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = elementsRef.current.get(entry.target);
            if (idx !== undefined) setActiveIndex(idx);
          }
        });
      },
      { threshold: 0.6 }
    );
    return () => observerRef.current?.disconnect();
  }, []);

  const registerRef = useCallback((el, index) => {
    if (!el) return;
    elementsRef.current.set(el, index);
    observerRef.current?.observe(el);
  }, []);

  return { activeIndex, registerRef };
}