import { useCallback, useState } from "react";
import { CheckCircle2, Eraser, FileCode2, Shield, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { JsonEditorPanel } from "./JsonEditorPanel";
import { JsonValidationStatus } from "./JsonValidationStatus";
import { JsonMappingPreview } from "./JsonMappingPreview";
import { JsonSchemaGuide } from "./JsonSchemaGuide";
import {
  exampleImportJsonString,
  hasExistingDraft,
  processImportJson,
  type JsonImportResult,
} from "@/lib/jsonImport";
import type { CVData } from "@/data/sampleCV";
import { toast } from "sonner";

export function JsonImportFlow({
  currentData,
  onApply,
  onCancel,
  embedded = false,
}: {
  currentData: CVData;
  onApply: (data: CVData) => void;
  onCancel?: () => void;
  embedded?: boolean;
}) {
  const [jsonText, setJsonText] = useState("");
  const [result, setResult] = useState<JsonImportResult | null>(null);
  const [showOverwrite, setShowOverwrite] = useState(false);
  const [pendingData, setPendingData] = useState<CVData | null>(null);

  const validate = useCallback(() => {
    const next = processImportJson(jsonText);
    setResult(next);
    return next;
  }, [jsonText]);

  const applyData = (data: CVData) => {
    onApply(data);
    toast.success("JSON imported successfully", {
      description: "Draft updated locally — continue editing in the form.",
    });
    onCancel?.();
  };

  const handleApply = () => {
    const validation = result ?? validate();
    if (!validation.valid || !validation.mappedData) {
      toast.error("Cannot apply yet", {
        description: "Validate JSON and fix errors first.",
      });
      return;
    }

    if (hasExistingDraft(currentData)) {
      setPendingData(validation.mappedData);
      setShowOverwrite(true);
      return;
    }

    applyData(validation.mappedData);
  };

  const confirmOverwrite = () => {
    if (pendingData) applyData(pendingData);
    setShowOverwrite(false);
    setPendingData(null);
  };

  return (
    <div className={embedded ? "space-y-5" : "flex max-h-[85vh] flex-col gap-5 overflow-y-auto"}>
      {!embedded && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">Import from JSON</h2>
            <Badge variant="secondary" className="font-normal">
              Fast start
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Paste structured CV data to populate your form and preview instantly. No login, no
            backend upload — everything stays in your browser.
          </p>
          <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5">
              <Shield className="h-3 w-3" /> No login required
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5">
              <Upload className="h-3 w-3" /> No backend upload
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5">
              <Sparkles className="h-3 w-3" /> Saved to local storage
            </span>
          </div>
        </div>
      )}

      <JsonEditorPanel value={jsonText} onChange={setJsonText} />

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setJsonText(exampleImportJsonString);
            setResult(null);
          }}
        >
          <FileCode2 className="h-4 w-4" />
          Paste example
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={validate}>
          <CheckCircle2 className="h-4 w-4" />
          Validate JSON
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setJsonText("");
            setResult(null);
          }}
        >
          <Eraser className="h-4 w-4" />
          Clear
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <JsonValidationStatus messages={result?.messages ?? []} parseError={result?.parseError} />
        <JsonMappingPreview mapping={result?.mapping} />
      </div>

      <JsonSchemaGuide />

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="button"
          onClick={handleApply}
          disabled={!result?.valid}
          className="min-w-[140px]"
        >
          Apply to CV
        </Button>
      </div>

      <AlertDialog open={showOverwrite} onOpenChange={setShowOverwrite}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace current draft?</AlertDialogTitle>
            <AlertDialogDescription>
              Applying this JSON will replace your current draft. Your existing form data and
              preview will be overwritten. Data is saved locally in this browser only.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingData(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmOverwrite}>Continue & apply</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
