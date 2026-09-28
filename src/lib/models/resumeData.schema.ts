import { Schema } from "mongoose";

export interface IPersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  address: string;
  linkedin: string;
  profilePhoto: string;
}

export interface IEducationEntry {
  id: string;
  institution: string;
  degree: string;
  grade: string;
  startDate: string;
  endDate: string;
}

export interface IExperienceEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface IProjectEntry {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link: string;
}

export interface IAdditionalSections {
  skills: string[];
  languages: string[];
  interests: string[];
  software: string[];
  certificates: string[];
  publications: string[];
  references: string[];
  socialLinks: string[];
}

export interface IResumeData {
  templateId: string;
  personalInfo: IPersonalInfo;
  objective: string;
  education: IEducationEntry[];
  experience: IExperienceEntry[];
  projects: IProjectEntry[];
  additional: IAdditionalSections;
}

export const PersonalInfoSchema = new Schema<IPersonalInfo>(
  {
    fullName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    jobTitle: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
    profilePhoto: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  },
);

export const EducationEntrySchema = new Schema<IEducationEntry>(
  {
    id: {
      type: String,
      required: true,
    },
    institution: {
      type: String,
      default: "",
    },
    degree: {
      type: String,
      default: "",
    },
    grade: {
      type: String,
      default: "",
    },
    startDate: {
      type: String,
      default: "",
    },
    endDate: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  },
);

export const ExperienceEntrySchema = new Schema<IExperienceEntry>(
  {
    id: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "",
    },
    startDate: {
      type: String,
      default: "",
    },
    endDate: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  },
);

export const ProjectEntrySchema = new Schema<IProjectEntry>(
  {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    technologies: {
      type: [String],
      default: [],
    },
    link: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  },
);

export const AdditionalSectionsSchema = new Schema<IAdditionalSections>(
  {
    skills: {
      type: [String],
      default: [],
    },
    languages: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    software: {
      type: [String],
      default: [],
    },
    certificates: {
      type: [String],
      default: [],
    },
    publications: {
      type: [String],
      default: [],
    },
    references: {
      type: [String],
      default: [],
    },
    socialLinks: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  },
);

export const ResumeDataSchema = new Schema<IResumeData>(
  {
    templateId: {
      type: String,
      default: "classic-clean",
    },

    personalInfo: {
      type: PersonalInfoSchema,
      default: () => ({}),
    },

    objective: {
      type: String,
      default: "",
    },

    education: {
      type: [EducationEntrySchema],
      default: [],
    },

    experience: {
      type: [ExperienceEntrySchema],
      default: [],
    },

    projects: {
      type: [ProjectEntrySchema],
      default: [],
    },

    additional: {
      type: AdditionalSectionsSchema,
      default: () => ({}),
    },
  },
  {
    _id: false,
  },
);
