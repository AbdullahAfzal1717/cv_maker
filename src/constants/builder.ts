import type { ResumeData } from "../types/resume";

export const STEP_NAMES = [
  "Personal Info",
  "Objective",
  "Education",
  "Experience",
  "Projects",
  "Additional Details",
  "Review & Export",
] as const;

export const BLANK_RESUME = (templateId: string): ResumeData => ({
  templateId,
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    jobTitle: "",
    address: "",
    linkedin: "",
    profilePhoto: "",
  },
  objective: "",
  education: [],
  experience: [],
  projects: [],
  additional: {
    skills: [],
    languages: [],
    interests: [],
    software: [],
    certificates: [],
    publications: [],
    references: [],
    socialLinks: [],
  },
});
