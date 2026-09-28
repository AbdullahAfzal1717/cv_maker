"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Globe,
  User,
  ChevronDown,
  UserCircle,
} from "lucide-react";

interface UserType {
  username: string;
  email: string;
  profilePicture?: string;
}

interface NavbarProps {
  user: UserType | null;
  signOut: () => void;
  onAction?: (path: string) => void;
  isInDashboard?: boolean;
}

const LANGUAGES = [
  { name: "English", code: "en" },
  { name: "Arabic", code: "ar" },
  { name: "Urdu", code: "ur" },
  { name: "Farsi", code: "fa" },
  { name: "Spanish", code: "es" },
  { name: "French", code: "fr" },
];

const Navbar: React.FC<NavbarProps> = ({
  user,
  signOut,
  onAction,
  isInDashboard = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [language, setLanguage] = useState("English");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const langMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isInDashboard) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (langMenuRef.current && !langMenuRef.current.contains(target)) {
        setShowLangMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isInDashboard]);

  useEffect(() => {
    if (!isInDashboard || pathname !== "/dashboard") return;

    const onScroll = () => {
      const resumes = document.getElementById("my-resumes");

      if (!resumes) return;

      const trigger = resumes.offsetTop - 140;

      if (window.scrollY >= trigger) {
        setActiveSection("my-resumes");
      } else {
        setActiveSection("hero");
      }
    };

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [isInDashboard, pathname]);

  const currentActiveSection =
    isInDashboard || pathname !== "/" ? "" : activeSection;

  const handleScrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();

    const element = document.getElementById(id);

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setActiveSection(id);
  };

  const handleDashboardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setActiveSection("hero");

    if (pathname !== "/dashboard") {
      router.push("/dashboard");
      return;
    }

    document.getElementById("hero")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleResumeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (pathname !== "/dashboard") {
      router.push("/dashboard?scrollTo=my-resumes");
      return;
    }

    document.getElementById("my-resumes")?.scrollIntoView({
      behavior: "smooth",
    });

    setActiveSection("my-resumes");
  };

  return (
    <div
      className={`${
        isInDashboard
          ? "sticky top-0 bg-linear-to-b from-slate-50/80 to-transparent"
          : "fixed top-0 left-0 right-0"
      } z-50 w-full px-4 sm:px-6 py-4`}
    >
      <header className="w-full max-w-7xl mx-auto bg-white/80 backdrop-blur-xl border border-blue-50/20 shadow-[0_8px_32px_-6px_rgba(30,109,249,0.04),0_4px_12px_-2px_rgba(0,0,0,0.01)] rounded-2xl px-6 py-3 flex items-center justify-between transition-all duration-300">
        {/* BRANDING LEFT LOGO */}
        <Link href="/" className="flex items-center gap-2.5 group select-none">
          <div className="w-9 h-9 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
            <img
              src="/images/icon.webp"
              alt="CV Maker Icon"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors duration-200">
              CV Maker
            </span>
            {isInDashboard && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md border border-blue-100/50">
                Workspace
              </span>
            )}
          </div>
        </Link>

        {/* MIDDLE NAVIGATION */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          {isInDashboard ? (
            <>
              <a
                href="#hero"
                onClick={handleDashboardClick}
                className={`transition-colors duration-150 relative py-1 cursor-pointer ${
                  activeSection === "hero"
                    ? "text-[#1e6df9] font-bold"
                    : "text-slate-600 hover:text-[#1e6df9]"
                }`}
              >
                Dashboard
                {activeSection === "hero" && (
                  <span className="absolute -bottom-4.5 left-0 w-full h-0.5 bg-[#1e6df9] rounded-full" />
                )}
              </a>

              <a
                href="#my-resumes"
                onClick={handleResumeClick}
                className={`transition-colors duration-150 relative py-1 cursor-pointer ${
                  activeSection === "my-resumes"
                    ? "text-[#1e6df9] font-bold"
                    : "text-slate-600 hover:text-[#1e6df9]"
                }`}
              >
                My Resumes
                {activeSection === "my-resumes" && (
                  <span className="absolute -bottom-4.5 left-0 w-full h-0.5 bg-[#1e6df9] rounded-full" />
                )}
              </a>
              <Link
                href="/profile"
                className={`transition-colors duration-150 relative py-1 cursor-pointer ${
                  pathname === "/profile"
                    ? "text-[#1e6df9] font-bold"
                    : "text-slate-600 hover:text-[#1e6df9]"
                }`}
              >
                Profile
                {pathname === "/profile" && (
                  <span className="absolute -bottom-4.5 left-0 w-full h-0.5 bg-[#1e6df9] rounded-full" />
                )}
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => onAction?.("/dashboard")}
                className="hover:text-blue-600 transition-colors duration-150 cursor-pointer relative after:absolute after:-bottom-4.5 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300 text-slate-600"
              >
                CV Builder
              </button>

              <a
                href="#features"
                onClick={(e) => handleScrollToSection(e, "features")}
                className={`transition-all duration-200 relative py-1 ${
                  currentActiveSection === "features"
                    ? "text-blue-600 font-bold"
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                Features
                {currentActiveSection === "features" && (
                  <span className="absolute -bottom-4.5 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                )}
              </a>

              <a
                href="#how-it-works"
                onClick={(e) => handleScrollToSection(e, "how-it-works")}
                className={`transition-all duration-200 relative py-1 ${
                  currentActiveSection === "how-it-works"
                    ? "text-blue-600 font-bold"
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                How It Works
                {currentActiveSection === "how-it-works" && (
                  <span className="absolute -bottom-4.5 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                )}
              </a>

              <a
                href="#faq"
                onClick={(e) => handleScrollToSection(e, "faq")}
                className={`transition-all duration-200 relative py-1 ${
                  currentActiveSection === "faq"
                    ? "text-blue-600 font-bold"
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                FAQ
                {currentActiveSection === "faq" && (
                  <span className="absolute -bottom-4.5 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                )}
              </a>
            </>
          )}
        </nav>

        {/* RIGHT ACTION ITEMS CONTAINER */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3.5">
              {isInDashboard && (
                <>
                  <div className="relative" ref={langMenuRef}>
                    <button
                      onClick={() => setShowLangMenu(!showLangMenu)}
                      className="p-2 hover:bg-slate-100/80 rounded-xl text-slate-500 hover:text-slate-800 transition-all cursor-pointer flex items-center gap-1.5 border border-transparent hover:border-slate-200/60"
                    >
                      <Globe className="w-5 h-5 text-slate-400" />
                      <span className="text-xs font-semibold hidden sm:inline">
                        {language}
                      </span>
                    </button>

                    {showLangMenu && (
                      <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200/80 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] py-1 z-50">
                        {LANGUAGES.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setLanguage(lang.name);
                              setShowLangMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-blue-50/60 hover:text-blue-600 font-medium transition-colors cursor-pointer"
                          >
                            {lang.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="h-5 w-px bg-slate-200/80"></div>

                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 bg-slate-50/50 border border-slate-100 hover:border-slate-200 hover:bg-slate-100/60 px-2.5 py-1 rounded-xl transition-all cursor-pointer"
                    >
                      <div className="w-7 h-7 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center text-slate-500 shrink-0 overflow-hidden">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="text-left hidden sm:block">
                        <div className="text-xs font-bold text-slate-800 leading-tight">
                          {user.username}
                        </div>
                        <div className="text-[9px] text-slate-400 font-medium leading-none">
                          {user.email}
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-4.5 h-4.5 text-slate-400 transition-transform duration-200 shrink-0 ${
                          showUserMenu ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200/80 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] py-1 z-50">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            router.push("/profile");
                          }}
                          className="w-full flex items-center gap-2 text-left px-4 py-2 text-xs text-slate-600 hover:bg-blue-50/60 hover:text-blue-600 font-medium transition-colors cursor-pointer"
                        >
                          <UserCircle className="w-4.5 h-4.5" />
                          View Profile
                        </button>
                        <div className="h-px bg-slate-100 my-1" />
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            signOut();
                          }}
                          className="w-full flex items-center gap-2 text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 font-medium transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4.5 h-4.5" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {!isInDashboard && (
                <>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="py-2 px-4 bg-[#1e6df9] text-white text-xs font-bold rounded-xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <LayoutDashboard className="w-4.5 h-4.5" />
                    Dashboard
                  </button>
                  <button
                    onClick={signOut}
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl p-2 transition-all duration-200 cursor-pointer border border-transparent hover:border-red-100"
                    title="Sign Out"
                  >
                    <LogOut className="w-5.5 h-5.5" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-slate-600 hover:text-blue-600 text-xs font-bold px-3 py-2 transition-all duration-150"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-[#1e6df9] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all duration-200"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Navbar;
