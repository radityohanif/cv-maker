import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { schemaGuideExample } from "@/lib/jsonImport";

export function JsonSchemaGuide() {
  return (
    <Accordion type="single" collapsible className="rounded-xl border border-border bg-card">
      <AccordionItem value="schema" className="border-none">
        <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
          Expected JSON format
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <p className="mb-3 text-[12px] text-muted-foreground">
            Paste structured CV data from LinkedIn exports, portfolio profiles, prior resumes, or
            AI-generated JSON. Only browser-local storage is used — nothing is uploaded.
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-3 font-mono text-[11px] leading-relaxed text-foreground">
            {schemaGuideExample}
          </pre>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
