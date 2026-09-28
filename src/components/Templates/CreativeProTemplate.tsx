"use client";

import type { ResumeData } from "../../types/resume";
import { Phone, Mail, Globe, MapPin } from "lucide-react";
import PaginatedSheet from "../common/PaginatedSheet";
import { formatDateSlash } from "../../utils/formatDate";

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-slate-300 rounded-full text-center font-bold uppercase tracking-[0.15em] py-2 px-4 text-slate-900 text-[11px] mb-4">
      {children}
    </div>
  );
}

export default function CreativeProTemplate({ data }: { data: ResumeData }) {
  const {
    personalInfo,
    objective,
    education,
    experience,
    projects,
    additional,
  } = data;

  const pageHeader = (
    <div className="bg-[#4a4c56] text-white p-8 flex items-center gap-8 rounded-b-3xl">
      {personalInfo.profilePhoto && (
        <img
          src={personalInfo.profilePhoto}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover shrink-0"
        />
      )}
      <div>
        <h1 className="text-4xl font-black tracking-tight">
          {personalInfo.fullName || "Lorna Alvarado"}
        </h1>
        <p className="text-base tracking-[0.2em] text-slate-300 mt-2 font-medium">
          {(personalInfo.jobTitle || "Marketing Manager")
            .toUpperCase()
            .split("")}
        </p>
      </div>
    </div>
  );

  // LEFT SIDEBAR (1/3) — about me, contact, objective, education, skills, etc.
  const leftSections: React.ReactNode[] = [];

  leftSections.push(
    <div key="about-me" className="pt-6">
      <SectionHeader>About Me</SectionHeader>
      <div className="space-y-3">
        {personalInfo.phone && (
          <div className="flex items-center gap-2 text-slate-600">
            <Phone size={13} className="text-slate-500 shrink-0" />
            <span>{personalInfo.phone}</span>
          </div>
        )}
        {personalInfo.email && (
          <div className="flex items-center gap-2 text-slate-600">
            <Mail size={13} className="text-slate-500 shrink-0" />
            <span className="break-all">{personalInfo.email}</span>
          </div>
        )}
        {personalInfo.address && (
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin size={13} className="text-slate-500 shrink-0" />
            <span>{personalInfo.address}</span>
          </div>
        )}
        {personalInfo.linkedin && (
          <div className="flex items-center gap-2 text-slate-600">
            <Globe size={13} className="text-slate-500 shrink-0" />
            <span className="break-all">{personalInfo.linkedin}</span>
          </div>
        )}
      </div>
      {objective && (
        <p className="text-slate-600 leading-relaxed text-[10.5px] whitespace-pre-line mt-3">
          {objective}
        </p>
      )}
    </div>,
  );

  if (education.length > 0) {
    education.forEach((edu, index) => {
      leftSections.push(
        <div key={`edu-${edu.id}`} className={index > 0 ? "mt-3" : "mt-8"}>
          {index === 0 && <SectionHeader>Education</SectionHeader>}
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-slate-900 text-[12px]">
                {edu.degree}
              </p>
              <p className="text-slate-700 font-bold text-[10.5px] mt-0.5">
                {edu.institution}
              </p>
              {edu.grade && (
                <p className="text-slate-500 text-[10px] mt-0.5">{edu.grade}</p>
              )}
              <p className="text-slate-500 text-[10px] mt-0.5">
                {formatDateSlash(edu.startDate)}-{formatDateSlash(edu.endDate)}
              </p>
            </div>
          </div>
        </div>,
      );
    });
  }

  if (additional.skills.length > 0) {
    leftSections.push(
      <div key="skills" className="mt-8">
        <SectionHeader>Skills</SectionHeader>
        <ul className="space-y-2 list-disc pl-4 text-slate-600 text-[10.5px]">
          {additional.skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.languages?.length > 0) {
    leftSections.push(
      <div key="languages" className="mt-8">
        <SectionHeader>Languages</SectionHeader>
        <ul className="space-y-2 list-disc pl-4 text-slate-600 text-[10.5px]">
          {additional.languages.map((lang, i) => (
            <li key={i}>{lang}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.software?.length > 0) {
    leftSections.push(
      <div key="software" className="mt-8">
        <SectionHeader>Software</SectionHeader>
        <ul className="space-y-2 list-disc pl-4 text-slate-600 text-[10.5px]">
          {additional.software.map((sw, i) => (
            <li key={i}>{sw}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.interests?.length > 0) {
    leftSections.push(
      <div key="interests" className="mt-8">
        <SectionHeader>Interests</SectionHeader>
        <ul className="space-y-2 list-disc pl-4 text-slate-600 text-[10.5px]">
          {additional.interests.map((interest, i) => (
            <li key={i}>{interest}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.socialLinks?.length > 0) {
    leftSections.push(
      <div key="social-links" className="mt-8">
        <SectionHeader>Social Links</SectionHeader>
        <ul className="space-y-1.5 text-slate-600 text-[10.5px]">
          {additional.socialLinks.map((link, i) => (
            <li key={i} className="break-all">
              {link}
            </li>
          ))}
        </ul>
      </div>,
    );
  }

  // RIGHT MAIN COLUMN (2/3) — experience, projects, certificates, etc.
  const rightSections: React.ReactNode[] = [];

  if (experience.length > 0) {
    experience.forEach((exp, index) => {
      rightSections.push(
        <div key={`exp-${exp.id}`} className={index > 0 ? "mt-5" : "pt-6"}>
          {index === 0 && <SectionHeader>Experience</SectionHeader>}
          <div>
            <div className="flex justify-between items-baseline gap-4">
              <span className="font-bold text-slate-900 uppercase tracking-wide text-[12px]">
                {exp.role}
              </span>
              <span className="text-slate-700 font-bold text-[11px] whitespace-nowrap">
                {formatDateSlash(exp.startDate)}-{formatDateSlash(exp.endDate)}
              </span>
            </div>
            <p className="font-bold text-slate-800 text-[11px] mt-0.5">
              {exp.company}
            </p>
            <p className="text-slate-600 mt-1.5 whitespace-pre-line text-[10.5px] leading-relaxed">
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
            index > 0 ? "mt-5" : rightSections.length > 0 ? "mt-8" : "pt-6"
          }
        >
          {index === 0 && <SectionHeader>Projects</SectionHeader>}
          <div>
            <div className="flex justify-between items-baseline gap-4">
              <span className="font-bold text-slate-900 text-[12px]">
                {proj.title}{" "}
                {proj.technologies?.length > 0 && (
                  <span className="text-[9.5px] font-normal text-slate-400">
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
            <p className="text-slate-600 mt-1.5 text-[10.5px] leading-relaxed">
              {proj.description}
            </p>
          </div>
        </div>,
      );
    });
  }

  if (additional.certificates?.length > 0) {
    rightSections.push(
      <div
        key="certificates"
        className={rightSections.length > 0 ? "mt-8" : "pt-6"}
      >
        <SectionHeader>Certificates</SectionHeader>
        <ul className="space-y-1.5 list-disc pl-4 text-slate-600 text-[10.5px]">
          {additional.certificates.map((cert, i) => (
            <li key={i}>{cert}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.publications?.length > 0) {
    rightSections.push(
      <div
        key="publications"
        className={rightSections.length > 0 ? "mt-8" : "pt-6"}
      >
        <SectionHeader>Publications</SectionHeader>
        <ul className="space-y-1.5 list-disc pl-4 text-slate-600 text-[10.5px]">
          {additional.publications.map((pub, i) => (
            <li key={i}>{pub}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.references?.length > 0) {
    rightSections.push(
      <div
        key="references"
        className={rightSections.length > 0 ? "mt-8" : "pt-6"}
      >
        <SectionHeader>References</SectionHeader>
        <div className="grid grid-cols-2 gap-6">
          {additional.references.map((ref, i) => (
            <p
              key={i}
              className="text-slate-600 text-[10.5px] whitespace-pre-line leading-relaxed"
            >
              {ref}
            </p>
          ))}
        </div>
      </div>,
    );
  }

  return (
    <PaginatedSheet
      pageClassName="font-sans antialiased bg-white text-[11px]"
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
