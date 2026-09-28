"use client";

import type { ResumeData } from "../../types/resume";
import { formatDateSlash } from "../../utils/formatDate";
import PaginatedSheet from "../common/PaginatedSheet";

function SidebarList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#112d4e] border-b border-slate-300 pb-1 mb-2">
        {title}
      </h3>
      <ul className="text-[11px] space-y-1 list-disc pl-4 text-slate-600">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function toBullets(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

const HEADER_HEIGHT = "56mm";

export default function ModernCleanTemplate({ data }: { data: ResumeData }) {
  const {
    personalInfo,
    objective,
    education,
    experience,
    projects,
    additional,
  } = data;

  const leftSections: React.ReactNode[] = [];

  leftSections.push(
    <div
      key="header-photo"
      className="bg-[#dbe2ef] flex items-center"
      style={{
        height: HEADER_HEIGHT,
        margin: "-8mm -8mm 0 -8mm",
        paddingLeft: "10mm",
      }}
    >
      <div className="w-40 h-40 rounded-full bg-slate-200 overflow-hidden shrink-0 border-4 border-white shadow-md">
        {personalInfo.profilePhoto ? (
          <img
            src={personalInfo.profilePhoto}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
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
      <div key="contact" className="space-y-3 text-[12px] text-slate-600 mt-8">
        {personalInfo.phone && (
          <p className="flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {personalInfo.phone}
          </p>
        )}
        {personalInfo.email && (
          <p className="flex items-center gap-2 break-all">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M16 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm0 0v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-4.5 7.79" />
            </svg>
            {personalInfo.email}
          </p>
        )}
        {personalInfo.address && (
          <p className="flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {personalInfo.address}
          </p>
        )}
        {personalInfo.linkedin && (
          <p className="flex items-center gap-2 break-all">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noreferrer"
              className="whitespace-nowrap"
            >
              {personalInfo.linkedin}
            </a>{" "}
          </p>
        )}
      </div>,
    );
  }

  if (education.length > 0) {
    education.forEach((edu, index) => {
      leftSections.push(
        <div
          key={`education-${edu.id}`}
          className={index > 0 ? "mt-3" : "mt-8"}
        >
          {index === 0 && (
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#112d4e] border-b border-slate-300 pb-1 mb-2">
              Education
            </h3>
          )}
          <div className="text-[12px]">
            <p className="text-slate-800">{edu.degree}</p>
            <p className="font-bold text-slate-900">{edu.institution}</p>
            <p className="text-[11px] text-slate-500">
              {formatDateSlash(edu.startDate)}-{formatDateSlash(edu.endDate)}
            </p>
            {edu.grade && (
              <p className="text-[11px] text-slate-500">{edu.grade}</p>
            )}
          </div>
        </div>,
      );
    });
  }

  if (additional.skills.length > 0) {
    leftSections.push(
      <div key="skills" className="mt-8">
        <SidebarList title="Skills" items={additional.skills} />
      </div>,
    );
  }

  if (additional.languages.length > 0) {
    leftSections.push(
      <div key="languages" className="mt-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#112d4e] border-b border-slate-300 pb-1 mb-2">
          Language
        </h3>
        <div className="space-y-1 text-[12px] text-slate-600">
          {additional.languages.map((lang, i) => (
            <p key={i}>{lang}</p>
          ))}
        </div>
      </div>,
    );
  }

  if (additional.software.length > 0) {
    leftSections.push(
      <div key="software" className="mt-8">
        <SidebarList title="Software" items={additional.software} />
      </div>,
    );
  }
  if (additional.certificates.length > 0) {
    leftSections.push(
      <div key="certificates" className="mt-8">
        <SidebarList title="Certifications" items={additional.certificates} />
      </div>,
    );
  }
  if (additional.publications.length > 0) {
    leftSections.push(
      <div key="publications" className="mt-8">
        <SidebarList title="Publications" items={additional.publications} />
      </div>,
    );
  }
  if (additional.interests.length > 0) {
    leftSections.push(
      <div key="interests" className="mt-8">
        <SidebarList title="Interests" items={additional.interests} />
      </div>,
    );
  }
  if (additional.socialLinks.length > 0) {
    leftSections.push(
      <div key="social-links" className="mt-8 pb-8">
        <SidebarList title="Social Links" items={additional.socialLinks} />
      </div>,
    );
  }
  const rightSections: React.ReactNode[] = [];

  rightSections.push(
    <div
      key="header"
      className="bg-[#dbe2ef] rounded-br-[3rem] flex items-center"
      style={{
        height: HEADER_HEIGHT,
        margin: "-8mm -8mm 0 -8mm",
        paddingLeft: "10mm",
      }}
    >
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-[#112d4e]">
          {personalInfo.fullName || "DONNA STROUPE"}
        </h1>
        <p className="text-xl font-semibold text-slate-600 mt-1">
          {personalInfo.jobTitle || "Sales Representative"}
        </p>
      </div>
    </div>,
  );

  if (objective) {
    rightSections.push(
      <div key="about" className="mt-8">
        <h3 className="text-2xl font-bold text-[#112d4e] border-b border-slate-300 pb-2 mb-3">
          About Me
        </h3>
        <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-line">
          {objective}
        </p>
      </div>,
    );
  }

  if (experience.length > 0) {
    experience.forEach((exp, index) => {
      rightSections.push(
        <div
          key={`experience-${exp.id}`}
          className={index > 0 ? "mt-4" : "mt-8"}
        >
          {index === 0 && (
            <h3 className="text-2xl font-bold text-[#112d4e] border-b border-slate-300 pb-2 mb-3">
              Work Experience
            </h3>
          )}
          <div className="text-[14px]">
            <p className="text-slate-400 font-medium">
              {formatDateSlash(exp.startDate)}-{formatDateSlash(exp.endDate)}
            </p>
            <p className="text-slate-500">{exp.company}</p>
            <p className="text-lg font-semibold text-slate-800 mt-0.5">
              {exp.role}
            </p>
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

  if (projects && projects.length > 0) {
    projects.forEach((proj, index) => {
      rightSections.push(
        <div key={`project-${proj.id}`} className={index > 0 ? "mt-4" : "mt-8"}>
          {index === 0 && (
            <h3 className="text-2xl font-bold text-[#112d4e] border-b border-slate-300 pb-2 mb-3">
              Projects
            </h3>
          )}
          <div className="text-[12px] ">
            <div className="flex justify-between items-baseline">
              <span className="text-lg font-semibold text-slate-800">
                {proj.title}
                {proj.technologies?.length > 0 && (
                  <span className="text-xs font-normal text-slate-600 ml-2">
                    ({proj.technologies.join(", ")})
                  </span>
                )}
              </span>
              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-600 hover:underline font-normal text-[12px] whitespace-nowrap pl-1 "
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

  if (additional.references.length > 0) {
    rightSections.push(
      <div key="references" className="mt-8 pb-8">
        <h3 className="text-2xl font-bold text-[#112d4e] border-b border-slate-300 pb-2 mb-3">
          References
        </h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {additional.references.map((ref, index) => {
            const [name, title, phone, email] = ref
              .split("|")
              .map((s) => s?.trim());
            return (
              <div key={index} className="text-[12px]">
                <p className="font-bold text-slate-900">{name || ref}</p>
                {title && <p className="text-slate-600">{title}</p>}
                {phone && (
                  <p className="mt-1">
                    <span className="font-bold">Phone:</span> {phone}
                  </p>
                )}
                {email && (
                  <p>
                    <span className="font-bold">Email:</span> {email}
                  </p>
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
      pageClassName="text-slate-800 font-sans antialiased"
      columns={[
        {
          sections: leftSections,
          widthFraction: 1 / 3,
          // NOTE: single value only — see SimpleStructuredTemplate for
          // why a shorthand value here silently breaks pagination.
          padding: "8mm",
          className: "bg-[#e9edf4]",
        },
        {
          sections: rightSections,
          widthFraction: 2 / 3,
          padding: "8mm",
          className: "bg-white",
        },
      ]}
    />
  );
}
