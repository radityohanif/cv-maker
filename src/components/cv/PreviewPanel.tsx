import { Maximize2, Minus, Plus } from "lucide-react";
import { CVPreview } from "./CVPreview";
import { usePanZoom } from "./usePanZoom";
import type { CVData } from "@/data/sampleCV";

export function PreviewPanel({ data }: { data: CVData }) {
  const {
    zoom,
    cursor,
    viewportRef,
    contentRef,
    fitToView,
    zoomIn,
    zoomOut,
    onPointerDown,
    onPointerMove,
    endPan,
  } = usePanZoom(0.62);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-card/60 px-4 py-2.5">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-0.5">
          <button
            type="button"
            onClick={zoomOut}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Zoom out"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-[2.5rem] px-1.5 text-center text-[11px] tabular-nums text-foreground">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Zoom in"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          type="button"
          onClick={fitToView}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Fit to view"
          title="Fit to view"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Fit</span>
        </button>
      </div>

      <div
        ref={viewportRef}
        className={`relative flex-1 overflow-hidden bg-[radial-gradient(circle_at_1px_1px,oklch(0.85_0.01_250)_1px,transparent_0)] [background-size:18px_18px] touch-none select-none ${cursor}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPan}
        onPointerCancel={endPan}
        onContextMenu={(e) => e.preventDefault()}
        role="application"
        aria-label="CV preview canvas. Scroll to pan. Ctrl or Cmd scroll to zoom."
      >
        <div
          ref={contentRef}
          className="absolute left-0 top-0 will-change-transform"
          style={{ transformOrigin: "0 0" }}
        >
          <CVPreview data={data} scale={1} />
        </div>
      </div>

      <p className="border-t border-border bg-card/40 px-4 py-1.5 text-center text-[10px] text-muted-foreground">
        Scroll to pan · Ctrl/Cmd + scroll to zoom · Drag to pan
      </p>
    </div>
  );
}
