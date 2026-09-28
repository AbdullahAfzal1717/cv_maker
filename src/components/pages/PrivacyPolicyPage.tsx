"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  FileText,
  Database,
  Settings2,
  Globe,
  Share2,
  UserCheck,
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
  { id: "data-collection", label: "Data Collection", icon: Database },
  { id: "use-of-data", label: "Use of Data", icon: Settings2 },
  { id: "cookies", label: "Cookies", icon: Globe },
  { id: "third-party-services", label: "Third-party Services", icon: Share2 },
  { id: "your-rights", label: "Your Rights", icon: UserCheck },
  { id: "contact-us", label: "Contact Us", icon: Mail },
];

const PrivacyPolicyPage: React.FC = () => {
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
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm sm:text-base text-blue-100/90 leading-relaxed">
            We&apos;re committed to protecting your privacy and being
            transparent about how CV Maker collects, uses, and safeguards your
            personal information across the platform.
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
                <p>Welcome to CV Maker. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform and use our services, including the AI-assisted CV builder, the manual step-by-step builder, resume templates, and PDF export tools.</p>
                <p>By accessing or using CV Maker, you agree to the collection and use of information in accordance with this policy. We are committed to protecting your privacy and ensuring your personal information is handled responsibly at every step of building, editing, and exporting your resume.</p>
              </div>
            </section>

            <section id="data-collection" className="py-8 scroll-mt-24">
              <div className="flex items-center gap-2.5 mb-4">
                <Database className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">Data Collection</h2>
              </div>
              <div className="space-y-4 text-sm leading-7 text-slate-600">
                <p>We collect information you provide directly to us, such as when you:</p>
                <ul className="list-disc pl-5 space-y-1.5 marker:text-blue-400">
                  <li>Create an account or update your profile, including your username, email, and profile picture.</li>
                  <li>Fill in CV content through the manual builder, such as work experience, education, and skills.</li>
                  <li>Chat with our AI assistant to describe your professional background.</li>
                  <li>Select templates, languages, and layout preferences for your resume.</li>
                  <li>Export or download a resume as a PDF.</li>
                  <li>Contact our support team for help or feedback.</li>
                </ul>
                <p>We may also automatically collect limited technical data — such as browser type, device information, and general usage patterns — to help us maintain platform stability and improve performance.</p>
              </div>
            </section>

            <section id="use-of-data" className="py-8 scroll-mt-24">
              <div className="flex items-center gap-2.5 mb-4">
                <Settings2 className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">Use of Data</h2>
              </div>
              <div className="space-y-4 text-sm leading-7 text-slate-600">
                <p>The information we collect is used to:</p>
                <ul className="list-disc pl-5 space-y-1.5 marker:text-blue-400">
                  <li>Generate, format, and render your CVs and resume documents accurately.</li>
                  <li>Power the AI chat assistant so it can turn your description into structured resume content.</li>
                  <li>Keep your account secure through authentication and session management.</li>
                  <li>Save your progress automatically so you never lose unsaved edits.</li>
                  <li>Provide multilingual and right-to-left (RTL) rendering for supported languages.</li>
                  <li>Improve our templates, features, and overall platform experience over time.</li>
                </ul>
                <p>We do not use your resume content to train third-party models, and we never sell your personal data to advertisers or data brokers.</p>
              </div>
            </section>

            <section id="cookies" className="py-8 scroll-mt-24">
              <div className="flex items-center gap-2.5 mb-4">
                <Globe className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">Cookies</h2>
              </div>
              <div className="space-y-4 text-sm leading-7 text-slate-600">
                <p>CV Maker uses cookies and similar local storage technologies to keep you signed in, remember your language and template preferences, and understand how the platform is used so we can improve it.</p>
                <ul className="list-disc pl-5 space-y-1.5 marker:text-blue-400">
                  <li><span className="font-semibold text-slate-700">Essential cookies</span> — required for authentication and core functionality.</li>
                  <li><span className="font-semibold text-slate-700">Preference cookies</span> — remember your chosen language, layout, and theme settings.</li>
                  <li><span className="font-semibold text-slate-700">Analytics cookies</span> — help us understand feature usage so we can prioritize improvements.</li>
                </ul>
                <p>You can control or disable cookies through your browser settings at any time, though some features may not function correctly without them.</p>
              </div>
            </section>

            <section id="third-party-services" className="py-8 scroll-mt-24">
              <div className="flex items-center gap-2.5 mb-4">
                <Share2 className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">Third-party Services</h2>
              </div>
              <div className="space-y-4 text-sm leading-7 text-slate-600">
                <p>We rely on a small number of trusted service providers to operate CV Maker reliably and securely. These may include:</p>
                <ul className="list-disc pl-5 space-y-1.5 marker:text-blue-400">
                  <li>Cloud hosting and database providers that store your account and CV data securely.</li>
                  <li>AI service providers that power the conversational CV assistant.</li>
                  <li>PDF rendering infrastructure used to generate high-quality resume exports.</li>
                  <li>Email delivery services used for account verification and important notifications.</li>
                </ul>
                <p>These providers only receive the minimum information needed to perform their function and are contractually required to protect your data. We do not permit third parties to use your information for their own marketing purposes.</p>
              </div>
            </section>

            <section id="your-rights" className="py-8 scroll-mt-24">
              <div className="flex items-center gap-2.5 mb-4">
                <UserCheck className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">Your Rights</h2>
              </div>
              <div className="space-y-4 text-sm leading-7 text-slate-600">
                <p>You have the right to:</p>
                <ul className="list-disc pl-5 space-y-1.5 marker:text-blue-400">
                  <li>Access the personal information and CV data we hold about you.</li>
                  <li>Correct inaccurate or outdated profile or resume information at any time.</li>
                  <li>Request deletion of your account and associated data.</li>
                  <li>Export your CV data or download your resumes as PDFs whenever you choose.</li>
                  <li>Withdraw consent for optional data uses, such as analytics cookies.</li>
                </ul>
                <p>To exercise any of these rights, reach out through the contact details below and we will respond as promptly as possible.</p>
              </div>
            </section>

            <section id="contact-us" className="pt-8 scroll-mt-24">
              <div className="flex items-center gap-2.5 mb-4">
                <Mail className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">Contact Us</h2>
              </div>
              <div className="space-y-4 text-sm leading-7 text-slate-600">
                <p>If you have questions, concerns, or requests regarding this Privacy Policy or how your data is handled, please contact our support team. We&apos;re happy to help clarify anything about how CV Maker protects your information.</p>
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

export default PrivacyPolicyPage;
