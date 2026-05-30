import { Download, Image as ImageIcon, Eye, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function TopBar() {
  const notImpl = (label: string) =>
    toast(`${label} — coming soon`, {
      description: "Hooked up in the next iteration.",
    });

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:px-6">
      <div className="lg:hidden flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
          A
        </div>
        <span className="text-sm font-semibold">ATS CV Builder</span>
      </div>

      <div className="hidden lg:block">
        <h1 className="text-sm font-semibold text-foreground">
          Create a clean, professional, ATS-friendly resume
        </h1>
        <p className="text-[11px] text-muted-foreground">
          Guided builder · No account · Export when you're ready
        </p>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <Badge
          variant="secondary"
          className="gap-1.5 border-success/30 bg-success/10 text-success"
        >
          <Cloud className="h-3 w-3" />
          Draft saved locally · just now
        </Badge>
        <Button variant="outline" size="sm" onClick={() => notImpl("Preview")}>
          <Eye className="h-4 w-4" />
          Preview
        </Button>
        <Button variant="outline" size="sm" onClick={() => notImpl("PNG export")}>
          <ImageIcon className="h-4 w-4" />
          PNG
        </Button>
        <Button size="sm" onClick={() => notImpl("PDF export")}>
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </header>
  );
}