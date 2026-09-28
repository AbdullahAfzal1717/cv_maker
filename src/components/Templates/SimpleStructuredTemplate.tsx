"use client";

import type { ResumeData } from "../../types/resume";
import { formatDateSlash } from "../../utils/formatDate";
import PaginatedSheet from "../common/PaginatedSheet";

function TimelineIcon({ path }: { path: string }) {
  return (
    <div className="absolute -left-3.5  bg-[#2d3748] rounded-full w-6 h-6 flex items-center justify-center z-10">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
        <path d={path} />
      </svg>
    </div>
  );
}

const ICONS = {
  profile:
    "M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.4 0-8 2.2-8 5v3h16v-3c0-2.8-3.6-5-8-5z",
  briefcase:
    "M9 2a2 2 0 0 0-2 2v1H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3V4a2 2 0 0 0-2-2H9zm0 3V4h6v1H9zM4 9h16v2H4V9z",
  folder: "M10 4H2v16h20V6H12l-2-2z",
  cap: "M12 2 1 8l11 6 9-4.9V17h2V8L12 2zM5 13.18v3.09C5 18.7 8.13 20 12 20s7-1.3 7-3.73v-3.09l-7 3.82-7-3.82z",
};

function SidebarTagList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-[#2d3748] border-b border-[#cbd5e1] pb-1 mb-2">
        {title}
      </h3>
      <ul className="text-xs space-y-1.5 list-disc pl-4 text-[#4a5568]">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function SimpleStructuredTemplate({
  data,
}: {
  data: ResumeData;
}) {
  const {
    personalInfo,
    objective,
    education,
    experience,
    projects,
    additional,
  } = data;


  const pageHeader = (
    <div className="border-b-2 border-[#4a5568] px-[18mm] pt-[18mm] pb-3">
      <h1 className="text-4xl font-bold tracking-wide text-[#2d3748] uppercase">
        {personalInfo.fullName || "AHMDD SAAH"}
      </h1>
      <p className="text-sm tracking-widest text-[#718096] uppercase font-medium mt-1">
        {personalInfo.jobTitle || "Marketing Manager"}
      </p>
    </div>
  );
  const leftSections: React.ReactNode[] = [];

  if (
    personalInfo.phone ||
    personalInfo.email ||
    personalInfo.address ||
    personalInfo.linkedin
  ) {
    leftSections.push(
      <div key="contact">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#2d3748] border-b border-[#cbd5e1] pb-1 mb-2">
          Contact
        </h3>
        <div className="text-xs space-y-2.5 text-[#4a5568]">
          {personalInfo.phone && (
            <p className="flex items-center gap-2">
              <svg
                width="13"
                height="13"
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
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="shrink-0"
              >
                <path d="M22 6c0-1.1-.9-2-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6z" />
                <path d="m22 6-10 7L2 6" />
              </svg>
              {personalInfo.email}
            </p>
          )}
          {personalInfo.address && (
            <p className="flex items-center gap-2">
              <svg
                width="13"
                height="13"
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
                width="13"
                height="13"
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
        </div>
      </div>,
    );
  }

  if (additional.skills.length > 0) {
    leftSections.push(
      <div key="skills" className="mt-6">
        <SidebarTagList title="Skills" items={additional.skills} />
      </div>,
    );
  }
  if (additional.languages.length > 0) {
    leftSections.push(
      <div key="languages" className="mt-6">
        <SidebarTagList title="Languages" items={additional.languages} />
      </div>,
    );
  }
  if (additional.software.length > 0) {
    leftSections.push(
      <div key="software" className="mt-6">
        <SidebarTagList title="Software" items={additional.software} />
      </div>,
    );
  }
  if (additional.certificates.length > 0) {
    leftSections.push(
      <div key="certificates" className="mt-6">
        <SidebarTagList
          title="Certifications"
          items={additional.certificates}
        />
      </div>,
    );
  }
  if (additional.publications.length > 0) {
    leftSections.push(
      <div key="publications" className="mt-6">
        <SidebarTagList title="Publications" items={additional.publications} />
      </div>,
    );
  }
  if (additional.interests.length > 0) {
    leftSections.push(
      <div key="interests" className="mt-6">
        <SidebarTagList title="Interests" items={additional.interests} />
      </div>,
    );
  }
  if (additional.socialLinks.length > 0) {
    leftSections.push(
      <div key="social-links" className="mt-6">
        <SidebarTagList title="Social Links" items={additional.socialLinks} />
      </div>,
    );
  }

  if (additional.references.length > 0) {
    leftSections.push(
      <div key="references" className="mt-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#2d3748] border-b border-[#cbd5e1] pb-1 mb-2">
          Reference
        </h3>
        <div className="space-y-3">
          {additional.references.map((ref, index) => {
            const [name, title, phone, contact] = ref
              .split("|")
              .map((s) => s?.trim());
            return (
              <div key={index} className="text-xs">
                <p className="font-bold text-[#2d3748]">{name || ref}</p>
                {title && <p className="text-[#718096]">{title}</p>}
                {phone && (
                  <p className="mt-0.5">
                    <span className="font-semibold">Phone:</span> {phone}
                  </p>
                )}
                {contact && (
                  <p>
                    <span className="font-semibold">Email:</span> {contact}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>,
    );
  }

  const rightSections: React.ReactNode[] = [];

  if (objective) {
    rightSections.push(
      <div
        key="profile"
        className="relative border-l-2 border-[#cbd5e1] pl-4.5 mt-6"
      >
        <TimelineIcon path={ICONS.profile} />
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#2d3748] mb-2">
          Profile
        </h3>
        <p className="text-xs text-[#4a5568] leading-relaxed whitespace-pre-line">
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
          className={`relative border-l-2 border-[#cbd5e1] pl-4.5 ${
            index > 0 ? "mt-4" : "mt-6"
          }`}
        >
          {index === 0 && (
            <>
              <TimelineIcon path={ICONS.briefcase} />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2d3748] mb-3">
                Work Experience
              </h3>
            </>
          )}
          <div className="text-xs">
            <div className="flex justify-between font-bold text-[#2d3748]">
              <span>
                {exp.company} —{" "}
                <span className="font-normal text-[#718096]">{exp.role}</span>
              </span>
              <span className="text-slate-500 font-normal whitespace-nowrap">
                {formatDateSlash(exp.startDate)}-{formatDateSlash(exp.endDate)}
              </span>
            </div>
            <p className="text-[#4a5568] mt-1 whitespace-pre-line text-[11px] leading-relaxed">
              {exp.description}
            </p>
          </div>
        </div>,
      );
    });
  }

  if (projects && projects.length > 0) {
    projects.forEach((proj, index) => {
      rightSections.push(
        <div
          key={`project-${proj.id}`}
          className={`relative border-l-2 border-[#cbd5e1] pl-4.5 ${
            index > 0 ? "mt-4" : "mt-6"
          }`}
        >
          {index === 0 && (
            <>
              <TimelineIcon path={ICONS.folder} />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2d3748] mb-3">
                Projects
              </h3>
            </>
          )}
          <div className="text-xs">
            <div className="flex justify-between font-bold text-[#2d3748]">
              <span>
                {proj.title}{" "}
                {proj.technologies?.length > 0 && (
                  <span className="text-[10px] font-normal text-slate-500">
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
            <p className="text-[#4a5568] mt-1 text-[11px] leading-relaxed">
              {proj.description}
            </p>
          </div>
        </div>,
      );
    });
  }

  if (education.length > 0) {
    education.forEach((edu, index) => {
      rightSections.push(
        <div
          key={`education-${edu.id}`}
          className={`relative border-l-2 border-[#cbd5e1] pl-4.5 pb-1 ${
            index > 0 ? "mt-3" : "mt-6"
          }`}
        >
          {index === 0 && (
            <>
              <TimelineIcon path={ICONS.cap} />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#2d3748] mb-3">
                Education
              </h3>
            </>
          )}
          <div className="text-xs flex justify-between">
            <div>
              <h4 className="font-bold text-[#2d3748]">{edu.degree}</h4>
              <p className="text-[#718096]">
                {edu.institution} {edu.grade && `• ${edu.grade}`}
              </p>
            </div>
            <span className="text-slate-500 text-[11px] whitespace-nowrap">
              {formatDateSlash(edu.startDate)}-{formatDateSlash(edu.endDate)}
            </span>
          </div>
        </div>,
      );
    });
  }

  return (
    <PaginatedSheet
      pageClassName="text-[#333333] font-sans antialiased text-left"
      pageHeader={pageHeader}
      columns={[
        {
          
          sections: leftSections,
          widthFraction: 1 / 3,
          padding: "12mm",
          className: "bg-white",
        },
        {
          sections: rightSections,
          widthFraction: 2 / 3,
          padding: "12mm",
          className: "bg-white",
        },
      ]}
    />
  );
}
