import type { ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  description,
  hint,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  hint?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {hint && (
        <div className="mb-4 rounded-lg border border-accent/40 bg-accent/40 px-3 py-2 text-[12px] text-accent-foreground">
          <span className="font-medium">Tip · </span>
          {hint}
        </div>
      )}
      {children}
    </section>
  );
}

export function Field({
  label,
  hint,
  children,
  required,
  warning,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  required?: boolean;
  warning?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[12.5px] font-medium text-foreground">
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </span>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {warning && <p className="mt-1 text-[11px] text-warning">{warning}</p>}
    </label>
  );
}

export function EntryCard({
  title,
  subtitle,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  children,
}: {
  title: string;
  subtitle?: string;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-foreground">{title}</div>
          {subtitle && <div className="text-[12px] text-muted-foreground">{subtitle}</div>}
        </div>
        <div className="flex items-center gap-1">
          {(onMoveUp || onMoveDown) && (
            <div className="flex rounded-md border border-border">
              <button
                type="button"
                onClick={onMoveUp}
                disabled={!canMoveUp}
                className="rounded-l-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
                aria-label="Move up"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={onMoveDown}
                disabled={!canMoveDown}
                className="rounded-r-md border-l border-border p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
                aria-label="Move down"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="rounded-md px-2 py-1 text-[12px] text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              Remove
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function reorderList<T extends { id: string }>(
  items: T[],
  id: string,
  direction: "up" | "down",
): T[] {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return items;
  return moveItem(items, index, direction === "up" ? index - 1 : index + 1);
}
