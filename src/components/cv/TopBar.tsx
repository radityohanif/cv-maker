import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocalStorageStatus } from "./LocalStorageStatus";
import { ExportActions } from "./ExportActions";
import type { SaveStatus } from "@/hooks/useCVStorage";

export function TopBar({
  saveStatus,
  lastSaved,
  fullName,
  getExportElement,
  onReset,
  onPreview,
}: {
  saveStatus: SaveStatus;
  lastSaved: Date | null;
  fullName: string;
  getExportElement: () => HTMLElement | null;
  onReset: () => void;
  onPreview?: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:px-6">
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
          A
        </div>
        <span className="text-sm font-semibold">ATS CV Builder</span>
      </div>

      <div className="hidden lg:block">
        <h1 className="text-sm font-semibold text-foreground">
          Create a clean, professional, ATS-friendly resume
        </h1>
        <p className="text-[11px] text-muted-foreground">
          Guided builder · No account · Auto-saved locally
        </p>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <LocalStorageStatus status={saveStatus} lastSaved={lastSaved} />
        {onPreview && (
          <Button variant="outline" size="sm" className="lg:hidden" onClick={onPreview}>
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        )}
        <ExportActions getExportElement={getExportElement} fullName={fullName} onReset={onReset} />
      </div>
    </header>
  );
}
