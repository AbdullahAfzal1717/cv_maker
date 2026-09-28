"use client";

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface FooterProps {
  onAction: (path: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onAction }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    hash: string,
  ) => {
    e.preventDefault();
    const id = hash.replace("#", "");

    if (pathname !== "/") {
      router.push(`/${hash}`);
      requestAnimationFrame(() => {
        setTimeout(() => {
          document
            .getElementById(id)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      });
      return;
    }

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleRouteClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => {
    e.preventDefault();
    if (pathname === path) return;
    window.scrollTo({ top: 0 });
    setTimeout(() => router.push(path), 100);
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/40 bg-linear-to-br from-[#1349c5] via-[#1e6df9] to-[#b995e6] px-6 py-16 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-10 top-8 h-48 w-48 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-purple-300/20 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-10 text-left md:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1e6df9] to-[#4f7cff] shadow-lg shadow-blue-500/20 p-1">
              <img
                src="/images/icon.webp"
                alt="CV Maker icon"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              CV Maker
            </span>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/85">
            Create professional, ATS-ready CVs and business portfolios in
            minutes with polished templates designed to support your next career
            move.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white shadow-sm backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Powered • 100% Free</span>
          </div>
        </div>

        <div>
          <h4 className="mb-4 inline-block rounded-lg border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-sm backdrop-blur-sm">
            Resources
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="#features"
                onClick={(e) => handleAnchorClick(e, "#features")}
                className="group relative inline-block text-white/85 transition-colors duration-200 hover:text-white"
              >
                Features
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                onClick={(e) => handleAnchorClick(e, "#how-it-works")}
                className="group relative inline-block text-white/85 transition-colors duration-200 hover:text-white"
              >
                How It Works
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
              </a>
            </li>
            <li>
              <a
                href="#faq"
                onClick={(e) => handleAnchorClick(e, "#faq")}
                className="group relative inline-block text-white/85 transition-colors duration-200 hover:text-white"
              >
                FAQ
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 inline-block rounded-lg border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-sm backdrop-blur-sm">
            Legal
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                href="/privacy-policy"
                onClick={(e) => handleRouteClick(e, "/privacy-policy")}
                className="group relative inline-block text-white/85 transition-colors duration-200 hover:text-white"
              >
                Privacy Policy
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
              </Link>
            </li>
            <li>
              <Link
                href="/terms-of-service"
                onClick={(e) => handleRouteClick(e, "/terms-of-service")}
                className="group relative inline-block text-white/85 transition-colors duration-200 hover:text-white"
              >
                Terms of Service
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
              </Link>
            </li>
            <li>
              <Link
                href="/gdpr-compliance"
                onClick={(e) => handleRouteClick(e, "/gdpr-compliance")}
                className="group relative inline-block text-white/85 transition-colors duration-200 hover:text-white"
              >
                GDPR Compliance
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
              </Link>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/25 bg-white/15 p-5 shadow-sm backdrop-blur-sm">
          <h4 className="mb-3 text-sm font-semibold text-white">
            Ready to build your next CV?
          </h4>
          <p className="mb-4 text-sm leading-7 text-white/85">
            Create a polished resume that helps you stand out from the
            competition.
          </p>
          <button
            onClick={() => onAction("/dashboard")}
            className="inline-flex items-center gap-2 rounded-full cursor-pointer bg-white px-4 py-2 text-sm font-semibold text-[#1349c5] transition-all duration-200 hover:bg-blue-50"
          >
            Start now
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/25 pt-8 text-[12px] text-white/80 sm:flex-row">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
          <Link
            href="/privacy-policy"
            onClick={(e) => handleRouteClick(e, "/privacy-policy")}
            className="transition-colors duration-200 hover:text-white"
          >
            Privacy
          </Link>
          <span>•</span>
          <Link
            href="/terms-of-service"
            onClick={(e) => handleRouteClick(e, "/terms-of-service")}
            className="transition-colors duration-200 hover:text-white"
          >
            Terms
          </Link>
          <span>•</span>
          <Link
            href="/gdpr-compliance"
            onClick={(e) => handleRouteClick(e, "/gdpr-compliance")}
            className="transition-colors duration-200 hover:text-white"
          >
            GDPR
          </Link>
        </div>
        <span>
          © 2026 CV Maker. All rights reserved. Empowering careers with
          intelligent design.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
