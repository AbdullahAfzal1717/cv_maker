"use client";

import React from "react";
import { useInView } from "../../hooks/useInView";

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  index: number;
}

const StepCard: React.FC<StepCardProps> = ({
  stepNumber,
  title,
  description,
  index,
}) => {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: inView ? `${index * 80}ms` : "0ms" }}
      className={`group relative overflow-hidden bg-white border border-slate-200/50 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1.5 hover:border-blue-200 text-left flex flex-col h-full transition-all duration-500 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-[#1e6df9]/10 to-[#b995e6]/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#1349c5] via-[#1e6df9] to-[#b995e6] transition-transform duration-500 ease-out group-hover:scale-x-100" />

      <div className="relative w-8 h-8 rounded-full bg-[#1e6df9] text-white flex items-center justify-center font-bold text-sm mb-6 transition-all duration-500 ease-out group-hover:scale-125 group-hover:shadow-lg group-hover:shadow-blue-500/30">
        {stepNumber}
      </div>
      <h3 className="relative text-base md:text-lg font-bold text-slate-800 mb-3 transition-colors duration-300 group-hover:text-[#1349c5]">
        {title}
      </h3>
      <p className="relative text-xs md:text-sm text-slate-500 leading-relaxed grow">
        {description}
      </p>
    </div>
  );
};

interface HowItWorksProps {
  onAction: (path: string) => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onAction }) => {
  const steps = [
    {
      title: "Fill Your Information",
      description:
        "Enter your professional profile in our guided form editor, or simply describe your history to the AI Chat assistant in plain words.",
    },
    {
      title: "Choose a Template",
      description:
        "Select from our collection of 15 professional layouts. Swap styles, colors, and layout designs in one click without re-entering data.",
    },
    {
      title: "Download PDF",
      description:
        "Preview your CV directly in-app, verify page formats, and instantly download a high-definition PDF file.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 bg-slate-100 px-6 text-center w-full"
    >
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
          How It Works
        </h2>
        <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto mb-16">
          Three simple steps to your perfect CV
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, idx) => (
            <StepCard
              key={idx}
              stepNumber={idx + 1}
              title={step.title}
              description={step.description}
              index={idx}
            />
          ))}
        </div>

        <button
          onClick={() => onAction("/dashboard")}
          className="px-8 py-3.5 bg-[#1e6df9] text-white font-bold text-sm rounded-xl hover:bg-blue-600 hover:shadow-lg transition-all duration-200 inline-flex items-center gap-1.5 cursor-pointer"
        >
          Get Started Now - It&apos;s Free!
        </button>
      </div>
    </section>
  );
};

export default HowItWorks;
