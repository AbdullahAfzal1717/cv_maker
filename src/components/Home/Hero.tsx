"use client";

import React from "react";
import { Sparkles, FileText, CheckCircle } from "lucide-react";

interface HeroProps {
  onCreateManually: () => void;
  onCreateWithAI: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCreateManually, onCreateWithAI }) => {
  return (
    <section className="relative overflow-hidden bg-linear-to-tr from-[#1349c5] via-[#1e6df9] to-[#b995e6] text-white py-20 px-6 md:py-28 text-center flex flex-col items-center">
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

      <div className="relative z-10 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold uppercase tracking-wider mb-6 hover:bg-white/15 transition-all duration-300">
        <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
        <span>AI-Powered • 100% Free • No Watermark</span>
      </div>

      <h1 className="relative z-10 text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight mb-6">
        Build Your Future with CV Maker AI
      </h1>

      <p className="relative z-10 text-sm md:text-lg text-blue-100 max-w-2xl font-light mb-10 leading-relaxed">
        Professional CV and resume generator. Create stunning, job-winning
        documents in minutes using advanced AI chat inputs or guided step
        templates. Perfect PDF export guaranteed.
      </p>

      <div className="relative z-10 flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-120 sm:max-w-none justify-center">
        <button
          onClick={onCreateWithAI}
          className="px-8 py-3.5 bg-white text-[#1e6df9] font-bold text-sm rounded-xl hover:bg-blue-50 shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <Sparkles className="w-6 h-6 text-blue-600" />
          Create CV with AI
        </button>
        <button
          onClick={onCreateManually}
          className="px-8 py-3.5 border-2 border-white/90 text-white font-bold text-sm rounded-xl hover:bg-white/10 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          <FileText className="w-6 h-6" />
          Create Manually
        </button>
      </div>

      <div className="relative z-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs md:text-sm text-blue-100/90 font-medium">
        <span className="flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-yellow-300" /> No credit card
          required
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-yellow-300" /> RTL & Multilingual
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-yellow-300" /> Instant PDF
          download
        </span>
      </div>
    </section>
  );
};

export default Hero;
