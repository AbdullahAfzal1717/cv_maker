"use client";

import type { ResumeData } from "../../types/resume";
import { Phone, Mail, Globe, MapPin } from "lucide-react";
import PaginatedSheet from "../common/PaginatedSheet";
import { formatDateSlash } from "../../utils/formatDate";

export default function ModernProfessionalTemplate({
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

  const leftSections: React.ReactNode[] = [];

  leftSections.push(
    <div key="header">
      {personalInfo.profilePhoto && (
        <img
          src={personalInfo.profilePhoto}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover mb-4"
        />
      )}
      <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
        {personalInfo.fullName || "OLIVIA WILSON"}
      </h1>
      <p className="text-base text-slate-500 mt-1">
        {personalInfo.jobTitle || "Marketing Manager"}
      </p>
    </div>,
  );

  if (experience.length > 0) {
    experience.forEach((exp, index) => {
      leftSections.push(
        <div key={`exp-${exp.id}`} className={index > 0 ? "mt-5" : "mt-8"}>
          {index === 0 && (
            <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-2 mb-4">
              Work Experience
            </h3>
          )}
          <div>
            <div className="flex justify-between items-baseline gap-4">
              <span className="font-bold text-slate-900 text-[13px]">
                {exp.role}
              </span>
              <span className="text-slate-500 text-[10.5px] whitespace-nowrap">
                {formatDateSlash(exp.startDate)}-{formatDateSlash(exp.endDate)}
              </span>
            </div>
            <p className="font-bold text-slate-800 text-[11.5px] mt-0.5">
              {exp.company}
            </p>
            <p className="text-slate-500 mt-1.5 whitespace-pre-line text-[10.5px] leading-relaxed">
              {exp.description}
            </p>
          </div>
        </div>,
      );
    });
  }

  if (projects && projects.length > 0) {
    projects.forEach((proj, index) => {
      leftSections.push(
        <div key={`proj-${proj.id}`} className={index > 0 ? "mt-5" : "mt-8"}>
          {index === 0 && (
            <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-2 mb-4">
              Projects
            </h3>
          )}
          <div>
            <div className="flex justify-between items-baseline gap-4">
              <span className="font-bold text-slate-900 text-[13px]">
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
            <p className="text-slate-500 mt-1.5 text-[10.5px] leading-relaxed">
              {proj.description}
            </p>
          </div>
        </div>,
      );
    });
  }

  if (additional.certificates?.length > 0) {
    leftSections.push(
      <div key="certificates" className="mt-8">
        <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-2 mb-4">
          Certificates
        </h3>
        <ul className="space-y-1.5 list-disc pl-4 text-slate-500 text-[10.5px]">
          {additional.certificates.map((cert, i) => (
            <li key={i}>{cert}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.publications?.length > 0) {
    leftSections.push(
      <div key="publications" className="mt-8">
        <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-2 mb-4">
          Publications
        </h3>
        <ul className="space-y-1.5 list-disc pl-4 text-slate-500 text-[10.5px]">
          {additional.publications.map((pub, i) => (
            <li key={i}>{pub}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.references?.length > 0) {
    leftSections.push(
      <div key="references" className="mt-8">
        <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-2 mb-4">
          References
        </h3>
        <div className="grid grid-cols-2 gap-6">
          {additional.references.map((ref, i) => (
            <p
              key={i}
              className="text-slate-500 text-[10.5px] whitespace-pre-line leading-relaxed"
            >
              {ref}
            </p>
          ))}
        </div>
      </div>,
    );
  }

  // RIGHT SIDEBAR COLUMN (1/3) — contacts, about me, education, skills, etc.
  const rightSections: React.ReactNode[] = [];

  if (
    personalInfo.phone ||
    personalInfo.email ||
    personalInfo.linkedin ||
    personalInfo.address
  ) {
    rightSections.push(
      <div key="contacts">
        <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-2 mb-4">
          Contacts
        </h3>
        <div className="space-y-3">
          {personalInfo.phone && (
            <div className="flex items-center gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center">
                <Phone size={12} className="text-white" />
              </span>
              <span className="text-[10.5px] text-slate-600">
                {personalInfo.phone}
              </span>
            </div>
          )}
          {personalInfo.email && (
            <div className="flex items-center gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center">
                <Mail size={12} className="text-white" />
              </span>
              <span className="text-[10.5px] text-slate-600 break-all">
                {personalInfo.email}
              </span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center">
                <Globe size={12} className="text-white" />
              </span>
              <span className="text-[10.5px] text-slate-600 break-all">
                {personalInfo.linkedin}
              </span>
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-center gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center">
                <MapPin size={12} className="text-white" />
              </span>
              <span className="text-[10.5px] text-slate-600">
                {personalInfo.address}
              </span>
            </div>
          )}
        </div>
      </div>,
    );
  }

  if (objective) {
    rightSections.push(
      <div key="about" className="mt-8">
        <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-2 mb-3">
          About Me
        </h3>
        <p className="text-slate-500 leading-relaxed whitespace-pre-line text-[10.5px]">
          {objective}
        </p>
      </div>,
    );
  }

  if (education.length > 0) {
    education.forEach((edu, index) => {
      rightSections.push(
        <div key={`edu-${edu.id}`} className={index > 0 ? "mt-3" : "mt-8"}>
          {index === 0 && (
            <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-2 mb-3">
              Education
            </h3>
          )}
          <div className="text-[10.5px]">
            <p className="font-bold text-slate-900 text-[11.5px]">
              {edu.degree}
            </p>
            <p className="text-slate-500 mt-0.5">{edu.institution}</p>
            {edu.grade && (
              <p className="text-slate-400 text-[9.5px] mt-0.5">{edu.grade}</p>
            )}
            <p className="text-slate-400 text-[9.5px] mt-0.5">
              {formatDateSlash(edu.startDate)}-{formatDateSlash(edu.endDate)}
            </p>
          </div>
        </div>,
      );
    });
  }

  if (additional.skills.length > 0) {
    rightSections.push(
      <div key="skills" className="mt-8">
        <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-2 mb-3">
          Skills
        </h3>
        <ul className="space-y-2 list-disc pl-4 text-slate-500 text-[10.5px]">
          {additional.skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.languages?.length > 0) {
    rightSections.push(
      <div key="languages" className="mt-8">
        <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-2 mb-3">
          Languages
        </h3>
        <ul className="space-y-2 list-disc pl-4 text-slate-500 text-[10.5px]">
          {additional.languages.map((lang, i) => (
            <li key={i}>{lang}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.software?.length > 0) {
    rightSections.push(
      <div key="software" className="mt-8">
        <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-2 mb-3">
          Software
        </h3>
        <ul className="space-y-2 list-disc pl-4 text-slate-500 text-[10.5px]">
          {additional.software.map((sw, i) => (
            <li key={i}>{sw}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.interests?.length > 0) {
    rightSections.push(
      <div key="interests" className="mt-8">
        <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-2 mb-3">
          Interests
        </h3>
        <ul className="space-y-2 list-disc pl-4 text-slate-500 text-[10.5px]">
          {additional.interests.map((interest, i) => (
            <li key={i}>{interest}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.socialLinks?.length > 0) {
    rightSections.push(
      <div key="social-links" className="mt-8">
        <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-800 pb-2 mb-3">
          Social Links
        </h3>
        <ul className="space-y-1.5 pl-0 text-slate-500 text-[10.5px]">
          {additional.socialLinks.map((link, i) => (
            <li key={i} className="break-all">
              {link}
            </li>
          ))}
        </ul>
      </div>,
    );
  }

  return (
    <PaginatedSheet
      pageClassName="font-sans antialiased bg-white"
      columns={[
        {
          sections: leftSections,
          widthFraction: 2 / 3,
          padding: "12mm",
          className: "bg-white",
        },
        {
          sections: rightSections,
          widthFraction: 1 / 3,
          padding: "10mm",
          className: "bg-white",
        },
      ]}
    />
  );
}
