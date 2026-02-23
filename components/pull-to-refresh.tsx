"use client";

import { useState, useRef, useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (window.scrollY === 0 && !isRefreshing) {
      const currentY = e.touches[0].clientY;
      const distance = currentY - startY.current;
      if (distance > 0) {
        setPullDistance(Math.min(distance, 100));
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 60 && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
    setPullDistance(0);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchmove", handleTouchMove);
      container.addEventListener("touchend", handleTouchEnd);
    }
    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [pullDistance, isRefreshing]);

  return (
    <div ref={containerRef} className="relative">
      {pullDistance > 0 && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all"
          style={{ height: `${pullDistance}px` }}
        >
          <RefreshCw
            className={`h-6 w-6 text-primary ${
              isRefreshing ? "animate-spin" : ""
            }`}
            style={{
              transform: `rotate(${pullDistance * 3.6}deg)`,
            }}
          />
        </div>
      )}
      <div style={{ transform: `translateY(${pullDistance}px)` }}>
        {children}
      </div>
    </div>
  );
}
