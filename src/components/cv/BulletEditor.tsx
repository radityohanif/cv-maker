import { Plus, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const SUGGESTIONS = [
  "Improved monthly reporting workflow by reducing manual reconciliation time by 40%.",
  "Built a reusable invoice template system used across quotation, invoice, and billing workflows.",
  "Integrated third-party APIs and improved synchronization reliability across internal systems.",
];

export function BulletEditor({
  bullets,
  onChange,
}: {
  bullets: string[];
  onChange: (bullets: string[]) => void;
}) {
  const update = (i: number, v: string) =>
    onChange(bullets.map((b, idx) => (idx === i ? v : b)));
  const remove = (i: number) => onChange(bullets.filter((_, idx) => idx !== i));
  const add = (v = "") => onChange([...bullets, v]);

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border bg-background px-3 py-2 text-[12px] text-muted-foreground">
        <span className="font-medium text-foreground">Formula:</span>{" "}
        Action verb + task/project + measurable result + tools/context.
      </div>

      <div className="space-y-2">
        {bullets.map((b, i) => (
          <div key={i} className="group flex gap-2">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
            <Textarea
              value={b}
              onChange={(e) => update(i, e.target.value)}
              rows={2}
              className="min-h-0 resize-none text-sm"
              placeholder="Start with an action verb…"
            />
            <button
              onClick={() => remove(i)}
              className="self-start rounded-md p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-destructive group-hover:opacity-100"
              aria-label="Remove bullet"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" onClick={() => add()}>
        <Plus className="h-4 w-4" /> Add bullet
      </Button>

      <div>
        <div className="mb-2 flex items-center gap-1.5 text-[12px] font-medium text-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Need inspiration?
        </div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => add(s)}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-left text-[11.5px] text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
            >
              + {s.slice(0, 60)}…
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}