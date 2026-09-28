"use client";

import Image from "next/image";
import React from "react";

interface LogoProps {
  className?: string;
  variant?: "auth" | "navbar";
  showSubtitle?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  className = "",
  variant = "auth",
  showSubtitle = true,
}) => {
  const isNavbar = variant === "navbar";

  return (
    <div
      className={`flex items-center select-none ${
        isNavbar ? "flex-row gap-2.5 text-left" : "flex-col text-center"
      } ${className}`}
    >
      <div
        className={`${
          isNavbar ? "w-8 h-8" : "w-16 h-16 mb-4"
        } flex items-center justify-center transition-transform hover:scale-105 duration-300 shrink-0`}
      >
        <Image
          src="/images/icon.webp"
          alt="CV Maker Logo"
          width={isNavbar ? 32 : 64}
          height={isNavbar ? 32 : 64}
          className="w-full h-full object-contain"
        />
      </div>

      <div className={isNavbar ? "flex flex-col" : ""}>
        <h1
          className={`${
            isNavbar ? "text-base" : "text-xl"
          } font-bold tracking-wide font-sans m-0 leading-tight text-slate-200`}
        >
          CV Maker
        </h1>

        {!isNavbar && showSubtitle && (
          <p className="text-xs text-slate-200 font-normal mt-1 max-w-70">
            Create professional resumes in minutes
          </p>
        )}
      </div>
    </div>
  );
};

export default Logo;
