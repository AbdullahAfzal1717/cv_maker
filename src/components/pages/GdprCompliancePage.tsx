"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  LockKeyhole,
  FileText,
  Scale,
  Database,
  UserCheck,
  Globe2,
  ShieldCheck,
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
  { id: "legal-basis", label: "Legal Basis", icon: Scale },
  { id: "data-we-process", label: "Data We Process", icon: Database },
  { id: "your-rights", label: "Your Rights", icon: UserCheck },
  { id: "international-transfers", label: "International Transfers", icon: Globe2 },
  { id: "data-security", label: "Data Security", icon: ShieldCheck },
  { id: "contact-us", label: "Contact Us", icon: Mail },
];

const GdprCompliancePage: React.FC = () => {
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
            <LockKeyhole className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            GDPR Compliance
          </h1>
          <p className="mt-4 text-sm sm:text-base text-blue-100/90 leading-relaxed">
            We&apos;re committed to upholding the data protection standards set out
            by the General Data Protection Regulation (GDPR) for users in the
            European Union and beyond.
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
                <p>CV Maker is committed to protecting the personal data of users in the European Union and complying with the General Data Protection Regulation (GDPR). This page explains how we process personal data and what rights are available to you.</p>
                <p>This GDPR notice works alongside our Privacy Policy, which provides broader detail on how we collect and use information across the platform.</p>
              </div>
            </section>

            <section id="legal-basis" className="py-8 scroll-mt-24">
              <div className="flex items-center gap-2.5 mb-4">
                <Scale className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">Legal Basis for Processing</h2>
              </div>
              <div className="space-y-4 text-sm leading-7 text-slate-600">
                <p>We only process personal data where we have a valid legal basis, including:</p>
                <ul className="list-disc pl-5 space-y-1.5 marker:text-blue-400">
                  <li><span className="font-semibold text-slate-700">Contractual necessity</span> — to create your account and deliver the CV building service.</li>
                  <li><span className="font-semibold text-slate-700">Legitimate interest</span> — to maintain platform security and improve our features.</li>
                  <li><span className="font-semibold text-slate-700">Consent</span> — for optional features such as analytics cookies, which you can withdraw at any time.</li>
                </ul>
              </div>
            </section>

            <section id="data-we-process" className="py-8 scroll-mt-24">
              <div className="flex items-center gap-2.5 mb-4">
                <Database className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">Data We Process</h2>
              </div>
              <div className="space-y-4 text-sm leading-7 text-slate-600">
                <p>Under GDPR, we process the following categories of personal data:</p>
                <ul className="list-disc pl-5 space-y-1.5 marker:text-blue-400">
                  <li>Account information, such as your name, email address, and profile picture.</li>
                  <li>Resume content, including work experience, education, and skills you provide.</li>
                  <li>Technical data, such as browser type and general usage patterns.</li>
                  <li>Communications data from support requests and feedback.</li>
                </ul>
                <p>We process only what is necessary to deliver and improve the service, and we do not sell personal data to advertisers or data brokers.</p>
              </div>
            </section>

            <section id="your-rights" className="py-8 scroll-mt-24">
              <div className="flex items-center gap-2.5 mb-4">
                <UserCheck className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">Your Rights Under GDPR</h2>
              </div>
              <div className="space-y-4 text-sm leading-7 text-slate-600">
                <p>As a data subject, you have the right to:</p>
                <ul className="list-disc pl-5 space-y-1.5 marker:text-blue-400">
                  <li>Access the personal data we hold about you.</li>
                  <li>Rectify inaccurate or incomplete data.</li>
                  <li>Request erasure of your data (&quot;right to be forgotten&quot;).</li>
                  <li>Restrict or object to certain types of processing.</li>
                  <li>Receive your data in a portable, machine-readable format.</li>
                  <li>Lodge a complaint with your local data protection authority.</li>
                </ul>
              </div>
            </section>

            <section id="international-transfers" className="py-8 scroll-mt-24">
              <div className="flex items-center gap-2.5 mb-4">
                <Globe2 className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">International Transfers</h2>
              </div>
              <div className="space-y-4 text-sm leading-7 text-slate-600">
                <p>Where personal data is transferred outside the European Economic Area, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses, to maintain a level of protection consistent with GDPR requirements.</p>
              </div>
            </section>

            <section id="data-security" className="py-8 scroll-mt-24">
              <div className="flex items-center gap-2.5 mb-4">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">Data Security</h2>
              </div>
              <div className="space-y-4 text-sm leading-7 text-slate-600">
                <p>We apply technical and organizational measures — including encryption in transit, access controls, and regular security reviews — to protect your personal data against unauthorized access, loss, or misuse.</p>
              </div>
            </section>

            <section id="contact-us" className="pt-8 scroll-mt-24">
              <div className="flex items-center gap-2.5 mb-4">
                <Mail className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">Contact Us</h2>
              </div>
              <div className="space-y-4 text-sm leading-7 text-slate-600">
                <p>If you have concerns about your GDPR rights or how your data is handled, please contact our support team and we will respond promptly.</p>
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

export default GdprCompliancePage;
