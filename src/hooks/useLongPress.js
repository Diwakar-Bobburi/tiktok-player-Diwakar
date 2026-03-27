import { useRef, useCallback } from "react";

export function useLongPress(onLongPress, onClick, delay = 450) {
  const timerRef = useRef(null);
  const isLongRef = useRef(false);

  const start = useCallback(() => {
    isLongRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongRef.current = true;
      onLongPress();
    }, delay);
  }, [onLongPress, delay]);

  const stop = useCallback(() => {
    clearTimeout(timerRef.current);
    if (!isLongRef.current) onClick();
  }, [onClick]);

  const cancel = useCallback(() => {
    clearTimeout(timerRef.current);
    isLongRef.current = false;
  }, []);

  return {
    onMouseDown: start, onMouseUp: stop, onMouseLeave: cancel,
    onTouchStart: start, onTouchEnd: stop,
  };
}