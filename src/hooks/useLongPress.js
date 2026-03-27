import { useRef, useCallback } from "react";

export function useLongPress(onLongPress, onClick, onLongPressEnd, delay = 450) {
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
    if (isLongRef.current) {
      // was a long press — call release handler
      isLongRef.current = false;
      onLongPressEnd?.();
    } else {
      // was a short tap — call click handler
      onClick();
    }
  }, [onClick, onLongPressEnd]);

  const cancel = useCallback(() => {
    clearTimeout(timerRef.current);
    if (isLongRef.current) {
      isLongRef.current = false;
      onLongPressEnd?.();
    }
  }, [onLongPressEnd]);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: stop,
  };
}