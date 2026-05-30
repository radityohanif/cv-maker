import type { CVData } from "@/data/sampleCV";

export interface ImportDateRange {
  start?: string | null;
  end?: string | null;
}

export interface ImportPersonalInfo {
  fullName?: string | null;
  headline?: string | null;
  location?: string | null;
  email?: string | null;
  alternativeEmail?: string | null;
  phone?: string | null;
  website?: string | null;
  linkedin?: string | null;
  socialMedia?: string | null;
}

export interface ImportSummary {
  shortBio?: string | null;
  professionalStatement?: string | null;
  profileDescription?: string | null;
}

export interface ImportEducation {
  institution?: string | null;
  degree?: string | null;
  fieldOfStudy?: string | null;
  location?: string | null;
  date?: ImportDateRange | null;
  details?: string[] | null;
}

export interface ImportWorkExperience {
  company?: string | null;
  position?: string | null;
  employmentType?: string | null;
  location?: string | null;
  date?: ImportDateRange | null;
  summary?: string | null;
  responsibilities?: string[] | null;
}

export interface ImportProject {
  projectName?: string | null;
  category?: string | null;
  description?: string | null;
  technologies?: string[] | null;
}

export interface ImportAdditional {
  technicalSkills?: string[] | null;
  businessSkills?: string[] | null;
  domains?: string[] | null;
  languages?: string[] | null;
  certificationsAndTraining?: string[] | null;
  awards?: string[] | null;
}

export interface ImportSections {
  education?: ImportEducation[] | null;
  workExperience?: ImportWorkExperience[] | null;
  projects?: ImportProject[] | null;
  additional?: ImportAdditional | null;
}

export interface ImportCVJson {
  personalInfo?: ImportPersonalInfo | null;
  summary?: ImportSummary | null;
  topSkills?: string[] | null;
  sections?: ImportSections | null;
  metadata?: Record<string, unknown> | null;
}

export type ValidationSeverity = "success" | "info" | "warning" | "error";

export interface ValidationMessage {
  id: string;
  text: string;
  severity: ValidationSeverity;
}

export interface MappingPreview {
  hasPersonalInfo: boolean;
  educationCount: number;
  experienceCount: number;
  projectCount: number;
  technicalSkillsCount: number;
  businessSkillsCount: number;
  domainsCount: number;
  languagesCount: number;
  certificationsCount: number;
  awardsCount: number;
  topSkillsCount: number;
  hasMetadata: boolean;
  personalName?: string;
}

export interface JsonImportResult {
  valid: boolean;
  parseError?: string;
  messages: ValidationMessage[];
  mapping?: MappingPreview;
  mappedData?: CVData;
  unsupportedFields: string[];
}

export const KNOWN_IMPORT_KEYS = new Set([
  "personalInfo",
  "summary",
  "topSkills",
  "sections",
  "metadata",
]);
