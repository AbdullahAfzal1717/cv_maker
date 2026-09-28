"use client";

import { useMemo } from "react";
import Image from "next/image";
import type { ResumeData } from "../../types/resume";
import { formatDateSlash } from "../../utils/formatDate";
import PaginatedSheet from "../common/PaginatedSheet";

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-7">
    <h2 className="text-2xl font-bold uppercase tracking-tight text-slate-900">
      {children}
    </h2>
    <div className="border-t border-slate-300 mt-2 mb-3"></div>
  </div>
);

export default function ClassicCleanTemplate({ data }: { data: ResumeData }) {
  const {
    personalInfo,
    objective,
    education,
    experience,
    projects,
    additional,
  } = data;

  const sections: React.ReactNode[] = useMemo(() => {
    const built: React.ReactNode[] = [];

    // HEADER + CONTACT (always the first block on page 1)
    built.push(
      <div key="header">
        <div className="flex items-start gap-6">
          <div className="w-28 h-28 md:w-32 md:h-32 bg-slate-100 rounded overflow-hidden shrink-0 flex items-center justify-center">
            {personalInfo.profilePhoto ? (
              <Image
                src={personalInfo.profilePhoto}
                alt="Profile"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-slate-300 text-xs">Photo</span>
            )}
          </div>
          <div className="flex-1 pt-1">
            <h1 className="text-4xl font-extrabold uppercase tracking-tight text-slate-900 leading-tight">
              {personalInfo.fullName || "SHARYA SINGH"}
            </h1>
            <p className="text-lg text-slate-500 mt-1">
              {personalInfo.jobTitle || "Web Designer"}
            </p>
          </div>
        </div>

        <div className="border-t-2 border-slate-800 mt-5"></div>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-2 py-4 text-sm text-slate-700">
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full border border-slate-800 flex items-center justify-center shrink-0">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full border border-slate-800 flex items-center justify-center shrink-0">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 6c0-1.1-.9-2-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6z" />
                  <path d="m22 6-10 7L2 6" />
                </svg>
              </span>
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full border border-slate-800 flex items-center justify-center shrink-0">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </span>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                className="whitespace-nowrap"
              >
                {personalInfo.linkedin}
              </a>
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full border border-slate-800 flex items-center justify-center shrink-0">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <span>{personalInfo.address}</span>
            </div>
          )}
        </div>
        <div className="border-t-2 border-slate-800"></div>
      </div>,
    );

    if (objective) {
      built.push(
        <div key="about" className="mt-6">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-slate-900">
            About Me
          </h2>
          <div className="border-t border-slate-300 mt-2 mb-3"></div>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {objective}
          </p>
        </div>,
      );
    }

    if (education.length > 0) {
      education.forEach((edu, index) => {
        built.push(
          <div key={`education-${edu.id}`} className={index > 0 ? "mt-4" : ""}>
            {index === 0 && <SectionHeading>Education</SectionHeading>}
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="text-slate-500">
                {formatDateSlash(edu.startDate)}-{formatDateSlash(edu.endDate)}
              </div>
              <div className="col-span-3">
                <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                <p className="text-slate-600 mt-1">
                  {edu.institution} {edu.grade && `•  ${edu.grade}`}
                </p>
              </div>
            </div>
          </div>,
        );
      });
    }

    if (experience.length > 0) {
      experience.forEach((exp, index) => {
        built.push(
          <div key={`experience-${exp.id}`} className={index > 0 ? "mt-4" : ""}>
            {index === 0 && <SectionHeading>Experience</SectionHeading>}
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="text-slate-500">
                {formatDateSlash(exp.startDate)}-{formatDateSlash(exp.endDate)}
              </div>
              <div className="col-span-3">
                <h3 className="font-bold text-slate-900">{exp.role}</h3>
                <p className="text-slate-700 font-medium text-sm">
                  {exp.company}
                </p>
                <p className="text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
            </div>
          </div>,
        );
      });
    }

    if (projects.length > 0) {
      projects.forEach((proj, index) => {
        built.push(
          <div key={`projects-${proj.id}`} className={index > 0 ? "mt-4" : ""}>
            {index === 0 && <SectionHeading>Projects Portfolio</SectionHeading>}
            <div className="text-sm">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-slate-900">{proj.title}</h3>
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
              {proj.technologies?.length > 0 && (
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Tech Stack: {proj.technologies.join(", ")}
                </p>
              )}
              <p className="text-slate-600 mt-1 leading-relaxed">
                {proj.description}
              </p>
            </div>
          </div>,
        );
      });
    }

    if (additional.skills.length > 0) {
      built.push(
        <div key="skills">
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

    if (
      additional.languages.length > 0 ||
      additional.software.length > 0 ||
      additional.interests.length > 0 ||
      additional.certificates.length > 0 ||
      additional.publications.length > 0 ||
      additional.socialLinks.length > 0 ||
      additional.references.length > 0
    ) {
      built.push(
        <div key="additional-information">
          <SectionHeading>Additional Information</SectionHeading>

          <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
            {additional.languages.length > 0 && (
              <li key="languages">
                <span className="font-semibold text-slate-900">Languages:</span>{" "}
                {additional.languages.join(", ")}
              </li>
            )}

            {additional.software.length > 0 && (
              <li key="software">
                <span className="font-semibold text-slate-900">Software:</span>{" "}
                {additional.software.join(", ")}
              </li>
            )}

            {additional.interests.length > 0 && (
              <li key="interests">
                <span className="font-semibold text-slate-900">Interests:</span>{" "}
                {additional.interests.join(", ")}
              </li>
            )}

            {additional.certificates.length > 0 && (
              <li key="certificates">
                <span className="font-semibold text-slate-900">
                  Certifications:
                </span>{" "}
                {additional.certificates.join(", ")}
              </li>
            )}

            {additional.publications.length > 0 && (
              <li key="publications">
                <span className="font-semibold text-slate-900">
                  Publications:
                </span>{" "}
                {additional.publications.join(", ")}
              </li>
            )}

            {additional.references.length > 0 && (
              <li key="references">
                <span className="font-semibold text-slate-900">
                  References:
                </span>{" "}
                {additional.references.map((ref, index) => {
                  const [name] = ref.split("|").map((s) => s.trim());

                  return (
                    <span key={index}>
                      {name}
                      {index !== additional.references.length - 1 ? ", " : ""}
                    </span>
                  );
                })}
              </li>
            )}
          </ul>
        </div>,
      );
    }

    return built;
  }, [personalInfo, objective, education, experience, projects, additional]);

  return (
    <PaginatedSheet
      sections={sections}
      pageClassName="text-slate-800 font-sans antialiased"
    />
  );
}
