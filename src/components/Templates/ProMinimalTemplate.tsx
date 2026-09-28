"use client";

import type { ResumeData } from "../../types/resume";
import { formatDateSlash } from "../../utils/formatDate";
import PaginatedSheet from "../common/PaginatedSheet";

function DarkSectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-bold uppercase tracking-wider text-[#ea580c] border-b-2 border-[#ea580c] pb-1 mb-2">
      {children}
    </h3>
  );
}

function LightSectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
      {children}
    </h3>
  );
}

export default function ProMinimalTemplate({ data }: { data: ResumeData }) {
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
    <div key="name" className="relative" style={{ zIndex: 1 }}>
      <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase wrap-break-word">
        {personalInfo.fullName || "DANIEL GALLEGO"}
      </h1>
      <p className="text-sm font-bold tracking-widest text-[#ea580c] uppercase mt-1">
        {personalInfo.jobTitle || "GRAPHIC DESIGNER"}
      </p>
    </div>,
  );

  if (objective) {
    leftSections.push(
      <div key="about" className="mt-6">
        <LightSectionHeader>About Me</LightSectionHeader>
        <p className="text-slate-600 leading-relaxed whitespace-pre-line">
          {objective}
        </p>
      </div>,
    );
  }

  if (experience.length > 0) {
    experience.forEach((exp, index) => {
      leftSections.push(
        <div
          key={`experience-${exp.id}`}
          className={index > 0 ? "mt-4" : "mt-6"}
        >
          {index === 0 && <LightSectionHeader>Experience</LightSectionHeader>}
          <p className="font-bold text-slate-900">{exp.role}</p>
          <p className="font-bold text-slate-700">
            {exp.company} | {formatDateSlash(exp.startDate)}-
            {formatDateSlash(exp.endDate)}
          </p>
          {exp.description && (
            <ul className="mt-1.5 space-y-0.5 list-disc pl-4 text-slate-600 text-[10.5px] leading-relaxed">
              {exp.description
                .split("\n")
                .map(
                  (line, i) =>
                    line.trim() && (
                      <li key={i}>{line.replace(/^[-•*]\s*/, "").trim()}</li>
                    ),
                )}
            </ul>
          )}
        </div>,
      );
    });
  }

  if (projects && projects.length > 0) {
    projects.forEach((proj, index) => {
      leftSections.push(
        <div key={`project-${proj.id}`} className={index > 0 ? "mt-4" : "mt-6"}>
          {index === 0 && <LightSectionHeader>Projects</LightSectionHeader>}
          <div className="flex justify-between font-bold text-slate-900">
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
        </div>,
      );
    });
  }

  if (additional.references.length > 0) {
    leftSections.push(
      <div key="references" className="mt-6 pb-4">
        <LightSectionHeader>Reference</LightSectionHeader>
        <div className="space-y-3">
          {additional.references.map((ref, index) => {
            const [name, title, phone, email] = ref
              .split("|")
              .map((s) => s?.trim());
            return (
              <div key={index}>
                <p className="font-bold text-slate-900">{name || ref}</p>
                {title && <p className="font-bold text-slate-700">{title}</p>}
                {phone && (
                  <p className="mt-1 text-slate-600">
                    <span className="font-semibold">Phone:</span> {phone}
                  </p>
                )}
                {email && (
                  <p className="text-slate-600">
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

  const rightSections: React.ReactNode[] = [];

  rightSections.push(
    <div
      key="photo"
      className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[#ea580c] shadow-md bg-white"
      style={{ zIndex: 1 }}
    >
      {personalInfo.profilePhoto ? (
        <img
          src={personalInfo.profilePhoto}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
          Photo
        </div>
      )}
    </div>,
  );

  if (education.length > 0) {
    education.forEach((edu, index) => {
      rightSections.push(
        <div
          key={`education-${edu.id}`}
          className={index > 0 ? "mt-3" : "mt-6"}
        >
          {index === 0 && <DarkSectionHeader>Education</DarkSectionHeader>}
          <p className="font-bold text-white">{edu.degree}</p>
          <p className="text-slate-200">
            {formatDateSlash(edu.startDate)}-{formatDateSlash(edu.endDate)} |{" "}
            {edu.institution}
          </p>
          {edu.grade && <p className="text-slate-200">{edu.grade}</p>}
        </div>,
      );
    });
  }

  if (additional.skills.length > 0) {
    rightSections.push(
      <div key="skills" className="mt-6">
        <DarkSectionHeader>Skills</DarkSectionHeader>
        <ul className="space-y-1.5 list-disc pl-4 text-slate-300">
          {additional.skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.languages.length > 0) {
    rightSections.push(
      <div key="languages" className="mt-6">
        <DarkSectionHeader>Language</DarkSectionHeader>
        <ul className="space-y-1.5 list-disc pl-4 text-slate-300">
          {additional.languages.map((lang, i) => (
            <li key={i}>{lang}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.software.length > 0) {
    rightSections.push(
      <div key="software" className="mt-6">
        <DarkSectionHeader>Software</DarkSectionHeader>
        <ul className="space-y-1.5 list-disc pl-4 text-slate-300">
          {additional.software.map((sw, i) => (
            <li key={i}>{sw}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.certificates.length > 0) {
    rightSections.push(
      <div key="certificates" className="mt-6">
        <DarkSectionHeader>Certifications</DarkSectionHeader>
        <ul className="space-y-1.5 list-disc pl-4 text-slate-300">
          {additional.certificates.map((cert, i) => (
            <li key={i}>{cert}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.publications.length > 0) {
    rightSections.push(
      <div key="publications" className="mt-6">
        <DarkSectionHeader>Publications</DarkSectionHeader>
        <ul className="space-y-1.5 list-disc pl-4 text-slate-300">
          {additional.publications.map((pub, i) => (
            <li key={i}>{pub}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.interests.length > 0) {
    rightSections.push(
      <div key="interests" className="mt-6">
        <DarkSectionHeader>Interests</DarkSectionHeader>
        <ul className="space-y-1.5 list-disc pl-4 text-slate-300">
          {additional.interests.map((interest, i) => (
            <li key={i}>{interest}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.socialLinks.length > 0) {
    rightSections.push(
      <div key="social-links" className="mt-6">
        <DarkSectionHeader>Social Links</DarkSectionHeader>
        <ul className="space-y-1.5 text-slate-300 break-all">
          {additional.socialLinks.map((link, i) => (
            <li key={i}>{link}</li>
          ))}
        </ul>
      </div>,
    );
  }

  rightSections.push(
    <div key="contact" className="mt-6 pb-4">
      <DarkSectionHeader>Contact</DarkSectionHeader>
      <div className="space-y-1.5 text-slate-300">
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

  return (
    <PaginatedSheet
      pageClassName="text-slate-800 font-sans antialiased bg-[#fdf6ee] "
      columns={[
        {
          sections: leftSections,
          widthFraction: 0.55,
          padding: "21mm 10mm 12mm 10mm",
          className:
            "bg-[#fdf6ee] pm-wave-top-left pm-wave-bottom-left overflow-hidden",
        },
        {
          sections: rightSections,
          widthFraction: 0.45,
          padding: "21mm 10mm 12mm 10mm",
          className:
            "bg-[#271610] text-slate-300 pm-wave-top-right pm-wave-bottom-right overflow-hidden",
        },
      ]}
    />
  );
}
