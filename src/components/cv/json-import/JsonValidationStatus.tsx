import { AlertCircle, CheckCircle2, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ValidationMessage } from "@/lib/jsonImport";

const iconMap = {
  success: CheckCircle2,
  info: Info,
  warning: AlertCircle,
  error: AlertCircle,
};

const styleMap = {
  success: "border-success/30 bg-success/10 text-success",
  info: "border-border bg-muted/50 text-muted-foreground",
  warning: "border-warning/30 bg-warning/10 text-warning",
  error: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function JsonValidationStatus({
  messages,
  parseError,
}: {
  messages: ValidationMessage[];
  parseError?: string;
}) {
  if (!messages.length && !parseError) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground">
        Paste JSON and click <span className="font-medium text-foreground">Validate JSON</span> to
        see results.
      </div>
    );
  }

  const display = parseError
    ? [{ id: "parse", text: parseError, severity: "error" as const }]
    : messages;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground">Validation</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {display.map((msg) => {
          const Icon = iconMap[msg.severity];
          return (
            <div
              key={msg.id}
              className={cn(
                "flex items-start gap-2 rounded-lg border px-3 py-2 text-[12px]",
                styleMap[msg.severity],
              )}
            >
              <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span className="text-foreground">{msg.text}</span>
            </div>
          );
        })}
      </div>
      {!parseError && messages.some((m) => m.severity === "info") && (
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Sparkles className="h-3 w-3" />
          Some fields are unsupported and will be ignored during import.
        </p>
      )}
    </div>
  );
}
