"use client";

import React, { useState } from "react";
import { Plus, ShieldCheck } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What makes CV Maker different from other resume builders?",
    answer:
      "CV Maker combines elegant templates, ATS-friendly formatting, and guided content suggestions so you can create a professional CV quickly without sacrificing quality.",
  },
  {
    question: "Can I use the platform for free?",
    answer:
      "Yes. You can create and manage your resumes and portfolios with our free tools, and upgrade later only when you want extra advanced export options.",
  },
  {
    question: "Do I need design experience to create a strong CV?",
    answer:
      "No. Our templates and smart layouts are designed to help you create polished documents even if you are building your first resume from scratch.",
  },
  {
    question: "Is my data secure and private?",
    answer:
      "Absolutely. We protect your information with modern security practices and you can review our privacy and compliance pages for full details.",
  },
  {
    question: "Can I export my resume to PDF or share it online?",
    answer:
      "Yes. You can export polished versions for job applications and share your professional profile with recruiters using the built-in sharing workflow.",
  },
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white px-6 py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
            <ShieldCheck className="h-4 w-4" />
            Frequently asked questions
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to know before you build your next CV.
          </h2>
          <p className="text-base leading-7 text-slate-600">
            From getting started to sharing your final document, these answers
            help you make the most of our platform with confidence.
          </p>
        </div>

        <div className="w-full max-w-2xl space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/70 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-slate-800">
                    {faq.question}
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-transform duration-200 ${
                      isOpen ? "rotate-45 bg-blue-50 text-blue-600" : ""
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-sm leading-7 text-slate-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
