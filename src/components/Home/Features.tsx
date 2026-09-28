"use client";

import React from "react";
import {
  Zap,
  Layout,
  Download,
  UserCheck,
  Languages,
  ShieldCheck,
} from "lucide-react";
import { useInView } from "../../hooks/useInView";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorClass: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  colorClass,
  index,
}) => {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: inView ? `${index * 80}ms` : "0ms" }}
      className={`group relative overflow-hidden bg-white border border-slate-200/80 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1.5 hover:border-blue-200 transition-all duration-500 ease-out text-center flex flex-col items-center ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-[#1e6df9]/10 to-[#b995e6]/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#1349c5] via-[#1e6df9] to-[#b995e6] transition-transform duration-500 ease-out group-hover:scale-x-100" />
      <div
        className={`relative w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-md ${colorClass}`}
      >
        {icon}
      </div>
      <h3 className="relative text-lg font-bold text-slate-800 mb-3 transition-colors duration-300 group-hover:text-[#1349c5]">
        {title}
      </h3>
      <p className="relative text-xs md:text-sm text-slate-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const Features: React.FC = () => {
  const cards = [
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Lightning Fast",
      colorClass: "bg-blue-50 text-blue-500",
      description:
        "Create and download your CV in under 5 minutes. No complicated forms or lengthy onboarding processes.",
    },
    {
      icon: <Layout className="w-7 h-7" />,
      title: "15+ Templates",
      colorClass: "bg-purple-50 text-purple-500",
      description:
        "Choose from 15 professionally formatted, clean, and modern CV layouts. Switch visual styles instantly.",
    },
    {
      icon: <Download className="w-7 h-7" />,
      title: "Perfect PDF Export",
      colorClass: "bg-green-50 text-green-500",
      description:
        "Print-perfect PDF designs without watermark tags. Export directly to your storage, ready to send.",
    },
    {
      icon: <UserCheck className="w-7 h-7" />,
      title: "ATS-Friendly Layouts",
      colorClass: "bg-orange-50 text-orange-500",
      description:
        "All resume formats are optimized to parse cleanly through Applicant Tracking Systems (ATS) used by recruiters.",
    },
    {
      icon: <Languages className="w-7 h-7" />,
      title: "RTL & Multilingual",
      colorClass: "bg-pink-50 text-pink-500",
      description:
        "15 supported languages with complete right-to-left layout rendering (Arabic, Urdu, Farsi) in app and PDF.",
    },
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: "100% Private & Secure",
      colorClass: "bg-cyan-50 text-cyan-500",
      description:
        "Full data security. Your resume information is safe and is never sold or used for target profiling.",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 px-6 max-w-7xl mx-auto w-full text-center"
    >
      <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
        Why Choose CV Maker?
      </h2>
      <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto mb-16">
        Everything you need to create professional documents and land your dream
        job
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, idx) => (
          <FeatureCard key={idx} {...card} index={idx} />
        ))}
      </div>
    </section>
  );
};

export default Features;
