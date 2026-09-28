"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon: LucideIcon;
  isInvalid: boolean;
  errorMessage?: string;
  isPassword?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  icon: Icon,
  isInvalid,
  errorMessage,
  isPassword = false,
  type = "text",
  disabled,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const computedType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col text-left">
      <label className="text-xs font-bold text-slate-700 mb-1" htmlFor={id}>
        {label}
      </label>
      <div className="relative flex items-center">
        <Icon className="absolute left-3.5 w-4 h-4 text-slate-400" />
        <input
          id={id}
          type={computedType}
          disabled={disabled}
          className={`w-full pl-11 pr-10 py-2 bg-slate-50/50 border text-slate-900 placeholder-slate-400 text-sm rounded-xl focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200 ${
            isInvalid
              ? "border-red-400 focus:ring-red-100 focus:border-red-400"
              : "border-slate-200 focus:ring-blue-500/10 focus:border-blue-500"
          }`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors duration-150"
            tabIndex={-1}
            disabled={disabled}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {isInvalid && errorMessage && (
        <span className="text-[10px] text-red-500 mt-0.5 font-medium">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default FormInput;
