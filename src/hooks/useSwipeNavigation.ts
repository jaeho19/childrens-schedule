"use client";

import { useEffect, type RefObject } from "react";

interface UseSwipeNavigationOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
  enabled?: boolean;
}

export function useSwipeNavigation(
  ref: RefObject<HTMLElement | null>,
  options: UseSwipeNavigationOptions
) {
  const { onSwipeLeft, onSwipeRight, threshold = 50, enabled = true } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    let startX = 0;
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const diffX = e.changedTouches[0].clientX - startX;
      const diffY = e.changedTouches[0].clientY - startY;

      // 수평 스와이프만 감지 (수직 스크롤과 구분)
      if (Math.abs(diffX) > threshold && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
        if (diffX > 0) onSwipeRight();
        else onSwipeLeft();
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [ref, onSwipeLeft, onSwipeRight, threshold, enabled]);
}
