/**
 * useSwipePanel — Virtual 3-panel sliding carousel
 *
 * Architecture:
 *   Container (overflow: hidden, 100% × 100%)
 *     └── Track (width: 300%, display: flex) ← this is trackRef
 *           ├── Panel[prev]    (width: 33.333%)
 *           ├── Panel[current] (width: 33.333%)   ← visible
 *           └── Panel[next]    (width: 33.333%)
 *
 * Normal state:  track.translateX = -containerWidth  (middle panel centered)
 * During drag:   track.translateX = -containerWidth + touchDelta
 * Commit next:   animate to -2×containerWidth → reset → call onNext()
 * Commit prev:   animate to 0 → reset → call onPrev()
 *
 * Why not CSS scroll snap:
 *   With 91–181 snap targets, every snap fires a React state update and
 *   the entire array re-renders. Numbers flicker and momentum overshoots.
 *   With 3 panels we animate one transition per swipe, content updates once.
 */

import { useRef, useCallback } from 'react';

interface Options {
  onNext: () => void;
  onPrev: () => void;
  disabled?: boolean;
  /** Fraction of container width needed to trigger swipe. Default 0.2 */
  threshold?: number;
  /** Minimum velocity in px/ms to trigger swipe. Default 0.3 */
  velocityMin?: number;
  /** Transition duration in ms. Default 260 */
  duration?: number;
}

export function useSwipePanel({
  onNext,
  onPrev,
  disabled = false,
  threshold = 0.2,
  velocityMin = 0.3,
  duration = 260,
}: Options) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Drag state — all in refs to avoid React re-renders during drag
  const startX      = useRef(0);
  const startTime   = useRef(0);
  const isDragging  = useRef(false);
  const animating   = useRef(false);
  const latestDelta = useRef(0);

  // Keep callbacks in refs to avoid stale closures in event handlers
  const onNextRef = useRef(onNext);
  const onPrevRef = useRef(onPrev);
  onNextRef.current = onNext;
  onPrevRef.current = onPrev;

  /** Width of the visible container (= 1 panel width) */
  const getW = () => trackRef.current?.parentElement?.offsetWidth ?? 0;

  /**
   * Reset track to center (no animation).
   * Call this after currentDate changes externally (button press, "Today", etc.)
   */
  const resetPosition = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    el.style.transition = 'none';
    el.style.transform = `translateX(${-getW()}px)`;
  }, []);

  /**
   * Commit a swipe direction (or cancel back to center).
   * Fires onNext/onPrev after the CSS transition finishes.
   */
  const commit = useCallback((dir: 'next' | 'prev' | 'cancel') => {
    const el = trackRef.current;
    if (!el) return;
    animating.current = true;

    const w = getW();
    const target = dir === 'next' ? -2 * w : dir === 'prev' ? 0 : -w;

    el.style.transition = `transform ${duration}ms cubic-bezier(0.25,0.46,0.45,0.94)`;
    el.style.transform = `translateX(${target}px)`;

    const done = () => {
      el.style.transition = 'none';
      if (dir === 'cancel') {
        // Cancel animation already landed at -w — just clean up
        animating.current = false;
      } else {
        // DO NOT reset position here.
        // The track is currently at ±2w (showing the correct new panel).
        // The component uses useLayoutEffect to reset position AFTER React
        // renders new panel content but BEFORE the browser paints — so the
        // user sees the new content slide into center with zero flash.
        animating.current = false;
        if (dir === 'next') onNextRef.current();
        else onPrevRef.current();
      }
    };
    el.addEventListener('transitionend', done, { once: true });
  }, [duration]);

  // ── React touch handlers (attach via JSX props on the container) ──────────
  // Note: these are on the *container* div (overflow:hidden), not the track.
  // We don't call e.preventDefault() here — not needed because overflow:hidden
  // already prevents native scroll on the container.

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || animating.current) return;
    startX.current    = e.touches[0].clientX;
    startTime.current = performance.now();
    latestDelta.current = 0;
    isDragging.current  = true;
    const el = trackRef.current;
    if (el) el.style.transition = 'none';
  }, [disabled]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || animating.current) return;
    const el = trackRef.current;
    if (!el) return;
    const delta = e.touches[0].clientX - startX.current;
    latestDelta.current = delta;
    el.style.transform = `translateX(${-getW() + delta}px)`;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const delta   = latestDelta.current;
    const elapsed = performance.now() - startTime.current;
    const vel     = elapsed > 0 ? Math.abs(delta) / elapsed : 0;
    const w       = getW();

    if      (delta < -w * threshold || (delta < -8 && vel > velocityMin)) commit('next');
    else if (delta >  w * threshold || (delta >  8 && vel > velocityMin)) commit('prev');
    else    commit('cancel');
  }, [commit, threshold, velocityMin]);

  /**
   * Desktop wheel handler — attach manually with { passive: false } so
   * e.preventDefault() actually works (React synthetic events are passive).
   *
   * Usage:
   *   useEffect(() => {
   *     const el = containerRef.current;
   *     if (!el) return;
   *     el.addEventListener('wheel', wheelHandler, { passive: false });
   *     return () => el.removeEventListener('wheel', wheelHandler);
   *   }, [wheelHandler]);
   */
  const wheelHandler = useCallback((e: WheelEvent) => {
    if (disabled || animating.current) return;
    e.preventDefault();
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 10) return;
    if (delta > 0) commit('next');
    else           commit('prev');
  }, [disabled, commit]);

  return {
    trackRef,
    handlers: { onTouchStart, onTouchMove, onTouchEnd },
    wheelHandler,
    resetPosition,
    commit,
  };
}
