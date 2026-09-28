"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Loader2, Layout, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/common/Logo";
import FormInput from "@/components/common/FormInput";

const SignInPage: React.FC = () => {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    loginInput: "",
    password: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const from = searchParams.get("from") || "/dashboard";

  const validations = {
    loginInput:
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.loginInput) ||
      formData.loginInput.trim().length >= 3,
    password: formData.password.length >= 6,
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

    if (!validations.loginInput)
      return setError("Please enter a valid email address or username.");
    if (!validations.password)
      return setError("Password must be at least 6 characters long.");

    setIsLoading(true);
    try {
      const success = await signIn(
        formData.loginInput.trim(),
        formData.password,
      );
      if (success) {
        router.push(from);
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
            Pick up right where you left your career goals.
          </h1>
          <p className="text-base text-slate-200 leading-relaxed">
            Log back in to update your resume, track application performance,
            and tweak your layouts for new job opportunities in minutes.
          </p>

          <div className="pt-6 grid grid-cols-2 gap-4 border-t border-slate-800 text-left">
            <div className="flex items-start gap-2.5">
              <Layout className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-slate-200">
                  Live Preview
                </h4>
                <p className="text-xs text-slate-300">
                  See changes live as you type
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-slate-200">
                  ATS Approved
                </h4>
                <p className="text-xs text-slate-300">
                  Templates built to pass filters
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
              Sign In
            </h2>
            <p className="text-sm text-slate-500 mt-1 text-left">
              Please enter your account credentials.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border-l-4 border-red-500 rounded-xl text-xs text-red-700 font-medium text-left">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              id="loginInput"
              label="Email "
              placeholder="name@example.com "
              icon={Mail}
              value={formData.loginInput}
              onChange={handleChange}
              onBlur={() => handleBlur("loginInput")}
              isInvalid={!!touched.loginInput && !validations.loginInput}
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
              errorMessage="Password must be at least 6 characters."
              disabled={isLoading}
              required
            />

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-[#1e6df9] text-white text-sm font-semibold rounded-xl hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#1e6df9] font-bold hover:underline ml-1"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
