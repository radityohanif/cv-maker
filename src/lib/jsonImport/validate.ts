import type { ImportCVJson, JsonImportResult, ValidationMessage } from "./types";
import { KNOWN_IMPORT_KEYS } from "./types";
import { buildMappingPreview, hasDetectableSections, mapImportJsonToCV } from "./mapToCV";

const PHONE_MIN_DIGITS = 7;

function countDigits(s: string) {
  return (s.match(/\d/g) ?? []).length;
}

function collectUnsupportedFields(obj: Record<string, unknown>, prefix = ""): string[] {
  const unsupported: string[] = [];
  for (const key of Object.keys(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (!prefix && !KNOWN_IMPORT_KEYS.has(key)) {
      unsupported.push(path);
    }
    const val = obj[key];
    if (val && typeof val === "object" && !Array.isArray(val) && prefix === "") {
      if (key === "sections" || key === "metadata") continue;
    }
  }
  return unsupported;
}

function countMissingRecommended(data: ImportCVJson): number {
  let missing = 0;
  if (!data.personalInfo?.fullName?.trim()) missing++;
  const pi = data.personalInfo;
  const hasContact = !!(
    pi?.email?.trim() ||
    pi?.phone?.trim() ||
    pi?.linkedin?.trim() ||
    pi?.website?.trim()
  );
  if (!hasContact) missing++;
  const hasWorkOrProjects =
    (data.sections?.workExperience?.length ?? 0) > 0 || (data.sections?.projects?.length ?? 0) > 0;
  if (!hasWorkOrProjects) missing++;
  return missing;
}

export function parseImportJson(text: string): {
  parsed: ImportCVJson | null;
  error?: string;
} {
  if (!text.trim()) {
    return { parsed: null, error: "JSON input is empty." };
  }
  try {
    const parsed = JSON.parse(text) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {
        parsed: null,
        error: "JSON must be an object with CV fields at the root level.",
      };
    }
    return { parsed: parsed as ImportCVJson };
  } catch {
    return {
      parsed: null,
      error: "The JSON format is invalid. Please check missing commas, quotes, or brackets.",
    };
  }
}

export function validateImportJson(parsed: ImportCVJson): JsonImportResult {
  const messages: ValidationMessage[] = [];
  const unsupportedFields = collectUnsupportedFields(parsed as Record<string, unknown>);

  messages.push({
    id: "valid-json",
    text: "Valid JSON",
    severity: "success",
  });

  if (!parsed.sections) {
    messages.push({
      id: "missing-sections",
      text: "sections object is missing — some CV content may not import.",
      severity: "warning",
    });
  }

  if (!hasDetectableSections(parsed)) {
    messages.push({
      id: "no-sections",
      text: "The JSON is valid, but no CV sections were detected.",
      severity: "error",
    });
  }

  const missingCount = countMissingRecommended(parsed);
  if (missingCount > 0) {
    messages.push({
      id: "missing-recommended",
      text: `${missingCount} recommended field${missingCount > 1 ? "s" : ""} missing`,
      severity: "warning",
    });
  }

  if (!parsed.personalInfo?.fullName?.trim()) {
    messages.push({
      id: "no-name",
      text: "personalInfo.fullName is recommended for a professional CV.",
      severity: "info",
    });
  }

  const phone = parsed.personalInfo?.phone?.trim() ?? "";
  if (phone && countDigits(phone) < PHONE_MIN_DIGITS) {
    messages.push({
      id: "phone-incomplete",
      text: "Phone number may be incomplete.",
      severity: "warning",
    });
  }

  const emptyArrays: string[] = [];
  if (parsed.topSkills?.length === 0) emptyArrays.push("topSkills");
  if (parsed.sections?.education?.length === 0) emptyArrays.push("education");
  if (parsed.sections?.workExperience?.length === 0) emptyArrays.push("workExperience");
  if (parsed.sections?.projects?.length === 0) emptyArrays.push("projects");

  for (const arr of emptyArrays) {
    messages.push({
      id: `empty-${arr}`,
      text: `${arr} array is empty.`,
      severity: "info",
    });
  }

  if (
    (parsed.sections?.workExperience?.length ?? 0) === 0 &&
    (parsed.sections?.projects?.length ?? 0) === 0
  ) {
    messages.push({
      id: "no-work",
      text: "No work experience found — consider adding workExperience or projects.",
      severity: "warning",
    });
  }

  if (unsupportedFields.length > 0) {
    messages.push({
      id: "unsupported",
      text: `${unsupportedFields.length} unsupported root field${unsupportedFields.length > 1 ? "s" : ""} will be ignored`,
      severity: "info",
    });
  }

  const hasError = messages.some((m) => m.severity === "error");
  const ready = !hasError && hasDetectableSections(parsed);

  if (ready) {
    messages.unshift({
      id: "ready",
      text: "Ready to import",
      severity: "success",
    });
  }

  const mapping = buildMappingPreview(parsed);
  const mappedData = ready ? mapImportJsonToCV(parsed) : undefined;

  return {
    valid: ready,
    messages,
    mapping,
    mappedData,
    unsupportedFields,
  };
}

export function processImportJson(text: string): JsonImportResult {
  const { parsed, error } = parseImportJson(text);
  if (!parsed) {
    return {
      valid: false,
      parseError: error,
      messages: [
        {
          id: "parse-error",
          text: error ?? "Invalid JSON",
          severity: "error",
        },
      ],
      unsupportedFields: [],
    };
  }
  return validateImportJson(parsed);
}
