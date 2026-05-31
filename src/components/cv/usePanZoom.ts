import { useCallback, useEffect, useRef, useState } from "react";

const ZOOM_MIN = 0.25;
const ZOOM_MAX = 2;

export type Pan = { x: number; y: number };

type ViewportState = { pan: Pan; zoom: number };

function clampZoom(z: number) {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
}

function isEditableTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

export function usePanZoom(initialZoom = 0.62) {
  const [zoom, setZoom] = useState(initialZoom);
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 });
  const [spaceHeld, setSpaceHeld] = useState(false);
  const [isPanning, setIsPanning] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<ViewportState>({ pan: { x: 0, y: 0 }, zoom: initialZoom });
  const hasInitialFit = useRef(false);
  const panSession = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    panX: number;
    panY: number;
  } | null>(null);
  const syncRaf = useRef<number | null>(null);

  const applyTransform = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const { pan: p, zoom: z } = stateRef.current;
    el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) scale(${z})`;
  }, []);

  const commitState = useCallback(() => {
    const { pan: p, zoom: z } = stateRef.current;
    setPan({ ...p });
    setZoom(z);
  }, []);

  const scheduleCommit = useCallback(() => {
    if (syncRaf.current != null) return;
    syncRaf.current = requestAnimationFrame(() => {
      syncRaf.current = null;
      commitState();
    });
  }, [commitState]);

  const setViewportState = useCallback(
    (next: Partial<ViewportState>, commit = true) => {
      if (next.pan) stateRef.current.pan = { ...next.pan };
      if (next.zoom != null) stateRef.current.zoom = next.zoom;
      applyTransform();
      if (commit) scheduleCommit();
    },
    [applyTransform, scheduleCommit],
  );

  const getContentSize = useCallback(() => {
    const el = contentRef.current;
    if (!el) return { width: 0, height: 0 };
    return { width: el.offsetWidth, height: el.offsetHeight };
  }, []);

  const fitToView = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const { width, height } = getContentSize();
    if (!width || !height) return;

    const padding = 48;
    const availableW = viewport.clientWidth - padding;
    const availableH = viewport.clientHeight - padding;
    const nextZoom = clampZoom(Math.min(availableW / width, availableH / height));
    const scaledW = width * nextZoom;
    const scaledH = height * nextZoom;

    setViewportState(
      {
        zoom: nextZoom,
        pan: {
          x: (viewport.clientWidth - scaledW) / 2,
          y: (viewport.clientHeight - scaledH) / 2,
        },
      },
      true,
    );
    hasInitialFit.current = true;
  }, [getContentSize, setViewportState]);

  const zoomAtPoint = useCallback(
    (clientX: number, clientY: number, factor: number) => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      const rect = viewport.getBoundingClientRect();
      const mx = clientX - rect.left;
      const my = clientY - rect.top;
      const { pan: prevPan, zoom: prevZoom } = stateRef.current;
      const nextZoom = clampZoom(prevZoom * factor);
      const ratio = nextZoom / prevZoom;

      setViewportState({
        zoom: nextZoom,
        pan: {
          x: mx - (mx - prevPan.x) * ratio,
          y: my - (my - prevPan.y) * ratio,
        },
      });
    },
    [setViewportState],
  );

  const zoomTowardCenter = useCallback(
    (factor: number) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const rect = viewport.getBoundingClientRect();
      zoomAtPoint(rect.left + rect.width / 2, rect.top + rect.height / 2, factor);
    },
    [zoomAtPoint],
  );

  const zoomIn = useCallback(() => zoomTowardCenter(1.1), [zoomTowardCenter]);
  const zoomOut = useCallback(() => zoomTowardCenter(1 / 1.1), [zoomTowardCenter]);

  const panBy = useCallback(
    (dx: number, dy: number) => {
      const { pan: p, zoom: z } = stateRef.current;
      setViewportState({ pan: { x: p.x - dx, y: p.y - dy }, zoom: z });
    },
    [setViewportState],
  );

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button > 2) return;
    e.preventDefault();
    viewportRef.current?.setPointerCapture(e.pointerId);
    setIsPanning(true);
    panSession.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      panX: stateRef.current.pan.x,
      panY: stateRef.current.pan.y,
    };
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const session = panSession.current;
      if (!session || session.pointerId !== e.pointerId) return;
      const { zoom: z } = stateRef.current;
      setViewportState(
        {
          pan: {
            x: session.panX + (e.clientX - session.startX),
            y: session.panY + (e.clientY - session.startY),
          },
          zoom: z,
        },
        false,
      );
    },
    [setViewportState],
  );

  const endPan = useCallback((e: React.PointerEvent) => {
    const session = panSession.current;
    if (!session || session.pointerId !== e.pointerId) return;
    panSession.current = null;
    setIsPanning(false);
    viewportRef.current?.releasePointerCapture(e.pointerId);
    commitState();
  }, [commitState]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat || isEditableTarget(e.target)) return;
      e.preventDefault();
      setSpaceHeld(true);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") setSpaceHeld(false);
    };
    const onBlur = () => setSpaceHeld(false);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      const zoomGesture = e.ctrlKey || e.metaKey;
      if (zoomGesture) {
        const factor = Math.exp(-e.deltaY * 0.01);
        zoomAtPoint(e.clientX, e.clientY, factor);
        return;
      }

      let dx = e.deltaX;
      let dy = e.deltaY;
      if (e.shiftKey && dx === 0) {
        dx = dy;
        dy = 0;
      }
      panBy(dx, dy);
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [panBy, zoomAtPoint]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;

    const observer = new ResizeObserver(() => {
      if (!hasInitialFit.current) fitToView();
    });
    observer.observe(viewport);
    observer.observe(content);

    const raf = requestAnimationFrame(fitToView);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [fitToView]);

  useEffect(() => {
    applyTransform();
  }, [applyTransform]);

  const cursor =
    isPanning || spaceHeld
      ? isPanning
        ? "cursor-grabbing"
        : "cursor-grab"
      : "cursor-default";

  return {
    zoom,
    pan,
    spaceHeld,
    isPanning,
    cursor,
    viewportRef,
    contentRef,
    fitToView,
    zoomIn,
    zoomOut,
    onPointerDown,
    onPointerMove,
    endPan,
  };
}
