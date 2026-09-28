"use client";

import type { ResumeData } from "../../types/resume";
import { formatDateSlash } from "../../utils/formatDate";
import PaginatedSheet from "../common/PaginatedSheet";

function SidebarList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#5b7c8d] border-b border-slate-400 pb-1 mb-2">
        {title}
      </h3>
      <ul className="space-y-1 list-disc pl-4 text-slate-600">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function CreativeEdgeTemplate({ data }: { data: ResumeData }) {
  const {
    personalInfo,
    objective,
    education,
    experience,
    projects,
    additional,
  } = data;

  const pageHeader = (
    <div>
      <div className="pt-8 pb-3 pl-[70mm] pr-6">
        <h1 className="text-3xl font-black text-[#5b7c8d] tracking-wide uppercase">
          {personalInfo.fullName || "LORNA ALVARADO"}
        </h1>
      </div>
      <div className="bg-text-muted text-white py-2 pl-[70mm] pr-6 tracking-widest font-semibold uppercase text-xs">
        {personalInfo.jobTitle || "Marketing Manager"}
      </div>
    </div>
  );

  // LEFT SIDEBAR — atomic blocks for independent pagination
  const leftSections: React.ReactNode[] = [];

  leftSections.push(
    <div
      key="photo"
      className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-sm relative z-20"
    >
      {personalInfo.profilePhoto ? (
        <img
          src={personalInfo.profilePhoto}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500 text-xs">
          Photo
        </div>
      )}
    </div>,
  );

  if (
    personalInfo.phone ||
    personalInfo.email ||
    personalInfo.address ||
    personalInfo.linkedin
  ) {
    leftSections.push(
      <div key="contact" className="mt-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#5b7c8d] border-b border-slate-400 pb-1 mb-2">
          Contact
        </h3>
        <div className="space-y-1.5 text-slate-600">
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

  if (education.length > 0) {
    education.forEach((edu, index) => {
      leftSections.push(
        <div key={`edu-${edu.id}`} className={index > 0 ? "mt-3" : "mt-6"}>
          {index === 0 && (
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5b7c8d] border-b border-slate-400 pb-1 mb-2">
              Education
            </h3>
          )}
          <div>
            <p className="font-bold text-slate-800">
              {formatDateSlash(edu.startDate)}-{formatDateSlash(edu.endDate)}
            </p>
            <p className="font-semibold text-slate-700 uppercase text-[10px]">
              {edu.institution}
            </p>
            <ul className="list-disc pl-4 text-slate-600 mt-1">
              <li>{edu.degree}</li>
              {edu.grade && <li>{edu.grade}</li>}
            </ul>
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
  if (additional.socialLinks.length > 0) {
    leftSections.push(
      <div key="social-links" className="mt-6">
        <SidebarList title="Social Links" items={additional.socialLinks} />
      </div>,
    );
  }

  // RIGHT MAIN COLUMN
  const rightSections: React.ReactNode[] = [];

  if (objective) {
    rightSections.push(
      <div key="profile" className="pt-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#5b7c8d] border-b border-slate-300 pb-0.5 mb-2">
          Profile
        </h3>
        <p className="text-slate-600 leading-relaxed whitespace-pre-line">
          {objective}
        </p>
      </div>,
    );
  }

  if (experience.length > 0) {
    experience.forEach((exp, index) => {
      rightSections.push(
        <div
          key={`exp-${exp.id}`}
          className={
            index > 0 ? "mt-4" : rightSections.length > 0 ? "mt-6" : "pt-6"
          }
        >
          {index === 0 && (
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5b7c8d] border-b border-slate-300 pb-0.5 mb-3">
              Work Experience
            </h3>
          )}
          <div className="relative pl-4 ml-1">
            <div className="absolute left-0 top-1 bottom-1 w-px bg-slate-200" />
            <div className="relative">
              <div className="absolute -left-4.25 top-1 bg-[#5b7c8d] w-2 h-2 rounded-sm z-10" />
              <div className="flex justify-between font-bold text-slate-800">
                <span>
                  {exp.company}{" "}
                  <span className="font-normal text-slate-500">
                    | {exp.role}
                  </span>
                </span>
                <span className="text-slate-400 font-normal whitespace-nowrap">
                  {formatDateSlash(exp.startDate)}-
                  {formatDateSlash(exp.endDate)}
                </span>
              </div>
              {exp.description && (
                <ul className="mt-1 space-y-0.5 list-disc pl-4 text-slate-600 text-[10.5px] leading-relaxed">
                  {exp.description
                    .split("\n")
                    .map(
                      (line, i) =>
                        line.trim() && (
                          <li key={i}>
                            {line.replace(/^[-•*]\s*/, "").trim()}
                          </li>
                        ),
                    )}
                </ul>
              )}
            </div>
          </div>
        </div>,
      );
    });
  }

  if (projects && projects.length > 0) {
    projects.forEach((proj, index) => {
      rightSections.push(
        <div
          key={`proj-${proj.id}`}
          className={
            index > 0 ? "mt-4" : rightSections.length > 0 ? "mt-6" : "pt-6"
          }
        >
          {index === 0 && (
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5b7c8d] border-b border-slate-300 pb-0.5 mb-3">
              Projects
            </h3>
          )}
          <div className="relative pl-4 ml-1">
            <div className="absolute left-0 top-1 bottom-1 w-px bg-slate-200" />
            <div className="relative">
              <div className="absolute -left-4.25 top-1 bg-[#5b7c8d] w-2 h-2 rounded-sm z-10" />
              <div className="flex justify-between font-bold text-slate-800">
                <span>
                  {proj.title}{" "}
                  {proj.technologies?.length > 0 && (
                    <span className="text-[9.5px] font-normal text-slate-600">
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
              <p className="text-slate-600 mt-1 text-[10.5px] leading-relaxed">
                {proj.description}
              </p>
            </div>
          </div>
        </div>,
      );
    });
  }

  if (additional.references.length > 0) {
    rightSections.push(
      <div
        key="references"
        className={rightSections.length > 0 ? "mt-6" : "pt-6"}
      >
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#5b7c8d] border-b border-slate-300 pb-0.5 mb-3">
          Reference
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {additional.references.map((ref, index) => {
            const [name, title, phone, email] = ref
              .split("|")
              .map((s) => s?.trim());
            return (
              <div key={index}>
                <p className="font-bold text-slate-800">{name || ref}</p>
                {title && <p className="text-slate-500">{title}</p>}
                {phone && (
                  <p className="mt-0.5">
                    <span className="font-semibold">Phone:</span> {phone}
                  </p>
                )}
                {email && (
                  <p>
                    <span className="font-semibold">Email:</span> {email}
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
      pageClassName="text-slate-700 font-sans antialiased "
      pageHeader={pageHeader}
      columns={[
        {
          sections: leftSections,
          widthFraction: 1 / 3,
          padding: "10mm",
          className: "bg-[#e2e8f0]",
        },
        {
          sections: rightSections,
          widthFraction: 2 / 3,
          padding: "10mm",
          className: "bg-white",
        },
      ]}
    />
  );
}
