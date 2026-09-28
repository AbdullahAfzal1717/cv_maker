export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  address: string;
  linkedin: string;
  profilePhoto: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  grade: string;
  startDate: string;
  endDate: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ProjectEntry {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link: string;
}

export interface AdditionalSections {
  skills: string[];
  languages: string[];
  interests: string[];
  software: string[];
  certificates: string[];
  publications: string[];
  references: string[];
  socialLinks: string[];
}

export interface ResumeData {
  templateId: string;
  personalInfo: PersonalInfo;
  objective: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  additional: AdditionalSections;
}

export interface CVProfile {
  _id: string;
  userId: string;
  profileName: string;
  isMainProfile: boolean;
  status: "incomplete" | "complete";
  resumeData: ResumeData;
  createdAt: string;
  updatedAt: string;
}

export interface CVExport {
  _id: string;
  userId: string;
  profileId: string;
  exportLabel: string;
  profileNameSnapshot: string;
  contentHash: string;
  resumeData: ResumeData;
  createdAt: string;
  updatedAt: string;
}

export type CVStatus = "incomplete" | "complete";

export interface CVDraft {
  resumeData: ResumeData;
  profileName: string;
  isMainProfile?: boolean;
  status?: CVStatus;
  isSyncedToAccount: boolean;
  lastSaved?: string;
}

export type SyncStatus = "saved-local" | "saving" | "synced" | "error";
