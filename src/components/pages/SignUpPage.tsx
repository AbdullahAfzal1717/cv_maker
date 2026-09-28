"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Loader2, Sparkles, Download } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/common/Logo";
import FormInput from "@/components/common/FormInput";

const SignUpPage: React.FC = () => {
  const { signUp } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validations = {
    username: formData.username.trim().length >= 3,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
    password: formData.password.length >= 6,
    confirmPassword:
      formData.password === formData.confirmPassword &&
      formData.confirmPassword.length > 0,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validations.username)
      return setError("Username must be at least 3 characters long.");
    if (!validations.email)
      return setError("Please enter a valid email address.");
    if (!validations.password)
      return setError("Password must be at least 6 characters.");
    if (!validations.confirmPassword)
      return setError("Passwords do not match.");

    setIsLoading(true);
    try {
      const success = await signUp(
        formData.username.trim(),
        formData.email,
        formData.password,
      );
      if (success) {
        router.replace("/login");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected system error occurred.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex select-none bg-[#f8fafc]">
      <div className="hidden md:flex md:w-1/2 bg-linear-to-tr from-[#1349c5] via-[#1e6df9] to-[#b995e6] relative overflow-hidden flex-col justify-between items-center p-12 text-white">
        <div className="relative z-10 flex items-center gap-2">
          <Logo />
        </div>

        <div className="relative z-10 max-w-md my-auto space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Build a job-winning resume in less than 10 minutes.
          </h1>
          <p className="text-base text-slate-200 leading-relaxed">
            Create an account to unlock expert-approved templates, smart AI
            phrase suggestions, and high-quality PDF downloads.
          </p>

          <div className="pt-6 grid grid-cols-2 gap-4 border-t border-slate-800 text-left">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-slate-200">
                  Smart Phrasing
                </h4>
                <p className="text-xs text-slate-300">
                  Access tailored industry bullet points
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Download className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-slate-200">
                  Multi-Format Export
                </h4>
                <p className="text-xs text-slate-300">
                  Download high-fidelity PDFs instantly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-4 py-12 bg-white lg:px-20">
        <div className="md:hidden mb-8">
          <Logo />
        </div>

        <div className="w-full max-w-100 transition-all duration-300">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Create Account
            </h2>
            <p className="text-sm text-slate-500 mt-1 text-left">
              Get started building your professional resume today.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-xl text-xs text-red-700 font-medium text-left">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              id="username"
              label="Username"
              placeholder="johndoe123"
              icon={User}
              value={formData.username}
              onChange={handleChange}
              onBlur={() => handleBlur("username")}
              isInvalid={!!touched.username && !validations.username}
              errorMessage="Username must be at least 3 characters."
              disabled={isLoading}
              required
            />

            <FormInput
              id="email"
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              isInvalid={!!touched.email && !validations.email}
              errorMessage="Please enter a valid email address."
              disabled={isLoading}
              required
            />

            <FormInput
              id="password"
              label="Password"
              placeholder="••••••••"
              icon={Lock}
              isPassword
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur("password")}
              isInvalid={!!touched.password && !validations.password}
              errorMessage="Password must be at least 6 characters minimum."
              disabled={isLoading}
              required
            />

            <FormInput
              id="confirmPassword"
              label="Confirm Password"
              placeholder="••••••••"
              icon={Lock}
              isPassword
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur("confirmPassword")}
              isInvalid={
                !!touched.confirmPassword && !validations.confirmPassword
              }
              errorMessage="Passwords do not match."
              disabled={isLoading}
              required
            />

            <button
              type="submit"
              className="w-full mt-4 py-2.5 px-4 bg-[#1e6df9] text-white text-sm font-semibold rounded-xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Get Started"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#1e6df9] font-bold hover:underline ml-1"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
