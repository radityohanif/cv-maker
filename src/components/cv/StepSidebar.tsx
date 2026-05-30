import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { sectionIds, sectionMeta, type SectionId } from "@/data/sampleCV";

interface Props {
  active: SectionId;
  onChange: (id: SectionId) => void;
  completion: Record<SectionId, boolean>;
  percent: number;
}

export function StepSidebar({ active, onChange, completion, percent }: Props) {
  return (
    <aside className="hidden lg:flex w-72 shrink-0 flex-col gap-4 border-r border-border bg-surface p-5">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
          A
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">ATS CV Builder</div>
          <div className="text-[11px] text-muted-foreground">Clean. Simple. Hireable.</div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-foreground">Completion</span>
          <span className="font-semibold text-primary">{percent}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {sectionIds.map((id, i) => {
          const isActive = id === active;
          const done = completion[id];
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors",
                  done
                    ? "border-transparent bg-success text-white"
                    : isActive
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground",
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium">
                  {sectionMeta[id].label}
                </span>
                <span className="block text-[11px] text-muted-foreground line-clamp-1">
                  {sectionMeta[id].description}
                </span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-dashed border-border bg-card/60 p-3 text-[11px] text-muted-foreground">
        <p className="font-medium text-foreground">No login required</p>
        <p className="mt-0.5">Your draft is saved locally in this browser.</p>
      </div>
    </aside>
  );
}