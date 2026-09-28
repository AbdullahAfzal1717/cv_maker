"use client";

import type { ResumeData } from "../../types/resume";
import { formatDateSlash } from "../../utils/formatDate";
import PaginatedSheet from "../common/PaginatedSheet";

function SectionHeader({
  icon,
  children,
}: {
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-stretch mb-3">
      <div className="w-2 bg-[#f59e0b] shrink-0" />
      <div className="flex items-center gap-2 bg-slate-200 py-2 px-3 grow">
        <span className="text-sm">{icon}</span>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
          {children}
        </h3>
      </div>
    </div>
  );
}

function PillLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white text-[#383a45] text-center font-bold uppercase tracking-wider py-1.5 rounded-full text-[11px] mb-3">
      {children}
    </div>
  );
}

export default function ClassicSharpTemplate({ data }: { data: ResumeData }) {
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
      className="w-32 h-32 mx-auto rounded-full overflow-hidden border-[6px] border-white shadow-md bg-white mb-2"
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
    personalInfo.linkedin ||
    personalInfo.address
  ) {
    leftSections.push(
      <div key="contact">
        <PillLabel>Contact</PillLabel>
        <div className="space-y-2 text-slate-300 text-[10.5px]">
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
        </div>
      </div>,
    );
  }

  if (additional.skills.length > 0) {
    leftSections.push(
      <div key="skills" className="mt-2">
        <PillLabel>Skills</PillLabel>
        <ul className="space-y-2 list-disc pl-4 text-slate-300">
          {additional.skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.languages.length > 0) {
    leftSections.push(
      <div key="languages" className="mt-2">
        <PillLabel>Languages</PillLabel>
        <ul className="space-y-2 list-disc pl-4 text-slate-300">
          {additional.languages.map((lang, i) => (
            <li key={i}>{lang}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.software.length > 0) {
    leftSections.push(
      <div key="software" className="mt-2">
        <PillLabel>Software</PillLabel>
        <ul className="space-y-2 list-disc pl-4 text-slate-300">
          {additional.software.map((sw, i) => (
            <li key={i}>{sw}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.certificates.length > 0) {
    leftSections.push(
      <div key="certificates" className="mt-2">
        <PillLabel>Certifications</PillLabel>
        <ul className="space-y-2 list-disc pl-4 text-slate-300">
          {additional.certificates.map((cert, i) => (
            <li key={i}>{cert}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.publications.length > 0) {
    leftSections.push(
      <div key="publications" className="mt-2">
        <PillLabel>Publications</PillLabel>
        <ul className="space-y-2 list-disc pl-4 text-slate-300">
          {additional.publications.map((pub, i) => (
            <li key={i}>{pub}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.interests.length > 0) {
    leftSections.push(
      <div key="interests" className="mt-2">
        <PillLabel>Interests</PillLabel>
        <ul className="space-y-2 list-disc pl-4 text-slate-300">
          {additional.interests.map((interest, i) => (
            <li key={i}>{interest}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.socialLinks.length > 0) {
    leftSections.push(
      <div key="social-links" className="mt-2">
        <PillLabel>Social Links</PillLabel>
        <ul className="space-y-2 text-slate-300 break-all">
          {additional.socialLinks.map((link, i) => (
            <li key={i}>{link}</li>
          ))}
        </ul>
      </div>,
    );
  }

  if (additional.references.length > 0) {
    leftSections.push(
      <div key="references" className="mt-2">
        <PillLabel>References</PillLabel>
        <div className="space-y-4">
          {additional.references.map((ref, index) => {
            const [name, title, phone, email] = ref
              .split("|")
              .map((s) => s?.trim());
            return (
              <div key={index} className="text-[10.5px]">
                <p className="font-bold text-white">{name || ref}</p>
                {title && <p className="text-slate-400">{title}</p>}
                {phone && (
                  <p className="mt-1">
                    <span className="font-bold text-slate-200">Phone:</span>{" "}
                    {phone}
                  </p>
                )}
                {email && (
                  <p>
                    <span className="font-bold text-slate-200">Email:</span>{" "}
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

  const rightSections: React.ReactNode[] = [];

  rightSections.push(
    <div key="header" className="-mx-[6mm] ">
      <div
        className="bg-[#475569] text-white px-6 py-6 pr-14 relative flex flex-col justify-center"
        style={{ clipPath: "polygon(0 0, 92% 0, 100% 100%, 0% 100%)" }}
      >
        <h1 className="text-3xl font-black uppercase tracking-wide leading-none wrap-break-word">
          {personalInfo.fullName || "JAMIE CHASTAIN"}
        </h1>
        <p className="text-xs uppercase tracking-widest text-[#cbd5e1] mt-2 font-semibold">
          {personalInfo.jobTitle || "GRAPHIC DESIGNER"}
        </p>
      </div>
      <div className="flex h-6">
        <div
          className="bg-[#f59e0b] grow"
          style={{ clipPath: "polygon(0 0, 90% 0, 78% 100%, 0% 100%)" }}
        />
        <div
          className="bg-[#475569] w-24 -ml-6"
          style={{ clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0% 100%)" }}
        />
      </div>
    </div>,
  );

  if (objective) {
    rightSections.push(
      <div key="about" className="pt-6">
        <SectionHeader icon="👤">About Me</SectionHeader>
        <p className="text-slate-600 leading-relaxed whitespace-pre-line px-1">
          {objective}
        </p>
      </div>,
    );
  }

  if (education.length > 0) {
    education.forEach((edu, index) => {
      rightSections.push(
        <div key={`edu-${edu.id}`} className={index > 0 ? "mt-3" : "mt-6"}>
          {index === 0 && <SectionHeader icon="🎓">Education</SectionHeader>}
          <div className="flex justify-between items-baseline text-[10.5px] px-1">
            <div>
              <p className="font-bold text-slate-900">{edu.degree}</p>
              <p className="text-slate-500">
                {edu.institution} {edu.grade && `•  ${edu.grade}`}
              </p>
            </div>
            <span className="text-slate-600 whitespace-nowrap">
              {formatDateSlash(edu.startDate)}-{formatDateSlash(edu.endDate)}
            </span>
          </div>
        </div>,
      );
    });
  }
  if (experience.length > 0) {
    experience.forEach((exp, index) => {
      const bullets = (exp.description ?? "")
        .split("\n")
        .map((line) => line.replace(/^[-•*]\s*/, "").trim())
        .filter(Boolean);

      rightSections.push(
        <div
          key={`exp-${exp.id}-head`}
          className={index > 0 ? "mt-4" : "mt-15"}
        >
          {index === 0 && <SectionHeader icon="💼">Experience</SectionHeader>}
          <div className="text-slate-700 px-1">
            <div className="flex justify-between items-baseline">
              <span className="text-slate-800">{exp.role}</span>
              <span className="text-slate-600 font-normal whitespace-nowrap">
                {formatDateSlash(exp.startDate)}-{formatDateSlash(exp.endDate)}
              </span>
            </div>
            <p className="font-bold text-slate-900">{exp.company}</p>
            {bullets[0] && (
              <ul className="mt-1.5 list-disc pl-4 text-slate-600 text-[10.5px] leading-relaxed">
                <li>{bullets[0]}</li>
              </ul>
            )}
          </div>
        </div>,
      );

      bullets.slice(1).forEach((bullet, bi) => {
        rightSections.push(
          <div key={`exp-${exp.id}-bullet-${bi}`} className="px-1">
            <ul className="list-disc pl-4 text-slate-600 text-[10.5px] leading-relaxed">
              <li>{bullet}</li>
            </ul>
          </div>,
        );
      });
    });
  }

  if (projects && projects.length > 0) {
    projects.forEach((proj, index) => {
      rightSections.push(
        <div
          key={`proj-${proj.id}-head`}
          className={index > 0 ? "mt-4" : "mt-6"}
        >
          {index === 0 && <SectionHeader icon="🚀">Projects</SectionHeader>}
          <div className="text-slate-700 px-1">
            <div className="flex justify-between font-bold">
              <span className="text-slate-900">
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
          </div>
        </div>,
      );

      if (proj.description) {
        rightSections.push(
          <div key={`proj-${proj.id}-desc`} className="px-1">
            <p className="text-slate-600 text-[10.5px] leading-relaxed">
              {proj.description}
            </p>
          </div>,
        );
      }
    });
  }

  return (
    <PaginatedSheet
      pageClassName="text-slate-800 font-sans antialiased "
      columns={[
        {
          sections: leftSections,
          widthFraction: 1 / 3,
          padding: "10mm",
          className: "bg-[#383a45] text-slate-200",
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
