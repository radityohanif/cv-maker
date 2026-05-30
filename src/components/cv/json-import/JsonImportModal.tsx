import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { JsonImportFlow } from "./JsonImportFlow";
import type { CVData } from "@/data/sampleCV";

export function JsonImportModal({
  open,
  onOpenChange,
  currentData,
  onApply,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentData: CVData;
  onApply: (data: CVData) => void;
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[95vh] overflow-y-auto rounded-t-2xl">
          <SheetHeader className="text-left">
            <SheetTitle>Import from JSON</SheetTitle>
          </SheetHeader>
          <div className="mt-4 pb-6">
            <JsonImportFlow
              currentData={currentData}
              onApply={onApply}
              onCancel={() => onOpenChange(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="sr-only">Import from JSON</DialogTitle>
        </DialogHeader>
        <JsonImportFlow
          currentData={currentData}
          onApply={onApply}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
