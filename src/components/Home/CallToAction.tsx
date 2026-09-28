"use client";

import React from "react";

interface CallToActionProps {
  onAction: (path: string) => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ onAction }) => {
  return (
    <section className="bg-linear-to-r from-[#1e6df9] to-[#b995e6] text-white py-16 px-6 text-center flex flex-col items-center justify-center">
      <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-3">
        Ready to Create Your Perfect CV?
      </h2>
      <p className="text-sm md:text-base text-blue-100 font-light max-w-xl mb-8">
        Join thousands of job seekers who&apos;ve landed their dream jobs using CV
        Maker templates
      </p>
      <button
        onClick={() => onAction("/dashboard")}
        className="px-8 py-3.5 bg-white text-[#1e6df9] font-bold text-sm rounded-xl hover:bg-blue-50 active:scale-[0.98] hover:shadow-lg transition-all duration-200 cursor-pointer"
      >
        Start Building Your CV Now
      </button>
    </section>
  );
};

export default CallToAction;
