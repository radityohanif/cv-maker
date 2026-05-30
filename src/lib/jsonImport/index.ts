export { exampleImportJson, exampleImportJsonString, schemaGuideExample } from "./exampleJson";
export { mapImportJsonToCV, buildMappingPreview, hasDetectableSections } from "./mapToCV";
export { parseImportJson, validateImportJson, processImportJson } from "./validate";
export type { ImportCVJson, JsonImportResult, MappingPreview, ValidationMessage } from "./types";

import type { CVData } from "@/data/sampleCV";

export function hasExistingDraft(data: CVData): boolean {
  return !!(
    data.personal.fullName.trim() ||
    data.personal.email.trim() ||
    data.summary.trim().length > 20 ||
    data.education.length > 0 ||
    data.experience.length > 0 ||
    data.projects.length > 0 ||
    data.activities.length > 0 ||
    data.additional.technicalSkills.trim()
  );
}
