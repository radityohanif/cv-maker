import type { CVData } from "@/data/sampleCV";

export type ValidationWarning = {
  id: string;
  message: string;
  severity: "info" | "warning";
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getValidationWarnings(data: CVData): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  if (!data.personal.fullName.trim()) {
    warnings.push({
      id: "name-required",
      message: "Full name is required for a professional CV.",
      severity: "warning",
    });
  }

  if (!data.personal.email.trim()) {
    warnings.push({
      id: "email-empty",
      message: "Email is missing — recruiters need a way to contact you.",
      severity: "warning",
    });
  } else if (!EMAIL_RE.test(data.personal.email.trim())) {
    warnings.push({
      id: "email-format",
      message: "Email format looks invalid. Double-check before exporting.",
      severity: "warning",
    });
  }

  if (!data.personal.phone.trim()) {
    warnings.push({
      id: "phone-empty",
      message: "Phone number is empty — consider adding one.",
      severity: "info",
    });
  }

  if (data.experience.length === 0 && data.projects.length === 0) {
    warnings.push({
      id: "no-experience-projects",
      message: "No work experience or projects yet — add at least one to strengthen your CV.",
      severity: "warning",
    });
  }

  const shortBullets = [
    ...data.experience.flatMap((x) => x.bullets),
    ...data.projects.flatMap((p) => p.bullets),
    ...data.activities.flatMap((a) => a.bullets),
  ].filter((b) => b.trim().length > 0 && b.trim().length < 25);

  if (shortBullets.length > 0) {
    warnings.push({
      id: "short-bullets",
      message: `${shortBullets.length} bullet point(s) look too short — aim for action + result.`,
      severity: "info",
    });
  }

  const contentLength =
    data.summary.length +
    data.education.length * 80 +
    data.experience.reduce((n, x) => n + x.bullets.join("").length, 0) +
    data.projects.reduce((n, p) => n + p.bullets.join("").length, 0);

  if (contentLength > 4500) {
    warnings.push({
      id: "cv-long",
      message: "Your CV may exceed one page — consider trimming older entries or bullets.",
      severity: "warning",
    });
  }

  return warnings;
}
