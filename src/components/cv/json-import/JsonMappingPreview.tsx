import type { MappingPreview } from "@/lib/jsonImport";

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="text-base font-semibold tabular-nums text-foreground">{value}</dd>
    </div>
  );
}

export function JsonMappingPreview({ mapping }: { mapping?: MappingPreview }) {
  if (!mapping) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground">
        Mapping preview appears after successful validation.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Detected data</h3>
        <p className="text-[12px] text-muted-foreground">
          Review what will populate your CV before applying.
        </p>
      </div>
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Stat
          label="Personal information"
          value={mapping.hasPersonalInfo ? (mapping.personalName ?? "1 profile") : "—"}
        />
        <Stat label="Education" value={mapping.educationCount} />
        <Stat label="Work experience" value={mapping.experienceCount} />
        <Stat label="Projects" value={mapping.projectCount} />
        <Stat label="Technical skills" value={mapping.technicalSkillsCount} />
        <Stat label="Business skills" value={mapping.businessSkillsCount} />
        <Stat label="Domains" value={mapping.domainsCount} />
        <Stat label="Languages" value={mapping.languagesCount} />
        <Stat label="Certifications" value={mapping.certificationsCount} />
        <Stat label="Awards" value={mapping.awardsCount} />
        {mapping.hasMetadata && <Stat label="Metadata" value="Detected" />}
      </dl>
      <p className="text-[11px] text-muted-foreground">
        Metadata (template, layout, style) is used for import only and will not appear on your ATS
        resume.
      </p>
    </div>
  );
}
