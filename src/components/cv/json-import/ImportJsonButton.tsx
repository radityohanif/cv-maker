import { FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ImportJsonButton({
  onClick,
  variant = "outline",
  size = "sm",
  className,
}: {
  onClick: () => void;
  variant?: "outline" | "default" | "ghost" | "secondary";
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={onClick}
      className={cn("gap-1.5", className)}
    >
      <FileJson className="h-4 w-4" />
      Import JSON
    </Button>
  );
}
