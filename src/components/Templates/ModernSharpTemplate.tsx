"use client";

import type { ResumeData } from "../../types/resume";
import { formatDateSlash } from "../../utils/formatDate";
import PaginatedSheet from "../common/PaginatedSheet";

export default function ModernSharpTemplate({ data }: { data: ResumeData }) {
  const {
    personalInfo,
    objective,
    education,
    experience,
    projects,
    additional,
  } = data;

  // LEFT NAVY SIDEBAR — atomic blocks
  const leftSections: React.ReactNode[] = [];

  leftSections.push(
    <div key="photo" className="p-1.5 bg-[#e8dcc8] rounded-md">
      <div className="border-2 border-[#e8dcc8] rounded overflow-hidden bg-slate-300 aspect-4/5">
        {personalInfo.profilePhoto ? (
          <img
            src={personalInfo.profilePhoto}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
            Photo
          </div>
        )}
      </div>
    </div>,
  );

  if (
    personalInfo.phone ||
    personalInfo.email ||
    personalInfo.address ||
    personalInfo.linkedin
  ) {
    leftSections.push(
      <div key="contact">
        <h3 className="text-xs font-bold uppercase text-white tracking-widest border-b border-slate-700 pb-1 mb-2">
          Contact
        </h3>
        <div className="space-y-2 text-[10.5px]">
          {personalInfo.phone && (
            <p className="flex items-center gap-2">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="shrink-0"
              >
                <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24 11.36 11.36 0 0 0 3.58.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.58 1 1 0 0 1-.25 1.01l-2.2 2.2z" />
              </svg>
              {personalInfo.phone}
            </p>
          )}
          {personalInfo.email && (
            <p className="flex items-center gap-2 break-all">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="shrink-0"
              >
                <path d="M2 5a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5zm2.4.5 7.6 6.34 7.6-6.34H4.4zM20 7.1l-7.4 6.17a1 1 0 0 1-1.28 0L4 7.1V18h16V7.1z" />
              </svg>
              {personalInfo.email}
            </p>
          )}
          {personalInfo.address && (
            <p className="flex items-center gap-2">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="shrink-0"
              >
                <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
              </svg>
              {personalInfo.address}
            </p>
          )}
          {personalInfo.linkedin && (
            <p className="flex items-center gap-2 break-all">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              {personalInfo.linkedin}
            </p>
          )}
        </div>
      </div>,
    );
  }

  if (additional.references.length > 0) {
    leftSections.push(
      <div key="references">
        <h3 className="text-xs font-bold uppercase text-white tracking-widest border-b border-slate-700 pb-1 mb-2">
          References
        </h3>
        <div className="space-y-3">
          {additional.references.map((ref, index) => {
            const [name, title, phone, email] = ref
              .split("|")
              .map((s) => s?.trim());
            return (
              <div key={index} className="text-[10.5px]">
                <p className="font-bold text-white">{name || ref}</p>
                {title && <p className="text-slate-400">{title}</p>}
                {phone && (
                  <p className="flex items-center gap-2 mt-1">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="shrink-0"
                    >
                      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24 11.36 11.36 0 0 0 3.58.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.58 1 1 0 0 1-.25 1.01l-2.2 2.2z" />
                    </svg>
                    {phone}
                  </p>
                )}
                {email && (
                  <p className="flex items-center gap-2">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="shrink-0"
                    >
                      <path d="M2 5a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5zm2.4.5 7.6 6.34 7.6-6.34H4.4zM20 7.1l-7.4 6.17a1 1 0 0 1-1.28 0L4 7.1V18h16V7.1z" />
                    </svg>
                    {email}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>,
    );
  }

  if (additional.skills.length > 0) {
    leftSections.push(
      <div key="skills">
        <h3 className="text-xs font-bold uppercase text-white tracking-widest border-b border-slate-700 pb-1 mb-2">
          Skills
        </h3>
        <div className="space-y-1.5 pt-1">
          {additional.skills.map((skill, i) => (
            <div key={i} className="flex items-center gap-2 text-[10.5px]">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                className="shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              {skill}
            </div>
          ))}
        </div>
      </div>,
    );
  }

  if (additional.languages.length > 0) {
    leftSections.push(
      <div key="languages">
        <h3 className="text-xs font-bold uppercase text-white tracking-widest border-b border-slate-700 pb-1 mb-2">
          Languages
        </h3>
        <div className="space-y-1 text-[10.5px]">
          {additional.languages.map((lang, i) => (
            <p key={i}>{lang}</p>
          ))}
        </div>
      </div>,
    );
  }

  if (additional.software.length > 0) {
    leftSections.push(
      <div key="software">
        <h3 className="text-xs font-bold uppercase text-white tracking-widest border-b border-slate-700 pb-1 mb-2">
          Software
        </h3>
        <ul className="space-y-1 list-disc pl-4 text-[10.5px]">
          {additional.software.map((sw, i) => (
            <li key={i}>{sw}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.certificates.length > 0) {
    leftSections.push(
      <div key="certificates">
        <h3 className="text-xs font-bold uppercase text-white tracking-widest border-b border-slate-700 pb-1 mb-2">
          Certifications
        </h3>
        <ul className="space-y-1 list-disc pl-4 text-[10.5px]">
          {additional.certificates.map((cert, i) => (
            <li key={i}>{cert}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.publications.length > 0) {
    leftSections.push(
      <div key="publications">
        <h3 className="text-xs font-bold uppercase text-white tracking-widest border-b border-slate-700 pb-1 mb-2">
          Publications
        </h3>
        <ul className="space-y-1 list-disc pl-4 text-[10.5px]">
          {additional.publications.map((pub, i) => (
            <li key={i}>{pub}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.interests.length > 0) {
    leftSections.push(
      <div key="interests">
        <h3 className="text-xs font-bold uppercase text-white tracking-widest border-b border-slate-700 pb-1 mb-2">
          Interests
        </h3>
        <ul className="space-y-1 list-disc pl-4 text-[10.5px]">
          {additional.interests.map((interest, i) => (
            <li key={i}>{interest}</li>
          ))}
        </ul>
      </div>,
    );
  }

  // RIGHT MAIN COLUMN
  const rightSections: React.ReactNode[] = [];

  rightSections.push(
    <div key="header" className="bg-[#1e293b] text-white px-8 py-8 mx-[-8mm]">
      <h1 className="text-3xl font-black uppercase tracking-wider wrap-break-word leading-tight pr-6">
        {personalInfo.fullName || "MARIANA NAPOLITANI"}
      </h1>
      <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mt-1">
        {personalInfo.jobTitle || "MARKETING MANAGER"}
      </p>
    </div>,
  );

  if (objective) {
    rightSections.push(
      <div key="about">
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-heading mb-2">
          About Me
        </h3>
        <p className="text-slate-600 leading-relaxed whitespace-pre-line">
          {objective}
        </p>
      </div>,
    );
  }

  if (education.length > 0) {
    education.forEach((edu, index) => {
      rightSections.push(
        <div key={`edu-${edu.id}`} className={index > 0 ? "mt-3" : ""}>
          {index === 0 && (
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-heading mb-3">
              Education
            </h3>
          )}
          <ul className="space-y-3 list-disc pl-4">
            <li>
              <p className="font-bold text-text-headinging">{edu.degree}</p>
              <p className="font-bold text-slate-700">
                {edu.institution} — {formatDateSlash(edu.startDate)}-
                {formatDateSlash(edu.endDate)}
              </p>
              {edu.grade && (
                <p className="text-slate-500 text-[10px]">{edu.grade}</p>
              )}
            </li>
          </ul>
        </div>,
      );
    });
  }

  if (experience.length > 0) {
    experience.forEach((exp, index) => {
      rightSections.push(
        <div key={`exp-${exp.id}`} className={index > 0 ? "mt-3" : ""}>
          {index === 0 && (
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-headinging mb-3">
              Experience
            </h3>
          )}
          <ul className="space-y-3 list-disc pl-4">
            <li className="text-slate-700">
              <p className="font-bold text-text-heading">{exp.role}</p>
              <p className="font-bold text-slate-700">
                {exp.company} | {formatDateSlash(exp.startDate)}-
                {formatDateSlash(exp.endDate)}
              </p>
              <p className="text-slate-600 mt-1 whitespace-pre-line leading-relaxed">
                {exp.description}
              </p>
            </li>
          </ul>
        </div>,
      );
    });
  }

  if (projects && projects.length > 0) {
    projects.forEach((proj, index) => {
      rightSections.push(
        <div key={`proj-${proj.id}`} className={index > 0 ? "mt-3" : ""}>
          {index === 0 && (
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-heading mb-3">
              Projects
            </h3>
          )}
          <ul className="space-y-3 list-disc pl-4">
            <li className="text-slate-700">
              <p className="font-bold text-text-heading">
                {proj.title}{" "}
                {proj.technologies?.length > 0 && (
                  <span className="font-normal text-slate-600">
                    ({proj.technologies.join(", ")})
                  </span>
                )}
              </p>
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
              <p className="text-slate-600 mt-1 leading-relaxed">
                {proj.description}
              </p>
            </li>
          </ul>
        </div>,
      );
    });
  }

  return (
    <PaginatedSheet
      pageClassName="text-[#1e293b] font-sans antialiased "
      columns={[
        {
          sections: leftSections,
          widthFraction: 0.35,
          padding: "10mm",
          className: "bg-text-heading text-slate-300",
        },
        {
          sections: rightSections,
          widthFraction: 0.65,
          padding: "12mm",
          className: "bg-[#f8fafc]",
        },
      ]}
    />
  );
}
