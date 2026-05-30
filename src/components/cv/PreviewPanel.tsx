import { useState } from "react";
import { Minus, Plus, Printer, RotateCcw, Download, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CVPreview } from "./CVPreview";
import type { CVData } from "@/data/sampleCV";
import { toast } from "sonner";

export function PreviewPanel({ data }: { data: CVData }) {
  const [zoom, setZoom] = useState(0.62);
  const mock = (label: string) =>
    toast(`${label} — placeholder`, { description: "Wire-up coming soon." });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-card/60 px-4 py-2.5">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-0.5">
          <button
            onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.05).toFixed(2)))}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Zoom out"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="px-1.5 text-[11px] tabular-nums text-foreground">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(1, +(z + 0.05).toFixed(2)))}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Zoom in"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => mock("Print")}>
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => mock("Reset draft")}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => mock("PNG")}>
            <ImageIcon className="h-4 w-4" /> PNG
          </Button>
          <Button size="sm" onClick={() => mock("PDF")}>
            <Download className="h-4 w-4" /> PDF
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-[radial-gradient(circle_at_1px_1px,oklch(0.85_0.01_250)_1px,transparent_0)] [background-size:18px_18px] p-6">
        <div
          style={{
            width: `calc(210mm * ${zoom})`,
            height: `calc(297mm * ${zoom})`,
          }}
          className="mx-auto"
        >
          <CVPreview data={data} scale={zoom} />
        </div>
      </div>
    </div>
  );
}