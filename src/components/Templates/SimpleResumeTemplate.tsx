"use client";

import type { ResumeData } from "../../types/resume";
import { formatDateSlash } from "../../utils/formatDate";
import PaginatedSheet from "../common/PaginatedSheet";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mt-6 mb-2">
      {children}
    </h2>
  );
}

export default function SimpleResumeTemplate({ data }: { data: ResumeData }) {
  const {
    personalInfo,
    objective,
    education,
    experience,
    projects,
    additional,
  } = data;

  const additionalItems: { label: string; value: string }[] = [];
  if (additional.languages.length > 0)
    additionalItems.push({
      label: "Languages",
      value: additional.languages.join(", "),
    });
  if (additional.certificates.length > 0)
    additionalItems.push({
      label: "Certifications",
      value: additional.certificates.join(", "),
    });
  if (additional.publications.length > 0)
    additionalItems.push({
      label: "Publications",
      value: additional.publications.join(", "),
    });
  if (additional.interests.length > 0)
    additionalItems.push({
      label: "Interests",
      value: additional.interests.join(", "),
    });
  if (additional.software.length > 0)
    additionalItems.push({
      label: "Software",
      value: additional.software.join(", "),
    });
  if (additional.socialLinks.length > 0)
    additionalItems.push({
      label: "Social Links",
      value: additional.socialLinks.join(", "),
    });

  const sections: React.ReactNode[] = [];

  // CENTERED HEADER IDENTIFIER — always first
  sections.push(
    <div key="header" className="text-center">
      <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
        {personalInfo.fullName || "ANAISHA PARVATI"}
      </h1>
      <p className="text-sm font-medium tracking-[0.3em] text-slate-500 uppercase mt-2">
        {personalInfo.jobTitle || "Head Manager"}
      </p>

      <div className="h-px bg-slate-300 w-full my-4" />

      <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-slate-700 font-medium">
        {personalInfo.phone && (
          <span className="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24 11.36 11.36 0 0 0 3.58.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.58 1 1 0 0 1-.25 1.01l-2.2 2.2z" />
            </svg>
            {personalInfo.phone}
          </span>
        )}
        {personalInfo.address && (
          <span className="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
            </svg>
            {personalInfo.address}
          </span>
        )}
        {personalInfo.email && (
          <span className="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 5a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5zm2.4.5 7.6 6.34 7.6-6.34H4.4zM20 7.1l-7.4 6.17a1 1 0 0 1-1.28 0L4 7.1V18h16V7.1z" />
            </svg>
            {personalInfo.email}
          </span>
        )}
        {personalInfo.linkedin && (
          <span className="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2c1.2 1.4 2 3.6 2.3 6H9.7c.3-2.4 1.1-4.6 2.3-6zM8.3 6.2A13.6 13.6 0 0 0 7.7 10H4.6a8 8 0 0 1 3.7-3.8zM4.6 12h3.1c.1 1.4.4 2.7.9 3.8A8 8 0 0 1 4.6 12zm3.4 5.8c-.5-1.1-.9-2.4-.9-3.8h2.4c.2 1.4.5 2.7 1 3.8-.9-.1-1.7 0-2.5 0zm3.4.2c-1.2-1.4-2-3.6-2.3-6h4.6c-.3 2.4-1.1 4.6-2.3 6zm2.9-.2c.5-1.1.9-2.4 1-3.8h2.4c-.4 1.4-1.2 2.7-2.4 3.8h-1zm1.3-5.8c.1-1.4-.2-2.7-.7-3.8h3.1a8 8 0 0 1-2.4 3.8zm2.4-5.8h-3.1c-.1-1.4-.5-2.7-1-3.8A8 8 0 0 1 17.4 6.2z" />
            </svg>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noreferrer"
              className="whitespace-nowrap"
            >
              {personalInfo.linkedin}
            </a>{" "}
          </span>
        )}
      </div>

      <div className="h-px bg-slate-300 w-full mt-4" />
    </div>,
  );

  if (objective) {
    sections.push(
      <div key="about" className="text-left">
        <SectionHeading>About Me</SectionHeading>
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {objective}
        </p>
      </div>,
    );
  }

  if (education.length > 0) {
    education.forEach((edu, index) => {
      sections.push(
        <div
          key={`education-${edu.id}`}
          className={`text-left ${index > 0 ? "mt-3" : ""}`}
        >
          {index === 0 && <SectionHeading>Education</SectionHeading>}
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-bold text-slate-900">
                {formatDateSlash(edu.startDate)} -{" "}
                {formatDateSlash(edu.endDate)}
              </div>
              <div className="text-slate-600">{edu.institution}</div>
            </div>
            <div className="col-span-3">
              <h3 className="font-bold text-slate-900">
                {edu.degree}{" "}
                {edu.grade && (
                  <span className="font-normal text-slate-500 text-xs">
                    | {edu.grade}
                  </span>
                )}
              </h3>
            </div>
          </div>
        </div>,
      );
    });
  }

  // EXPERIENCE — per-entry atomic sections.
  if (experience.length > 0) {
    experience.forEach((exp, index) => {
      sections.push(
        <div
          key={`experience-${exp.id}`}
          className={`text-left ${index > 0 ? "mt-3" : ""}`}
        >
          {index === 0 && <SectionHeading>Experience</SectionHeading>}
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-bold text-slate-900">
                {formatDateSlash(exp.startDate)} -{formatDateSlash(exp.endDate)}
              </div>
              <div className="text-slate-600">{exp.company}</div>
            </div>
            <div className="col-span-3">
              <h3 className="font-bold text-slate-900">{exp.role}</h3>
              <p className="text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                {exp.description}
              </p>
            </div>
          </div>
        </div>,
      );
    });
  }

  // PROJECTS (INTEGRATED) — per-entry atomic sections.
  if (projects && projects.length > 0) {
    projects.forEach((proj, index) => {
      sections.push(
        <div
          key={`projects-${proj.id}`}
          className={`text-left ${index > 0 ? "mt-3" : ""}`}
        >
          {index === 0 && <SectionHeading>Projects</SectionHeading>}
          <div className="text-sm">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-slate-900">{proj.title}</h3>
              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 font-normal text-[12px] hover:underline"
                >
                  {proj.link}
                </a>
              )}
            </div>
            {proj.technologies?.length > 0 && (
              <div className="text-slate-500 font-medium text-xs mt-0.5">
                Technologies: {proj.technologies.join(", ")}
              </div>
            )}
            <p className="text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
              {proj.description}
            </p>
          </div>
        </div>,
      );
    });
  }

  if (additional.skills.length > 0) {
    sections.push(
      <div key="skills" className="text-left">
        <SectionHeading>Skills</SectionHeading>
        <ul className="grid grid-cols-4 gap-y-2 gap-x-4 text-sm text-slate-700 list-disc pl-4">
          {additional.skills.map((skill, index) => (
            <li key={index} className="font-medium">
              {skill}
            </li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additionalItems.length > 0) {
    sections.push(
      <div key="additional" className="text-left">
        <SectionHeading>Additional Information</SectionHeading>
        <ul className="space-y-1.5 text-sm text-slate-700 list-disc pl-4">
          {additionalItems.map((item, index) => (
            <li key={index}>
              <span className="font-bold text-slate-900">{item.label}:</span>{" "}
              {item.value}
            </li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.references.length > 0) {
    sections.push(
      <div key="references" className="text-left">
        <SectionHeading>References</SectionHeading>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {additional.references.map((ref, index) => {
            const [name, title, phone, social] = ref
              .split("|")
              .map((s) => s?.trim());
            return (
              <div key={index} className="flex justify-between gap-4 text-sm">
                <div>
                  <h3 className="font-bold text-slate-900">{name || ref}</h3>
                  {title && (
                    <p className="text-slate-600 text-xs mt-0.5">{title}</p>
                  )}
                </div>
                {(phone || social) && (
                  <div className="text-xs text-slate-600 space-y-1 shrink-0 text-right">
                    {phone && (
                      <p>
                        <span className="font-bold text-slate-900">Phone:</span>{" "}
                        {phone}
                      </p>
                    )}
                    {social && (
                      <p>
                        <span className="font-bold text-slate-900">
                          Social:
                        </span>{" "}
                        {social}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>,
    );
  }

  return (
    <PaginatedSheet
      sections={sections}
      pageClassName="text-slate-800 font-sans antialiased"
      pagePadding="18mm"
    />
  );
}
