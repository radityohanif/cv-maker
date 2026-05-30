import type { CVData, DateRange } from "@/data/sampleCV";

const fmt = (r: DateRange) => `${r.start} – ${r.current ? "Present" : r.end}`;

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mt-4 mb-1.5">
      <h2 className="text-[10.5px] font-bold tracking-[0.18em] text-black uppercase">
        {title}
      </h2>
      <div className="mt-0.5 h-px w-full bg-black" />
    </div>
  );
}

function EntryHeader({
  left,
  right,
  subLeft,
  subRight,
}: {
  left: string;
  right: string;
  subLeft?: string;
  subRight?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[11.5px] font-semibold text-black">{left}</span>
        <span className="text-[10.5px] text-black">{right}</span>
      </div>
      {(subLeft || subRight) && (
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[11px] italic text-black">{subLeft}</span>
          <span className="text-[10.5px] italic text-black">{subRight}</span>
        </div>
      )}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="mt-1 list-disc pl-4 marker:text-black">
      {items.map((b, i) => (
        <li key={i} className="text-[11px] leading-snug text-black">
          {b}
        </li>
      ))}
    </ul>
  );
}

export function CVPreview({ data, scale = 1 }: { data: CVData; scale?: number }) {
  const p = data.personal;
  const contact = [p.email, p.phone, p.location, p.links]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <div
      className="origin-top mx-auto bg-white text-black shadow-[0_4px_30px_rgba(15,23,42,0.12)] ring-1 ring-black/5"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "14mm 16mm",
        fontFamily:
          '"Times New Roman", "Liberation Serif", Georgia, serif',
        transform: `scale(${scale})`,
      }}
    >
      <header className="text-center">
        <h1 className="text-[22px] font-bold tracking-wide text-black">
          {p.fullName}
        </h1>
        {p.title && (
          <p className="mt-0.5 text-[11px] text-black">{p.title}</p>
        )}
        <p className="mt-1 text-[10.5px] text-black">{contact}</p>
      </header>

      {data.summary && (
        <>
          <SectionHeader title="Summary" />
          <p className="text-[11px] leading-snug text-black">{data.summary}</p>
        </>
      )}

      {data.education.length > 0 && (
        <>
          <SectionHeader title="Education" />
          <div className="space-y-2">
            {data.education.map((e) => (
              <div key={e.id}>
                <EntryHeader
                  left={e.school}
                  right={e.location}
                  subLeft={e.degree}
                  subRight={fmt(e.range)}
                />
                <Bullets items={e.details} />
              </div>
            ))}
          </div>
        </>
      )}

      {data.experience.length > 0 && (
        <>
          <SectionHeader title="Work Experience" />
          <div className="space-y-2.5">
            {data.experience.map((x) => (
              <div key={x.id}>
                <EntryHeader
                  left={x.company}
                  right={x.location}
                  subLeft={x.role}
                  subRight={fmt(x.range)}
                />
                <Bullets items={x.bullets} />
              </div>
            ))}
          </div>
        </>
      )}

      {data.projects.length > 0 && (
        <>
          <SectionHeader title="Projects" />
          <div className="space-y-2">
            {data.projects.map((pr) => (
              <div key={pr.id}>
                <EntryHeader
                  left={pr.name}
                  right={fmt(pr.range)}
                  subLeft={pr.stack}
                />
                <Bullets items={pr.bullets} />
              </div>
            ))}
          </div>
        </>
      )}

      {data.activities.length > 0 && (
        <>
          <SectionHeader title="Activities" />
          <div className="space-y-2">
            {data.activities.map((a) => (
              <div key={a.id}>
                <EntryHeader
                  left={a.organization}
                  right={a.location}
                  subLeft={a.role}
                  subRight={fmt(a.range)}
                />
                <Bullets items={a.bullets} />
              </div>
            ))}
          </div>
        </>
      )}

      <SectionHeader title="Additional" />
      <div className="space-y-0.5 text-[11px] text-black">
        {data.skills.technical.length > 0 && (
          <p>
            <span className="font-semibold">Technical:</span>{" "}
            {data.skills.technical.join(", ")}
          </p>
        )}
        {data.skills.languages.length > 0 && (
          <p>
            <span className="font-semibold">Languages:</span>{" "}
            {data.skills.languages.join(", ")}
          </p>
        )}
        {data.skills.certifications.length > 0 && (
          <p>
            <span className="font-semibold">Certifications:</span>{" "}
            {data.skills.certifications.join(", ")}
          </p>
        )}
        {data.skills.interests.length > 0 && (
          <p>
            <span className="font-semibold">Interests:</span>{" "}
            {data.skills.interests.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}