"use client";

import type { ResumeData } from "../../types/resume";
import { formatDateSlash } from "../../utils/formatDate";
import PaginatedSheet from "../common/PaginatedSheet";

function SectionPill({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-slate-200 px-5 py-2 rounded-full mb-3">
      <h2 className="text-sm font-bold uppercase tracking-widest italic text-slate-800">
        {children}
      </h2>
    </div>
  );
}

function toBullets(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

export default function MinimalProTemplate({ data }: { data: ResumeData }) {
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
  if (additional.references.length > 0)
    additionalItems.push({
      label: "References",
      value: additional.references.join(", "),
    });

  const sections: React.ReactNode[] = [];

  // NAME BANNER — always first, no top margin (page's own top)
  sections.push(
    <div key="header">
      <h1 className="text-5xl font-black tracking-tight text-slate-900 uppercase leading-none">
        {personalInfo.fullName || "DANIEL GALLEGO"}
      </h1>
      <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide mt-2">
        {personalInfo.jobTitle || "UX Designer"}
      </h2>
      <div className="text-sm text-slate-600 font-medium pt-3 mt-3 border-t border-slate-200 flex flex-wrap gap-x-2 gap-y-1">
        {personalInfo.address && <span>{personalInfo.address}</span>}
        {personalInfo.email && <span>| {personalInfo.email}</span>}
        {personalInfo.phone && <span>| {personalInfo.phone}</span>}
        {personalInfo.linkedin && (
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noreferrer"
            className="whitespace-nowrap"
          >
            {personalInfo.linkedin}
          </a>
        )}
      </div>
    </div>,
  );

  if (objective) {
    sections.push(
      <div key="summary" className="mt-6">
        <SectionPill>Summary</SectionPill>
        <p className="text-sm text-slate-700 leading-relaxed text-justify px-1">
          {objective}
        </p>
      </div>,
    );
  }

  if (additional.skills.length > 0) {
    sections.push(
      <div key="skills" className="mt-6">
        <SectionPill>Technical Skills</SectionPill>
        <div className="grid grid-cols-3 gap-x-6 gap-y-1.5 px-1 text-sm text-slate-700">
          {additional.skills.map((skill, index) => (
            <div key={index}>{skill}</div>
          ))}
        </div>
      </div>,
    );
  }

  if (experience.length > 0) {
    experience.forEach((exp, index) => {
      sections.push(
        <div
          key={`experience-${exp.id}`}
          className={index === 0 ? "mt-6" : "mt-4"}
        >
          {index === 0 && <SectionPill>Professional Experience</SectionPill>}
          <div className="text-sm px-1">
            <div className="flex justify-between items-baseline gap-4">
              <span className="font-bold text-slate-900">
                {exp.role}
                {exp.company && (
                  <span className="font-bold">, {exp.company}</span>
                )}
              </span>
              <span className="text-slate-800 font-bold text-sm whitespace-nowrap">
                {formatDateSlash(exp.startDate)}-{formatDateSlash(exp.endDate)}
              </span>
            </div>
            {exp.description && (
              <ul className="mt-1.5 space-y-1 list-disc pl-5 text-slate-700 leading-relaxed">
                {toBullets(exp.description).map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            )}
          </div>
        </div>,
      );
    });
  }

  // KEY PROJECTS — same per-entry atomic treatment as Experience.
  if (projects && projects.length > 0) {
    projects.forEach((proj, index) => {
      sections.push(
        <div
          key={`projects-${proj.id}`}
          className={index === 0 ? "mt-6" : "mt-4"}
        >
          {index === 0 && <SectionPill>Key Projects</SectionPill>}
          <div className="text-sm px-1">
            <div className="flex justify-between items-baseline gap-4">
              <span className="font-bold text-slate-900">
                {proj.title}
                {proj.technologies?.length > 0 && (
                  <span className="text-xs text-slate-500 font-normal ml-2">
                    ({proj.technologies.join(", ")})
                  </span>
                )}
              </span>
              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-600 hover:underline font-normal text-[12px] whitespace-nowrap pl-1"
                >
                  {proj.link}{" "}
                </a>
              )}
            </div>
            {proj.description && (
              <ul className="mt-1.5 space-y-1 list-disc pl-5 text-slate-700 leading-relaxed">
                {toBullets(proj.description).map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            )}
          </div>
        </div>,
      );
    });
  }

  // EDUCATION — same per-entry atomic treatment.
  if (education.length > 0) {
    education.forEach((edu, index) => {
      sections.push(
        <div
          key={`education-${edu.id}`}
          className={index === 0 ? "mt-6" : "mt-4"}
        >
          {index === 0 && <SectionPill>Education</SectionPill>}
          <div className="text-sm px-1">
            <div className="flex justify-between items-baseline gap-4">
              <span className="font-bold text-slate-900">{edu.degree}</span>
              <span className="text-slate-800 font-bold text-sm whitespace-nowrap">
                {formatDateSlash(edu.startDate)}-{formatDateSlash(edu.endDate)}
              </span>
            </div>
            <p className="text-slate-700 mt-0.5">
              {edu.institution} {edu.grade && `|  ${edu.grade}`}
            </p>
          </div>
        </div>,
      );
    });
  }

  if (additionalItems.length > 0) {
    sections.push(
      <div key="additional" className="mt-6">
        <SectionPill>Additional Information</SectionPill>
        <ul className="space-y-1.5 px-1 text-sm text-slate-700 list-disc pl-6">
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

  return (
    <PaginatedSheet
      sections={sections}
      pageClassName="text-slate-800 font-sans antialiased text-left"
    />
  );
}
