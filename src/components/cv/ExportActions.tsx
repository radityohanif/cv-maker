import { Download, Image as ImageIcon, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { exportCVAsPDF, exportCVAsPNG } from "@/lib/exportCV";
import { exportFileName } from "@/data/sampleCV";

export function ExportActions({
  getExportElement,
  fullName,
  onReset,
  size = "sm",
  showReset = true,
}: {
  getExportElement: () => HTMLElement | null;
  fullName: string;
  onReset: () => void;
  size?: "sm" | "default";
  showReset?: boolean;
}) {
  const runExport = async (type: "pdf" | "png") => {
    const element = getExportElement();
    if (!element) {
      toast.error("Preview not ready", {
        description: "Try again in a moment.",
      });
      return;
    }

    const filename = exportFileName(fullName, type);
    const toastId = toast.loading(type === "pdf" ? "Generating PDF…" : "Generating PNG…");

    try {
      if (type === "pdf") {
        await exportCVAsPDF(element, filename);
      } else {
        await exportCVAsPNG(element, filename);
      }
      toast.success(`Downloaded ${filename}`, { id: toastId });
    } catch {
      toast.error("Export failed", {
        id: toastId,
        description: "Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {showReset && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size={size}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all CV data?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes your saved draft from this browser and restores the sample CV. This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  onReset();
                  toast.success("CV reset to sample data");
                }}
              >
                Clear data
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <Button variant="outline" size={size} onClick={() => runExport("png")}>
        <ImageIcon className="h-4 w-4" />
        PNG
      </Button>
      <Button size={size} onClick={() => runExport("pdf")}>
        <Download className="h-4 w-4" />
        Download PDF
      </Button>
    </div>
  );
}
