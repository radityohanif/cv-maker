import { newId, type CVData } from "@/data/sampleCV";
import type { ImportCVJson, ImportWorkExperience, MappingPreview } from "./types";

function str(v: unknown): string {
  if (v == null) return "";
  return String(v).trim();
}

function joinSkills(parts: (string[] | null | undefined)[]): string {
  const all = parts.flatMap((p) => (Array.isArray(p) ? p.filter(Boolean) : []));
  return [...new Set(all.map((s) => s.trim()).filter(Boolean))].join(", ");
}

function isPresent(end: string) {
  return /present|current|now/i.test(end);
}

function workBullets(entry: ImportWorkExperience): string[] {
  const bullets: string[] = [];
  const summary = str(entry.summary);
  if (summary) bullets.push(summary);
  if (Array.isArray(entry.responsibilities)) {
    bullets.push(...entry.responsibilities.map(str).filter(Boolean));
  }
  return bullets.length ? bullets : [""];
}

function buildSummary(summary: ImportCVJson["summary"], headline: string): string {
  const parts = [
    str(summary?.shortBio),
    str(summary?.professionalStatement),
    str(summary?.profileDescription),
  ].filter(Boolean);
  if (parts.length) return parts.join(" ");
  return headline;
}

export function buildMappingPreview(data: ImportCVJson): MappingPreview {
  const additional = data.sections?.additional;
  const topSkills = Array.isArray(data.topSkills) ? data.topSkills.filter(Boolean) : [];
  const tech = additional?.technicalSkills?.filter(Boolean) ?? [];
  const business = additional?.businessSkills?.filter(Boolean) ?? [];
  const domains = additional?.domains?.filter(Boolean) ?? [];

  return {
    hasPersonalInfo: !!str(data.personalInfo?.fullName),
    personalName: str(data.personalInfo?.fullName) || undefined,
    educationCount: data.sections?.education?.length ?? 0,
    experienceCount: data.sections?.workExperience?.length ?? 0,
    projectCount: data.sections?.projects?.length ?? 0,
    technicalSkillsCount: tech.length + topSkills.length,
    businessSkillsCount: business.length,
    domainsCount: domains.length,
    languagesCount: additional?.languages?.filter(Boolean).length ?? 0,
    certificationsCount: additional?.certificationsAndTraining?.filter(Boolean).length ?? 0,
    awardsCount: additional?.awards?.filter(Boolean).length ?? 0,
    topSkillsCount: topSkills.length,
    hasMetadata: !!data.metadata && Object.keys(data.metadata).length > 0,
  };
}

export function mapImportJsonToCV(data: ImportCVJson): CVData {
  const pi = data.personalInfo ?? {};
  const headline = str(pi.headline);
  const social = str(pi.socialMedia);
  const altEmail = str(pi.alternativeEmail);

  const portfolio = social || (altEmail ? `Alt: ${altEmail}` : "");

  const summaryText = buildSummary(data.summary, headline);

  const education = (data.sections?.education ?? []).map((e) => {
    const start = str(e.date?.start);
    const end = str(e.date?.end);
    const details = Array.isArray(e.details) ? e.details.map(str).filter(Boolean) : [];
    const gpaLine = details.find((d) => /gpa|honor|dean/i.test(d)) ?? details[0] ?? "";
    const courseworkLine =
      details.find((d) => /coursework|relevant/i.test(d)) ??
      details.filter((d) => d !== gpaLine).join("; ");
    return {
      id: newId(),
      institution: str(e.institution),
      degree: str(e.degree),
      major: str(e.fieldOfStudy),
      location: str(e.location),
      startDate: start,
      endDate: end,
      gpa: gpaLine,
      coursework: courseworkLine,
    };
  });

  const experience = (data.sections?.workExperience ?? []).map((x) => {
    const start = str(x.date?.start);
    const end = str(x.date?.end);
    const current = isPresent(end);
    return {
      id: newId(),
      company: str(x.company),
      title: str(x.position),
      location: str(x.location),
      startDate: start,
      endDate: current ? "Present" : end,
      isCurrent: current,
      bullets: workBullets(x),
    };
  });

  const projects = (data.sections?.projects ?? []).map((p) => {
    const techs = Array.isArray(p.technologies)
      ? p.technologies.map(str).filter(Boolean).join(", ")
      : "";
    const desc = str(p.description);
    const bullets = desc ? [desc] : [""];
    const category = str(p.category);
    const dateLabel = category || "";

    return {
      id: newId(),
      name: str(p.projectName),
      techStack: techs,
      date: dateLabel,
      bullets,
    };
  });

  const additional = data.sections?.additional;
  const topSkills = Array.isArray(data.topSkills) ? data.topSkills : [];

  const technicalSkills = joinSkills([
    topSkills,
    additional?.technicalSkills ?? [],
    additional?.businessSkills ?? [],
    additional?.domains ?? [],
  ]);

  return {
    personal: {
      fullName: str(pi.fullName),
      title: headline,
      location: str(pi.location),
      phone: str(pi.phone),
      email: str(pi.email),
      linkedin: str(pi.linkedin),
      portfolio,
      website: str(pi.website),
    },
    summary: summaryText,
    education,
    experience,
    projects,
    activities: [],
    additional: {
      technicalSkills,
      languages: joinSkills([additional?.languages ?? []]),
      certifications: joinSkills([additional?.certificationsAndTraining ?? []]),
      awards: joinSkills([additional?.awards ?? []]),
    },
  };
}

export function hasDetectableSections(data: ImportCVJson): boolean {
  const preview = buildMappingPreview(data);
  return (
    preview.hasPersonalInfo ||
    preview.educationCount > 0 ||
    preview.experienceCount > 0 ||
    preview.projectCount > 0 ||
    preview.technicalSkillsCount > 0
  );
}
