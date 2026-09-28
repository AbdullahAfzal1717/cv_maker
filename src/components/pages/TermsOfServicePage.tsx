"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  ClipboardList,
  UserCog,
  ShieldAlert,
  Copyright,
  RefreshCcw,
  Mail,
  type LucideIcon,
} from "lucide-react";
import Footer from "@/components/Home/Footer";
import { useScrollSpy } from "@/hooks/useScrollSpy";

interface Section {
  id: string;
  label: string;
  icon: LucideIcon;
}

const SECTIONS: Section[] = [
  { id: "introduction", label: "Introduction", icon: FileText },
  { id: "acceptable-use", label: "Acceptable Use", icon: ClipboardList },
  { id: "your-account", label: "Your Account", icon: UserCog },
  { id: "liability", label: "Disclaimers & Liability", icon: ShieldAlert },
  { id: "intellectual-property", label: "Intellectual Property", icon: Copyright },
  { id: "changes-to-terms", label: "Changes to Terms", icon: RefreshCcw },
  { id: "contact-us", label: "Contact Us", icon: Mail },
];

const TermsOfServicePage: React.FC = () => {
  const router = useRouter();
  const activeId = useScrollSpy(
    SECTIONS.map((s) => s.id),
    160,
  );

  const handleNavClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-700 flex flex-col">
      <section className="relative bg-linear-to-br from-[#1349c5] via-[#1e6df9] to-[#b995e6] px-6 py-20 text-center overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl" />

        <Link
          href="/"
          className="absolute left-6 top-6 inline-flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl px-3 py-2 transition-all duration-150 backdrop-blur-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <div className="relative mx-auto max-w-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Terms of Service
          </h1>
          <p className="mt-4 text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Please read these terms carefully before using CV Maker. They
            explain your rights and responsibilities as a user of our resume
            building platform and services.
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-blue-200/80">
            Last updated: July 1, 2026
          </p>
        </div>
      </section>

      <main className="grow px-6 py-14">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
          <nav className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-4 lg:sticky lg:top-24">
            <p className="px-3 pt-2 pb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Quick Navigation
            </p>
            <ul className="space-y-1">
              {SECTIONS.map(({ id, label, icon: Icon }) => {
                const isActive = activeId === id;
                return (
                  <li key={id}>
                    <button
                      onClick={() => handleNavClick(id)}
                      className={`w-full flex items-center gap-2.5 text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                        isActive
                          ? "bg-[#1e6df9] text-white shadow-sm shadow-blue-500/30"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? "text-white" : "text-black-400"
                        }`}
                      />
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-8 sm:p-10 divide-y divide-slate-100">
            <section id="introduction" className="pb-8 scroll-mt-24">
              <div className="flex items-center gap-2.5 mb-4">
                <FileText className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">Introduction</h2>
              </div>
              <div className="space-y-4 text-sm leading-7 text-slate-600">
                <p>These Terms of Service govern your access to and use of CV Maker, including the AI-assisted CV builder, the manual step-by-step builder, resume templates, and PDF export tools. By creating an account or using the platform, you agree to be bound by these terms.</p>
                <p>If you do not agree with any part of these terms, please do not use CV Maker. We may update these terms from time to time, and continued use of the platform after changes take effect means you accept the revised conditions.</p>
              </div>
            </section>

            <section id="acceptable-use" className="py-8 scroll-mt-24">
              <div className="flex items-center gap-2.5 mb-4">
                <ClipboardList className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">Acceptable Use</h2>
              </div>
              <div className="space-y-4 text-sm leading-7 text-slate-600">
                <p>When using CV Maker, you agree that you will not:</p>
                <ul className="list-disc pl-5 space-y-1.5 marker:text-blue-400">
                  <li>Upload or generate content that is false, misleading, or fraudulent.</li>
                  <li>Use the platform to infringe on the rights of others, including copyright or personal data.</li>
                  <li>Attempt to disrupt, overload, or gain unauthorized access to our systems.</li>
                  <li>Use automated tools to scrape or abuse the AI assistant or template library.</li>
                  <li>Share your account credentials or resell access to the service.</li>
                </ul>
                <p>You are solely responsible for the accuracy and legality of the content you upload, create, or share through the service.</p>
              </div>
            </section>

            <section id="your-account" className="py-8 scroll-mt-24">
              <div className="flex items-center gap-2.5 mb-4">
                <UserCog className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">Your Account</h2>
              </div>
              <div className="space-y-4 text-sm leading-7 text-slate-600">
                <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.</p>
                <ul className="list-disc pl-5 space-y-1.5 marker:text-blue-400">
                  <li>Notify us immediately if you suspect unauthorized use of your account.</li>
                  <li>Provide accurate information when creating or updating your profile.</li>
                  <li>Understand that we may suspend or terminate accounts that violate these terms.</li>
                </ul>
                <p>You may delete your account at any time; doing so will remove your saved resumes and profile data in accordance with our Privacy Policy.</p>
              </div>
            </section>

            <section id="liability" className="py-8 scroll-mt-24">
              <div className="flex items-center gap-2.5 mb-4">
                <ShieldAlert className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">Disclaimers & Liability</h2>
              </div>
              <div className="space-y-4 text-sm leading-7 text-slate-600">
                <p>CV Maker is provided on an &quot;as is&quot; and &quot;as available&quot; basis. While we strive for accuracy and reliability, we do not guarantee that AI-generated suggestions will be free of errors or that any resume produced will result in employment outcomes.</p>
                <p>To the fullest extent permitted by law, CV Maker and its team are not liable for indirect, incidental, or consequential damages arising from your use of the platform.</p>
              </div>
            </section>

            <section id="intellectual-property" className="py-8 scroll-mt-24">
              <div className="flex items-center gap-2.5 mb-4">
                <Copyright className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">Intellectual Property</h2>
              </div>
              <div className="space-y-4 text-sm leading-7 text-slate-600">
                <p>The CV Maker platform, including its templates, design, branding, and underlying code, is the property of CV Maker and protected by applicable intellectual property laws.</p>
                <p>You retain full ownership of the personal content you enter into your resume — such as your work history and skills — and may export or delete it at any time.</p>
              </div>
            </section>

            <section id="changes-to-terms" className="py-8 scroll-mt-24">
              <div className="flex items-center gap-2.5 mb-4">
                <RefreshCcw className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">Changes to Terms</h2>
              </div>
              <div className="space-y-4 text-sm leading-7 text-slate-600">
                <p>We may revise these Terms of Service periodically to reflect changes to our features, legal requirements, or business practices. We will post the updated terms with a new &quot;Last updated&quot; date, and significant changes may be communicated via email or an in-app notice.</p>
              </div>
            </section>

            <section id="contact-us" className="pt-8 scroll-mt-24">
              <div className="flex items-center gap-2.5 mb-4">
                <Mail className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">Contact Us</h2>
              </div>
              <div className="space-y-4 text-sm leading-7 text-slate-600">
                <p>If you have any questions about these Terms of Service, please reach out to our support team and we&apos;ll be happy to help.</p>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="inline-flex items-center gap-2 mt-2 py-2.5 px-5 bg-[#1e6df9] text-white text-xs font-bold rounded-xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Contact Support
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer onAction={(path) => router.push(path)} />
    </div>
  );
};

export default TermsOfServicePage;
