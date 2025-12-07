import { useEffect, useRef } from "react";

type DuringPayload = {
  deltaX: number;
  deltaY: number;
  originalEvent: WheelEvent;
};

type Options = {
  /** ms to wait after last wheel event to consider 'stopped' */
  endDelay?: number;
  /** called once when scroll starts */
  onStart?: () => void;
  /** called continuously while wheel events occur (throttled with rAF) */
  onDuring?: (p: DuringPayload) => void;
  /** called once when wheel events have stopped for endDelay */
  onEnd?: () => void;
  /** attach listener to this element; defaults to window */
  target?: HTMLElement | Document | Window | null;
};

export function useWheelScrollState({
  endDelay = 150,
  onStart,
  onDuring,
  onEnd,
  target = typeof window !== "undefined" ? window : null,
}: Options) {
  const scrollingRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastEventRef = useRef<WheelEvent | null>(null);

  useEffect(() => {
    if (!target) return;

    const el: EventTarget = target as unknown as EventTarget;

    const clearEndTimer = () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const cancelRaf = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const runDuring = () => {
      const ev = lastEventRef.current;
      if (!ev) return;
      onDuring?.({ deltaX: ev.deltaX, deltaY: ev.deltaY, originalEvent: ev });
      // schedule next rAF if events keep coming (we re-schedule only from wheel handler)
      rafRef.current = null;
    };

    const handleWheel = (ev: WheelEvent) => {
      lastEventRef.current = ev;

      // If first wheel after idle
      if (!scrollingRef.current) {
        scrollingRef.current = true;
        onStart?.();
      }

      // schedule a rAF-run of onDuring (one per frame max)
      if (!rafRef.current && onDuring) {
        rafRef.current = requestAnimationFrame(runDuring);
      }

      // reset end timer
      clearEndTimer();
      timeoutRef.current = window.setTimeout(() => {
        // stopped
        cancelRaf();
        lastEventRef.current = null;
        scrollingRef.current = false;
        timeoutRef.current = null;
        onEnd?.();
      }, endDelay);
    };

    // Prefer passive: true for performance (we are not calling preventDefault)
    el.addEventListener("wheel", handleWheel as EventListener, { passive: true });

    return () => {
      el.removeEventListener("wheel", handleWheel as EventListener);
      clearEndTimer();
      cancelRaf();
      scrollingRef.current = false;
      lastEventRef.current = null;
    };
  }, [endDelay, onStart, onDuring, onEnd, target]);
}
