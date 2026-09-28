"use client";

import type { ResumeData } from "../../types/resume";
import { formatDateSlash } from "../../utils/formatDate";
import PaginatedSheet from "../common/PaginatedSheet";

function SidebarList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-1 mb-2">
        {title}
      </h3>
      <ul className="text-xs space-y-1.5 list-disc pl-4 text-slate-700">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function SectionHeadingRule({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <h3 className="text-xl font-bold text-slate-900 whitespace-nowrap">
        {children}
      </h3>
      <div className="h-px bg-slate-300 grow" />
    </div>
  );
}

export default function SimpleFocusTemplate({ data }: { data: ResumeData }) {
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
      key="photo"
      className="w-full aspect-4/5 rounded-full overflow-hidden bg-slate-300 "
    >
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
    </div>,
  );

  if (education.length > 0) {
    education.forEach((edu, index) => {
      leftSections.push(
        <div key={`edu-${edu.id}`} className={index > 0 ? "mt-3" : "mt-6"}>
          {index === 0 && (
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-1 mb-2">
              Education
            </h3>
          )}
          <div className="text-xs">
            <p className="text-slate-500 font-medium">
              {formatDateSlash(edu.startDate)}-{formatDateSlash(edu.endDate)}
            </p>
            <p className="font-bold text-slate-900 uppercase">{edu.degree}</p>
            <p className="font-bold text-slate-900 uppercase">
              {edu.institution}
            </p>
            {edu.grade && <p className="text-slate-600"> {edu.grade}</p>}
          </div>
        </div>,
      );
    });
  }

  if (additional.skills.length > 0) {
    leftSections.push(
      <div key="skills" className="mt-6">
        <SidebarList title="Skills" items={additional.skills} />
      </div>,
    );
  }
  if (additional.languages.length > 0) {
    leftSections.push(
      <div key="languages" className="mt-6">
        <SidebarList title="Languages" items={additional.languages} />
      </div>,
    );
  }
  if (additional.software.length > 0) {
    leftSections.push(
      <div key="software" className="mt-6">
        <SidebarList title="Software" items={additional.software} />
      </div>,
    );
  }
  if (additional.certificates.length > 0) {
    leftSections.push(
      <div key="certificates" className="mt-6">
        <SidebarList title="Certifications" items={additional.certificates} />
      </div>,
    );
  }
  if (additional.publications.length > 0) {
    leftSections.push(
      <div key="publications" className="mt-6">
        <SidebarList title="Publications" items={additional.publications} />
      </div>,
    );
  }
  if (additional.interests.length > 0) {
    leftSections.push(
      <div key="interests" className="mt-6">
        <SidebarList title="Interests" items={additional.interests} />
      </div>,
    );
  }

  if (
    personalInfo.phone ||
    personalInfo.email ||
    personalInfo.address ||
    personalInfo.linkedin
  ) {
    leftSections.push(
      <div key="contact" className="mt-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-1 mb-2">
          Contact
        </h3>
        <div className="text-xs space-y-2 text-slate-700">
          {personalInfo.phone && (
            <p className="flex items-center gap-2">
              <svg
                width="13"
                height="13"
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
                width="13"
                height="13"
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
                width="13"
                height="13"
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

  const rightSections: React.ReactNode[] = [];

  rightSections.push(
    <div
      key="header"
      className="bg-[#6b6b64] text-white px-10 py-10"
      style={{ margin: "-12mm -12mm 0 -12mm" }}
    >
      <h1 className="text-5xl font-light leading-tight">
        {(personalInfo.fullName || "Jonathan Patterson")
          .split(" ")
          .map((word, i, arr) => (
            <span
              key={i}
              className={i === arr.length - 1 ? "block font-black" : "block"}
            >
              {word}
            </span>
          ))}
      </h1>
      <p className="text-xl font-light tracking-[0.3em] mt-4">
        {personalInfo.jobTitle || "Art Director"}
      </p>
    </div>,
  );

  if (objective) {
    rightSections.push(
      <div key="profile-info" className="mt-8">
        <SectionHeadingRule>Profile Info</SectionHeadingRule>
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {objective}
        </p>
      </div>,
    );
  }

  if (experience.length > 0) {
    experience.forEach((exp, index) => {
      rightSections.push(
        <div key={`exp-${exp.id}`} className={index > 0 ? "mt-6" : "mt-8"}>
          {index === 0 && <SectionHeadingRule>Experience</SectionHeadingRule>}
          <div className="relative pl-6">
            <div className="absolute left-1.25 top-2 bottom-2 w-px bg-slate-800" />
            <div className="relative text-sm">
              <div className="absolute -left-6 top-1 bg-white border-2 border-slate-800 rounded-full w-3 h-3 z-10" />
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-slate-900 uppercase text-sm">
                  {exp.role}
                </span>
                <span className="text-slate-500 text-sm whitespace-nowrap">
                  {formatDateSlash(exp.startDate)}-
                  {formatDateSlash(exp.endDate)}
                </span>
              </div>
              <p className="font-bold text-slate-900 uppercase text-sm">
                {exp.company}
              </p>
              <p className="text-slate-600 mt-1 whitespace-pre-line leading-relaxed">
                {exp.description}
              </p>
            </div>
          </div>
        </div>,
      );
    });
  }

  if (projects && projects.length > 0) {
    projects.forEach((proj, index) => {
      rightSections.push(
        <div key={`proj-${proj.id}`} className={index > 0 ? "mt-4" : "mt-8"}>
          {index === 0 && <SectionHeadingRule>Projects</SectionHeadingRule>}
          <div className="text-sm">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-slate-900">
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
                  className="text-blue-400 hover:text-blue-600 hover:underline font-normal text-[12px] whitespace-nowrap pl-1"
                >
                  {proj.link}{" "}
                </a>
              )}
            </div>
            <p className="text-slate-600 mt-1 leading-relaxed">
              {proj.description}
            </p>
          </div>
        </div>,
      );
    });
  }

  if (additional.references.length > 0) {
    rightSections.push(
      <div key="references" className="mt-8">
        <SectionHeadingRule>References</SectionHeadingRule>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {additional.references.map((ref, index) => {
            const [name, title, phone, email] = ref
              .split("|")
              .map((s) => s?.trim());
            return (
              <div key={index} className="text-sm">
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
          widthFraction: 0.35,
          padding: "12mm",
          className: "bg-slate-200",
        },
        {
          sections: rightSections,
          widthFraction: 0.65,
          padding: "12mm",
          className: "bg-white",
        },
      ]}
    />
  );
}
