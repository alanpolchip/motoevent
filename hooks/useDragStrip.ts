'use client';

import { useRef, useState, useEffect } from 'react';

interface UseDragStripOptions {
  cellsPerView: number;  // 7 para 1W, 1 para 1D
  bufferCells: number;   // buffer a cada lado
  onSnap: (daysDelta: number) => void;
}

export interface DragStripResult {
  containerRef: React.RefObject<HTMLDivElement>;
  stripRef: React.RefObject<HTMLDivElement>;
  /** Estilo ESTÁTICO del strip (layout). El transform se aplica directo al DOM. */
  stripStyle: React.CSSProperties;
  isDragging: boolean;
  pointerHandlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp:   (e: React.PointerEvent) => void;
    onPointerCancel: (e: React.PointerEvent) => void;
  };
  touchHandlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove:  (e: React.TouchEvent) => void;
    onTouchEnd:   (e: React.TouchEvent) => void;
  };
}

const SNAP_SLOW_MS = 180; // swipe lento/corto
const SNAP_FAST_MS = 0;   // swipe rápido: sin animación

export function useDragStrip({ cellsPerView, bufferCells, onSnap }: UseDragStripOptions): DragStripResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef     = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const totalCells   = bufferCells * 2 + cellsPerView;
  // Porcentaje base del strip para mostrar las celdas centrales
  // (el strip mide totalCells/cellsPerView veces el contenedor)
  const basePercent  = -(bufferCells / totalCells) * 100;

  const gesture = useRef<{
    startX:   number;
    lastX:    number;
    lastTime: number;
    velocity: number; // px/ms
  } | null>(null);

  // Aplica transform directamente al DOM, sin pasar por React state
  const applyTransform = (offsetPx: number, durationMs: number) => {
    const el = stripRef.current;
    if (!el) return;
    el.style.transition = durationMs > 0
      ? `transform ${durationMs}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
      : 'none';
    el.style.transform = `translateX(calc(${basePercent}% + ${offsetPx}px))`;
  };

  // Posición inicial al montar
  useEffect(() => {
    applyTransform(0, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Lógica de gesto ────────────────────────────────────────────────────

  const startDrag = (clientX: number) => {
    // Cancelar cualquier transición en curso y partir desde offset 0
    applyTransform(0, 0);
    gesture.current = { startX: clientX, lastX: clientX, lastTime: Date.now(), velocity: 0 };
    setIsDragging(true);
  };

  const moveDrag = (clientX: number) => {
    if (!gesture.current) return;
    const now = Date.now();
    const dt  = Math.max(1, now - gesture.current.lastTime);
    gesture.current.velocity = (clientX - gesture.current.lastX) / dt;
    gesture.current.lastX    = clientX;
    gesture.current.lastTime = now;
    applyTransform(clientX - gesture.current.startX, 0);
  };

  const endDrag = (clientX: number) => {
    if (!gesture.current) return;
    setIsDragging(false);

    const container = containerRef.current;
    if (!container) { gesture.current = null; return; }

    const cellWidth  = container.offsetWidth / cellsPerView;
    const rawDelta   = clientX - gesture.current.startX;
    const velocity   = gesture.current.velocity;    // px/ms
    const momentum   = velocity * 80;               // momentum reducido
    const totalDelta = rawDelta + momentum;
    const cellsMoved = Math.round(totalDelta / cellWidth);
    const snapTarget = cellsMoved * cellWidth;

    // Swipe rápido (|velocity| > 0.4 px/ms) → sin animación, instantáneo
    // Swipe lento → animación corta de 180ms
    const isFast    = Math.abs(velocity) > 0.4 && cellsMoved !== 0;
    const snapMs    = isFast ? SNAP_FAST_MS : SNAP_SLOW_MS;

    // Animar (o no) hasta el target
    applyTransform(snapTarget, snapMs);

    gesture.current = null;

    // Tras la animación: reset a centro + actualizar fecha
    // applyTransform(0,0) ocurre antes del re-render de React → sin salto visual
    const finish = () => {
      applyTransform(0, 0);
      if (cellsMoved !== 0) onSnap(-cellsMoved);
    };

    if (snapMs === 0) {
      // Instantáneo: resetear en el siguiente frame para que el navegador pinte el snap
      requestAnimationFrame(finish);
    } else {
      setTimeout(finish, snapMs + 16);
    }
  };

  const cancelDrag = () => {
    if (!gesture.current) return;
    applyTransform(0, SNAP_SLOW_MS);
    gesture.current = null;
    setIsDragging(false);
  };

  // ─── Handlers ──────────────────────────────────────────────────────────

  const pointerHandlers = {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.pointerType === 'touch') return;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      startDrag(e.clientX);
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (!gesture.current || e.pointerType === 'touch') return;
      moveDrag(e.clientX);
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (e.pointerType === 'touch') return;
      endDrag(e.clientX);
    },
    onPointerCancel: (e: React.PointerEvent) => {
      if (e.pointerType === 'touch') return;
      cancelDrag();
    },
  };

  const touchHandlers = {
    onTouchStart: (e: React.TouchEvent) => {
      startDrag(e.touches[0].clientX);
    },
    onTouchMove: (e: React.TouchEvent) => {
      moveDrag(e.touches[0].clientX);
    },
    onTouchEnd: (e: React.TouchEvent) => {
      endDrag(e.changedTouches[0].clientX);
    },
  };

  // ─── Strip style (solo layout, SIN transform — se aplica vía DOM) ──────
  const stripStyle: React.CSSProperties = {
    display:     'flex',
    width:       `${(totalCells / cellsPerView) * 100}%`,
    height:      '100%',
    userSelect:  'none',
    flexShrink:  0,
  };

  return { containerRef, stripRef, stripStyle, isDragging, pointerHandlers, touchHandlers };
}
