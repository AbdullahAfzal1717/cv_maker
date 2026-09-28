import type { ResumeData, CVStatus } from "../types/resume";

export const getCalculatedStatus = (data: ResumeData): CVStatus => {
  const hasPersonalInfo = !!(
    data.personalInfo.fullName?.trim() &&
    data.personalInfo.email?.trim() &&
    data.personalInfo.phone?.trim()
  );
  const hasObjective = !!data.objective?.trim();
  const hasEducation = data.education.length > 0;
  const hasExperience = data.experience.length > 0;
  const hasProjects = data.projects.length > 0;

  return hasPersonalInfo &&
    hasObjective &&
    hasEducation &&
    hasExperience &&
    hasProjects
    ? "complete"
    : "incomplete";
};
