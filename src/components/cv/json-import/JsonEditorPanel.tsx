import { Braces, ClipboardPaste } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function JsonEditorPanel({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const lines = value ? value.split("\n").length : 1;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Braces className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">JSON editor</h3>
            <p className="text-[11px] text-muted-foreground">
              {lines} line{lines === 1 ? "" : "s"} · monospace
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={async () => {
            try {
              const text = await navigator.clipboard.readText();
              if (text) onChange(text);
            } catch {
              /* clipboard unavailable */
            }
          }}
          className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ClipboardPaste className="h-3 w-3" />
          Paste from clipboard
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-[#0f1419] shadow-inner">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your CV JSON here…"
          spellCheck={false}
          className="min-h-[280px] resize-y border-0 bg-transparent font-mono text-[12.5px] leading-relaxed text-emerald-100/90 placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 lg:min-h-[340px]"
        />
      </div>
      <p className="text-[11px] text-muted-foreground">
        Accepts LinkedIn export snippets, portfolio JSON, prior resume data, or AI-generated
        structured profiles.
      </p>
    </div>
  );
}
