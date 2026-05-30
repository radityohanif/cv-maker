import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { SectionCard, Field, EntryCard } from "../SectionCard";
import { BulletEditor } from "../BulletEditor";
import { ChecklistCard } from "../ChecklistCard";
import type { CVData } from "@/data/sampleCV";
import { sectionMeta } from "@/data/sampleCV";

type Props = { data: CVData; setData: (d: CVData) => void };

const newId = () => Math.random().toString(36).slice(2, 9);

export function PersonalInfoForm({ data, setData }: Props) {
  const p = data.personal;
  const set = (k: keyof typeof p, v: string) =>
    setData({ ...data, personal: { ...p, [k]: v } });
  const m = sectionMeta.personal;
  return (
    <SectionCard title={m.label} description={m.description} hint={m.hint}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name" required>
          <Input value={p.fullName} onChange={(e) => set("fullName", e.target.value)} />
        </Field>
        <Field label="Title / headline" hint="Optional">
          <Input
            value={p.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Software Engineer"
          />
        </Field>
        <Field label="Email" required>
          <Input value={p.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Phone">
          <Input value={p.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="Location">
          <Input
            value={p.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="City, Country"
          />
        </Field>
        <Field label="Links" hint="LinkedIn · GitHub · portfolio">
          <Input value={p.links} onChange={(e) => set("links", e.target.value)} />
        </Field>
      </div>
    </SectionCard>
  );
}

export function SummaryForm({ data, setData }: Props) {
  const m = sectionMeta.summary;
  return (
    <SectionCard title={m.label} description={m.description} hint={m.hint}>
      <Field label="Professional summary" hint={`${data.summary.length}/400`}>
        <Textarea
          rows={5}
          value={data.summary}
          onChange={(e) => setData({ ...data, summary: e.target.value })}
          placeholder="Senior engineer with 6+ years shipping reliable internal tools…"
        />
      </Field>
      <div className="mt-3 flex flex-wrap gap-2">
        {[
          "5+ years building reliable internal tools",
          "Comfortable owning features end-to-end",
          "Translate business needs into shippable solutions",
        ].map((s) => (
          <Badge
            key={s}
            variant="outline"
            className="cursor-pointer font-normal hover:border-primary/40 hover:bg-primary/5"
            onClick={() =>
              setData({
                ...data,
                summary: data.summary ? `${data.summary} ${s}.` : `${s}.`,
              })
            }
          >
            + {s}
          </Badge>
        ))}
      </div>
    </SectionCard>
  );
}

export function EducationForm({ data, setData }: Props) {
  const m = sectionMeta.education;
  const add = () =>
    setData({
      ...data,
      education: [
        ...data.education,
        { id: newId(), school: "", degree: "", location: "", range: { start: "", end: "" }, details: [] },
      ],
    });
  const update = (id: string, patch: Partial<CVData["education"][number]>) =>
    setData({ ...data, education: data.education.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  const remove = (id: string) =>
    setData({ ...data, education: data.education.filter((e) => e.id !== id) });

  return (
    <SectionCard
      title={m.label}
      description={m.description}
      hint={m.hint}
      action={<Button size="sm" variant="outline" onClick={add}><Plus className="h-4 w-4" /> Add education</Button>}
    >
      <div className="space-y-3">
        {data.education.map((e) => (
          <EntryCard key={e.id} title={e.school || "New school"} subtitle={e.degree} onRemove={() => remove(e.id)}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="School"><Input value={e.school} onChange={(ev) => update(e.id, { school: ev.target.value })} /></Field>
              <Field label="Degree"><Input value={e.degree} onChange={(ev) => update(e.id, { degree: ev.target.value })} /></Field>
              <Field label="Location"><Input value={e.location} onChange={(ev) => update(e.id, { location: ev.target.value })} /></Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Start"><Input value={e.range.start} onChange={(ev) => update(e.id, { range: { ...e.range, start: ev.target.value } })} placeholder="Sep 2018" /></Field>
                <Field label="End"><Input value={e.range.end} onChange={(ev) => update(e.id, { range: { ...e.range, end: ev.target.value } })} placeholder="May 2022" /></Field>
              </div>
            </div>
          </EntryCard>
        ))}
      </div>
    </SectionCard>
  );
}

export function ExperienceForm({ data, setData }: Props) {
  const m = sectionMeta.experience;
  const add = () =>
    setData({
      ...data,
      experience: [
        ...data.experience,
        { id: newId(), company: "", role: "", location: "", range: { start: "", end: "", current: false }, bullets: [""] },
      ],
    });
  const update = (id: string, patch: Partial<CVData["experience"][number]>) =>
    setData({ ...data, experience: data.experience.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  const remove = (id: string) =>
    setData({ ...data, experience: data.experience.filter((x) => x.id !== id) });

  return (
    <SectionCard
      title={m.label}
      description={m.description}
      hint={m.hint}
      action={<Button size="sm" variant="outline" onClick={add}><Plus className="h-4 w-4" /> Add role</Button>}
    >
      <div className="space-y-4">
        {data.experience.map((x) => (
          <EntryCard key={x.id} title={x.company || "New company"} subtitle={x.role} onRemove={() => remove(x.id)}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Company"><Input value={x.company} onChange={(e) => update(x.id, { company: e.target.value })} /></Field>
              <Field label="Role / title"><Input value={x.role} onChange={(e) => update(x.id, { role: e.target.value })} /></Field>
              <Field label="Location"><Input value={x.location} onChange={(e) => update(x.id, { location: e.target.value })} /></Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Start"><Input value={x.range.start} onChange={(e) => update(x.id, { range: { ...x.range, start: e.target.value } })} placeholder="Jun 2022" /></Field>
                <Field label="End"><Input value={x.range.end} disabled={x.range.current} onChange={(e) => update(x.id, { range: { ...x.range, end: e.target.value } })} placeholder="Present" /></Field>
              </div>
            </div>
            <label className="mt-3 flex items-center gap-2 text-[12.5px] text-foreground">
              <Checkbox
                checked={x.range.current}
                onCheckedChange={(c) =>
                  update(x.id, { range: { ...x.range, current: !!c, end: c ? "Present" : x.range.end } })
                }
              />
              I currently work here
            </label>
            <div className="mt-4 border-t border-border pt-4">
              <div className="mb-2 text-[12.5px] font-medium text-foreground">Achievements</div>
              <BulletEditor bullets={x.bullets} onChange={(bullets) => update(x.id, { bullets })} />
            </div>
          </EntryCard>
        ))}
      </div>
    </SectionCard>
  );
}

export function ProjectsForm({ data, setData }: Props) {
  const m = sectionMeta.projects;
  const add = () =>
    setData({
      ...data,
      projects: [
        ...data.projects,
        { id: newId(), name: "", stack: "", range: { start: "", end: "" }, bullets: [""] },
      ],
    });
  const update = (id: string, patch: Partial<CVData["projects"][number]>) =>
    setData({ ...data, projects: data.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  const remove = (id: string) =>
    setData({ ...data, projects: data.projects.filter((p) => p.id !== id) });

  return (
    <SectionCard
      title={m.label}
      description={m.description}
      hint={m.hint}
      action={<Button size="sm" variant="outline" onClick={add}><Plus className="h-4 w-4" /> Add project</Button>}
    >
      <div className="space-y-4">
        {data.projects.map((p) => (
          <EntryCard key={p.id} title={p.name || "New project"} subtitle={p.stack} onRemove={() => remove(p.id)}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Project name"><Input value={p.name} onChange={(e) => update(p.id, { name: e.target.value })} /></Field>
              <Field label="Stack / context"><Input value={p.stack} onChange={(e) => update(p.id, { stack: e.target.value })} /></Field>
              <Field label="Start"><Input value={p.range.start} onChange={(e) => update(p.id, { range: { ...p.range, start: e.target.value } })} /></Field>
              <Field label="End"><Input value={p.range.end} onChange={(e) => update(p.id, { range: { ...p.range, end: e.target.value } })} /></Field>
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <BulletEditor bullets={p.bullets} onChange={(bullets) => update(p.id, { bullets })} />
            </div>
          </EntryCard>
        ))}
      </div>
    </SectionCard>
  );
}

export function ActivitiesForm({ data, setData }: Props) {
  const m = sectionMeta.activities;
  const add = () =>
    setData({
      ...data,
      activities: [
        ...data.activities,
        { id: newId(), organization: "", role: "", location: "", range: { start: "", end: "" }, bullets: [""] },
      ],
    });
  const update = (id: string, patch: Partial<CVData["activities"][number]>) =>
    setData({ ...data, activities: data.activities.map((a) => (a.id === id ? { ...a, ...patch } : a)) });
  const remove = (id: string) =>
    setData({ ...data, activities: data.activities.filter((a) => a.id !== id) });

  return (
    <SectionCard
      title={m.label}
      description={m.description}
      hint={m.hint}
      action={<Button size="sm" variant="outline" onClick={add}><Plus className="h-4 w-4" /> Add activity</Button>}
    >
      <div className="space-y-4">
        {data.activities.map((a) => (
          <EntryCard key={a.id} title={a.organization || "New activity"} subtitle={a.role} onRemove={() => remove(a.id)}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Organization"><Input value={a.organization} onChange={(e) => update(a.id, { organization: e.target.value })} /></Field>
              <Field label="Role"><Input value={a.role} onChange={(e) => update(a.id, { role: e.target.value })} /></Field>
              <Field label="Location"><Input value={a.location} onChange={(e) => update(a.id, { location: e.target.value })} /></Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Start"><Input value={a.range.start} onChange={(e) => update(a.id, { range: { ...a.range, start: e.target.value } })} /></Field>
                <Field label="End"><Input value={a.range.end} onChange={(e) => update(a.id, { range: { ...a.range, end: e.target.value } })} /></Field>
              </div>
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <BulletEditor bullets={a.bullets} onChange={(bullets) => update(a.id, { bullets })} />
            </div>
          </EntryCard>
        ))}
      </div>
    </SectionCard>
  );
}

function TagInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="rounded-md border border-input bg-background p-2">
      <div className="flex flex-wrap gap-1.5">
        {values.map((v, i) => (
          <Badge key={`${v}-${i}`} variant="secondary" className="gap-1.5 font-normal">
            {v}
            <button
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </Badge>
        ))}
        <input
          className="min-w-[120px] flex-1 bg-transparent px-1.5 py-0.5 text-sm outline-none"
          placeholder={placeholder}
          onKeyDown={(e) => {
            const target = e.currentTarget;
            if ((e.key === "Enter" || e.key === ",") && target.value.trim()) {
              e.preventDefault();
              onChange([...values, target.value.trim()]);
              target.value = "";
            } else if (e.key === "Backspace" && !target.value && values.length) {
              onChange(values.slice(0, -1));
            }
          }}
        />
      </div>
    </div>
  );
}

export function SkillsForm({ data, setData }: Props) {
  const m = sectionMeta.skills;
  const s = data.skills;
  const set = (k: keyof typeof s, v: string[]) =>
    setData({ ...data, skills: { ...s, [k]: v } });
  return (
    <SectionCard title={m.label} description={m.description} hint={m.hint}>
      <div className="space-y-4">
        <Field label="Technical skills" hint="Enter or comma to add">
          <TagInput values={s.technical} onChange={(v) => set("technical", v)} placeholder="TypeScript, React, Postgres…" />
        </Field>
        <Field label="Languages">
          <TagInput values={s.languages} onChange={(v) => set("languages", v)} placeholder="English (native)" />
        </Field>
        <Field label="Certifications">
          <TagInput values={s.certifications} onChange={(v) => set("certifications", v)} placeholder="AWS Solutions Architect" />
        </Field>
        <Field label="Interests">
          <TagInput values={s.interests} onChange={(v) => set("interests", v)} placeholder="Hiking, open-source…" />
        </Field>
      </div>
    </SectionCard>
  );
}

export function ReviewForm({
  data,
  checklist,
  onJump,
}: {
  data: CVData;
  checklist: { label: string; done: boolean }[];
  onJump: () => void;
}) {
  const m = sectionMeta.review;
  return (
    <SectionCard title={m.label} description={m.description} hint={m.hint}>
      <div className="grid gap-4 md:grid-cols-2">
        <ChecklistCard items={checklist} />
        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
          <h3 className="text-sm font-semibold text-foreground">Snapshot</h3>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-[12.5px]">
            {([
              ["Experience entries", data.experience.length],
              ["Projects", data.projects.length],
              ["Education", data.education.length],
              ["Skills", data.skills.technical.length],
            ] as const).map(([k, v]) => (
              <div key={k} className="rounded-lg bg-surface px-3 py-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-lg font-semibold text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={onJump} variant="outline">Back to editing</Button>
        <Button>Download PDF</Button>
      </div>
    </SectionCard>
  );
}