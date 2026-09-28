"use client";

import React, { Suspense } from "react";
import type { ResumeData } from "../../types/resume";

// Lazy-load every template — only the selected one is fetched over the network
const ClassicCleanTemplate = React.lazy(() => import("./ClassicCleanTemplate"));
const MinimalProTemplate = React.lazy(() => import("./MinimalProTemplate"));
const SimpleResumeTemplate = React.lazy(() => import("./SimpleResumeTemplate"));
const SimpleStructuredTemplate = React.lazy(() => import("./SimpleStructuredTemplate"));
const ClassicProfessionalTemplate = React.lazy(() => import("./ClassicProfessionalTemplate"));
const ModernCleanTemplate = React.lazy(() => import("./ModernCleanTemplate"));
const ProfessionalModernTemplate = React.lazy(() => import("./ProfessionalModernTemplate"));
const SimpleFocusTemplate = React.lazy(() => import("./SimpleFocusTemplate"));
const CreativeEdgeTemplate = React.lazy(() => import("./CreativeEdgeTemplate"));
const SharpEdgeTemplate = React.lazy(() => import("./SharpEdgeTemplate"));
const ModernSharpTemplate = React.lazy(() => import("./ModernSharpTemplate"));
const ClassicSharpTemplate = React.lazy(() => import("./ClassicSharpTemplate"));
const ProMinimalTemplate = React.lazy(() => import("./ProMinimalTemplate"));
const ModernProfessionalTemplate = React.lazy(() => import("./ModernProfessionalTemplate"));
const CreativeProTemplate = React.lazy(() => import("./CreativeProTemplate"));

interface TemplateRegistryProps {
  templateId: string;
  data: ResumeData;
}

const TemplateFallback: React.FC = () => (
  <div className="flex items-center justify-center h-full text-xs text-slate-400 font-medium">
    Loading template...
  </div>
);

export const TemplateRegistry: React.FC<TemplateRegistryProps> = ({ templateId, data }) => {
  let template: React.ReactNode;

  switch (templateId) {
    case "classic-clean":
      template = <ClassicCleanTemplate data={data} />;
      break;
    case "minimal-pro":
      template = <MinimalProTemplate data={data} />;
      break;
    case "simple-resume":
      template = <SimpleResumeTemplate data={data} />;
      break;
    case "simple-structured":
      template = <SimpleStructuredTemplate data={data} />;
      break;
    case "classic-professional":
      template = <ClassicProfessionalTemplate data={data} />;
      break;
    case "modern-clean":
      template = <ModernCleanTemplate data={data} />;
      break;
    case "professional-modern":
      template = <ProfessionalModernTemplate data={data} />;
      break;
    case "simple-focus":
      template = <SimpleFocusTemplate data={data} />;
      break;
    case "creative-edge":
      template = <CreativeEdgeTemplate data={data} />;
      break;
    case "sharp-edge":
      template = <SharpEdgeTemplate data={data} />;
      break;
    case "modern-sharp":
      template = <ModernSharpTemplate data={data} />;
      break;
    case "classic-sharp":
      template = <ClassicSharpTemplate data={data} />;
      break;
    case "pro-minimal":
      template = <ProMinimalTemplate data={data} />;
      break;
    case "modern-professional":
      template = <ModernProfessionalTemplate data={data} />;
      break;
    case "creative-pro":
      template = <CreativeProTemplate data={data} />;
      break;
    default:
      template = <ClassicCleanTemplate data={data} />;
      break;
  }

  return <Suspense fallback={<TemplateFallback />}>{template}</Suspense>;
};
