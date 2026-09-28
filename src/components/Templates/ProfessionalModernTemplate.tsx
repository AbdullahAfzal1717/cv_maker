"use client";

import type { ResumeData } from "../../types/resume";
import { formatDateSlash } from "../../utils/formatDate";
import PaginatedSheet from "../common/PaginatedSheet";

function SidebarList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-0.5 mb-2">
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

export default function ProfessionalModernTemplate({
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
    <div>
      <div className="bg-slate-100 px-10 pt-10 pb-6">
        <h1 className="text-5xl font-black tracking-tight text-slate-900">
          {personalInfo.fullName || "Lorna Alvarado"}
        </h1>
        <p className="text-base font-medium tracking-[0.2em] text-slate-600 mt-1">
          {personalInfo.jobTitle || "Marketing Manager"}
        </p>
      </div>
      <div className="bg-slate-200 px-10 py-4 flex flex-wrap gap-x-10 gap-y-2 text-sm text-slate-700 font-medium">
        {personalInfo.phone && (
          <span className="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24 11.36 11.36 0 0 0 3.58.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.58 1 1 0 0 1-.25 1.01l-2.2 2.2z" />
            </svg>
            {personalInfo.phone}
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
        {personalInfo.address && (
          <span className="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
            </svg>
            {personalInfo.address}
          </span>
        )}
        {personalInfo.linkedin && (
          <span className="flex items-center gap-2 break-all">
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
    </div>
  );

  // LEFT COLUMN (sidebar)
  const leftSections: React.ReactNode[] = [];

  if (education.length > 0) {
    education.forEach((edu, index) => {
      leftSections.push(
        <div key={`edu-${edu.id}`} className={index > 0 ? "mt-3" : ""}>
          {index === 0 && (
            <h3 className="text-xl font-bold text-slate-900 mb-3">Education</h3>
          )}
          <div className="text-[13px]">
            <p className="font-bold text-slate-900">{edu.degree}</p>
            <p className="text-slate-600">{edu.institution}</p>
            <p className="text-slate-500">
              {formatDateSlash(edu.startDate)}-{formatDateSlash(edu.endDate)}
            </p>
          </div>
        </div>,
      );
    });
  }

  if (additional.skills.length > 0) {
    leftSections.push(
      <div key="skills" className="mt-6">
        <h3 className="text-xl font-bold text-slate-900 mb-3">Skills</h3>
        <ul className="text-[13px] space-y-2 list-disc pl-4 text-slate-700">
          {additional.skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.languages.length > 0) {
    leftSections.push(
      <div key="languages" className="mt-6">
        <h3 className="text-xl font-bold text-slate-900 mb-3">Language</h3>
        <ul className="text-[13px] space-y-2 list-disc pl-4 text-slate-700">
          {additional.languages.map((lang, i) => (
            <li key={i}>{lang}</li>
          ))}
        </ul>
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
      <div key="social" className="mt-6">
        <SidebarList title="Social Links" items={additional.socialLinks} />
      </div>,
    );
  }
  const rightSections: React.ReactNode[] = [];

  if (objective) {
    rightSections.push(
      <div key="profile-info">
        <h3 className="text-xl font-bold text-slate-900 mb-3">Profile</h3>
        <p className="text-[13px] text-slate-500 leading-relaxed whitespace-pre-line">
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
            index > 0 ? "mt-5" : rightSections.length > 0 ? "mt-8" : ""
          }
        >
          {index === 0 && (
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Work Experience
            </h3>
          )}
          <div className="text-[13px]">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-slate-900 text-base">
                {exp.company}
              </span>
              <span className="text-slate-800 font-bold text-xs tracking-wide whitespace-nowrap">
                {formatDateSlash(exp.startDate)}-{formatDateSlash(exp.endDate)}
              </span>
            </div>
            <p className="text-slate-700 mt-0.5">{exp.role}</p>
            <p className="text-slate-500 mt-1.5 whitespace-pre-line leading-relaxed">
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
          key={`proj-${proj.id}`}
          className={
            index > 0 ? "mt-5" : rightSections.length > 0 ? "mt-8" : ""
          }
        >
          {index === 0 && (
            <h3 className="text-xl font-bold text-slate-900 mb-3">Projects</h3>
          )}
          <div className="text-[13px]">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-slate-900 text-base">
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
            <p className="text-slate-500 mt-1.5 leading-relaxed">
              {proj.description}
            </p>
          </div>
        </div>,
      );
    });
  }

  if (additional.references.length > 0) {
    rightSections.push(
      <div key="references" className={rightSections.length > 0 ? "mt-8" : ""}>
        <h3 className="text-xl font-bold text-slate-900 mb-3">References</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {additional.references.map((ref, index) => {
            const [name, title, phone, email] = ref
              .split("|")
              .map((s) => s?.trim());
            return (
              <div key={index} className="text-[13px]">
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
      pageHeader={pageHeader}
      columns={[
        { sections: leftSections, widthFraction: 1 / 3, padding: "12mm" },
        {
          sections: rightSections,
          widthFraction: 2 / 3,
          padding: "12mm",
          className: "border-l border-slate-300",
        },
      ]}
    />
  );
}
