import { Check, Circle } from "lucide-react";

export function ChecklistCard({
  items,
}: {
  items: { label: string; done: boolean }[];
}) {
  const done = items.filter((i) => i.done).length;
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-foreground">ATS checklist</h3>
        <span className="text-[11px] text-muted-foreground">
          {done} / {items.length} done
        </span>
      </div>
      <ul className="mt-3 space-y-1.5">
        {items.map((it) => (
          <li key={it.label} className="flex items-center gap-2 text-[12.5px]">
            {it.done ? (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success text-white">
                <Check className="h-2.5 w-2.5" />
              </span>
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground/50" />
            )}
            <span className={it.done ? "text-muted-foreground line-through" : "text-foreground"}>
              {it.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}