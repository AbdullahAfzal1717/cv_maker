"use client";

import type { ResumeData } from "../../types/resume";
import { formatDateSlash } from "../../utils/formatDate";
import PaginatedSheet from "../common/PaginatedSheet";

export default function SharpEdgeTemplate({ data }: { data: ResumeData }) {
  const {
    personalInfo,
    objective,
    education,
    experience,
    projects,
    additional,
  } = data;

  // LEFT SIDE PANEL — atomic blocks for independent pagination
  const leftSections: React.ReactNode[] = [];

  leftSections.push(
    <div
      key="photo"
      className="w-full aspect-square overflow-hidden border-4 border-black rounded-2xl shadow-inner bg-white"
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

  if (
    personalInfo.phone ||
    personalInfo.email ||
    personalInfo.address ||
    personalInfo.linkedin
  ) {
    leftSections.push(
      <div key="contact">
        <h3 className="text-sm font-black uppercase tracking-wide border-b-2 border-black pb-0.5 mb-2">
          Contact
        </h3>
        <div className="space-y-2 font-medium">
          {personalInfo.phone && (
            <p>
              <strong>Phone</strong>
              <br />
              {personalInfo.phone}
            </p>
          )}
          {personalInfo.email && (
            <p className="break-all">
              <strong>Email</strong>
              <br />
              {personalInfo.email}
            </p>
          )}
          {personalInfo.address && (
            <p>
              <strong>Address</strong>
              <br />
              {personalInfo.address}
            </p>
          )}
          {personalInfo.linkedin && (
            <p className="break-all">
              <strong>LinkedIn</strong>
              <br />
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
        <div key={`edu-${edu.id}`} className={index > 0 ? "mt-3" : ""}>
          {index === 0 && (
            <h3 className="text-sm font-black uppercase tracking-wide border-b-2 border-black pb-0.5 mb-2">
              Education
            </h3>
          )}
          <div className="font-medium">
            <p className="text-slate-600 font-bold">
              {formatDateSlash(edu.startDate)}-{formatDateSlash(edu.endDate)}
            </p>
            <p className="text-black font-extrabold">{edu.degree}</p>
            <p className="text-slate-700 italic">{edu.institution}</p>
            {edu.grade && <p className="text-slate-600">{edu.grade}</p>}
          </div>
        </div>,
      );
    });
  }

  if (additional.skills.length > 0) {
    leftSections.push(
      <div key="skills">
        <h3 className="text-sm font-black uppercase tracking-wide border-b-2 border-black pb-0.5 mb-2">
          Skills
        </h3>
        <ul className="space-y-1 list-disc pl-4 font-medium">
          {additional.skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.languages.length > 0) {
    leftSections.push(
      <div key="languages">
        <h3 className="text-sm font-black uppercase tracking-wide border-b-2 border-black pb-0.5 mb-2">
          Language
        </h3>
        <div className="space-y-1 font-bold">
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
        <h3 className="text-sm font-black uppercase tracking-wide border-b-2 border-black pb-0.5 mb-2">
          Software
        </h3>
        <ul className="space-y-1 list-disc pl-4 font-medium">
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
        <h3 className="text-sm font-black uppercase tracking-wide border-b-2 border-black pb-0.5 mb-2">
          Certifications
        </h3>
        <ul className="space-y-1 list-disc pl-4 font-medium">
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
        <h3 className="text-sm font-black uppercase tracking-wide border-b-2 border-black pb-0.5 mb-2">
          Publications
        </h3>
        <ul className="space-y-1 list-disc pl-4 font-medium">
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
        <h3 className="text-sm font-black uppercase tracking-wide border-b-2 border-black pb-0.5 mb-2">
          Interests
        </h3>
        <ul className="space-y-1 list-disc pl-4 font-medium">
          {additional.interests.map((interest, i) => (
            <li key={i}>{interest}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.socialLinks.length > 0) {
    leftSections.push(
      <div key="social-links">
        <h3 className="text-sm font-black uppercase tracking-wide border-b-2 border-black pb-0.5 mb-2">
          Social Links
        </h3>
        <ul className="space-y-1 font-medium break-all">
          {additional.socialLinks.map((link, i) => (
            <li key={i}>{link}</li>
          ))}
        </ul>
      </div>,
    );
  }

  // RIGHT MAIN COLUMN — name/title is first item (stays on page 1)
  const rightSections: React.ReactNode[] = [];

  rightSections.push(
    <div key="header" className="pb-2">
      <h1 className="text-4xl font-black uppercase tracking-tight leading-none mb-1">
        {personalInfo.fullName || "Aron Loeb"}
      </h1>
      <h2 className="text-sm font-bold uppercase tracking-widest text-slate-600 mb-4">
        {personalInfo.jobTitle || "Marketing Manager"}
      </h2>
      {objective && (
        <p className="text-slate-700 leading-relaxed font-medium">
          {objective}
        </p>
      )}
    </div>,
  );

  if (experience.length > 0) {
    experience.forEach((exp, index) => {
      rightSections.push(
        <div
          key={`exp-${exp.id}`}
          className={
            index > 0 ? "mt-5" : rightSections.length > 0 ? "mt-6" : ""
          }
        >
          {index === 0 && (
            <h3 className="text-base font-black uppercase border-b-2 border-black pb-0.5 mb-3">
              Experience
            </h3>
          )}
          <div className="relative border-l-2 border-slate-400 pl-4">
            <div className="absolute -left-[21px] -top-0.5 bg-slate-800 rounded-full w-2 h-2" />
            <p className="font-bold text-slate-500">
              {formatDateSlash(exp.startDate)}-{formatDateSlash(exp.endDate)}
            </p>
            <p className="text-slate-600 font-medium">{exp.company}</p>
            <p className="font-black text-black text-xs mt-0.5">{exp.role}</p>
            <p className="text-slate-700 mt-1 whitespace-pre-line leading-relaxed">
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
            index > 0 ? "mt-5" : rightSections.length > 0 ? "mt-6" : ""
          }
        >
          {index === 0 && (
            <h3 className="text-base font-black uppercase border-b-2 border-black pb-0.5 mb-3">
              Projects
            </h3>
          )}
          <div className="relative border-l-2 border-slate-400 pl-4">
            <div className="absolute -left-[21px] -top-0.5 bg-slate-800 rounded-full w-2 h-2" />
            <div className="flex justify-between items-baseline">
              <p className="font-black text-black text-xs">
                {proj.title}{" "}
                {proj.technologies?.length > 0 && (
                  <span className="font-normal text-slate-500">
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
            </div>
            <p className="text-slate-700 mt-1 leading-relaxed">
              {proj.description}
            </p>
          </div>
        </div>,
      );
    });
  }

  if (additional.references.length > 0) {
    rightSections.push(
      <div key="references" className={rightSections.length > 0 ? "mt-6" : ""}>
        <h3 className="text-base font-black uppercase border-b-2 border-black pb-0.5 mb-3">
          Reference
        </h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {additional.references.map((ref, index) => {
            const [name, title, phone, email] = ref
              .split("|")
              .map((s) => s?.trim());
            return (
              <div key={index}>
                <p className="font-bold text-black">{name || ref}</p>
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
      pageClassName="text-black font-sans antialiased "
      columns={[
        {
          sections: leftSections,
          widthFraction: 1 / 3,
          padding: "10mm",
          className: "bg-[#dbdbdb] border-r border-slate-300",
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
