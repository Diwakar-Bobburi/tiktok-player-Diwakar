import { useState, useEffect, useRef, useCallback } from "react";

export function useVideoFeed() {
  const [activeIndex, setActiveIndex] = useState(0);
  const observerRef = useRef(null);
  const elementsRef = useRef(new Map()); // FIX: Map instead of array

  useEffect(() => {
    // create observer once on mount
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // look up index from Map using the DOM element as key
            const idx = elementsRef.current.get(entry.target);
            if (idx !== undefined) setActiveIndex(idx);
          }
        });
      },
      { threshold: 0.6 }
    );

    // cleanup on unmount
    return () => observerRef.current?.disconnect();
  }, []); // empty array — runs once only

  const registerRef = useCallback((el, index) => {
    if (!el) return;

    // store element → index mapping
    elementsRef.current.set(el, index);

    // observe immediately — no waiting for array to fill
    if (observerRef.current) {
      observerRef.current.observe(el);
    }
  }, []);

  return { activeIndex, registerRef };
}