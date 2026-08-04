"use client";

import { useState } from "react";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  variant?: "default" | "auth";
};

export function Input({
  label,
  error,
  type = "text",
  id,
  variant = "default",
  className = "",
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputId = id ?? props.name;
  const inputType = isPassword && showPassword ? "text" : type;
  const isAuth = variant === "auth";

  const labelClass = isAuth
    ? "text-[9px] font-medium tracking-[0.2em] font-roboto text-[#B8AE96] uppercase transition-colors group-focus-within:text-[#DCC694]"
    : "text-[11px] font-medium tracking-[0.15em] font-roboto text-section-label uppercase";

  const inputClass = isAuth
    ? `w-full border-0 font-roboto border-b border-[#DCC69433] bg-transparent px-0 py-2 text-sm text-[#F2EAD5] outline-none transition-colors placeholder:text-[#6E6455]/60 focus:border-[#DCC694] focus:text-[#DCC694] ${isPassword ? "pr-14" : ""}`
    : `w-full rounded-lg border border-accent/25 bg-card px-3 py-2.5 text-sm font-roboto text-foreground outline-none transition-colors placeholder:text-secondary focus:border-accent disabled:cursor-not-allowed disabled:opacity-50 ${isPassword ? "pr-10" : ""}`;

  const toggleClass = isAuth
    ? "absolute right-0 bottom-2 cursor-pointer text-[10px] font-medium tracking-[0.15em] font-roboto text-[#B8AE96] uppercase transition-colors group-focus-within:text-[#DCC694] hover:text-[#DCC694]"
    : "absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-[10px] font-medium tracking-[0.15em] font-roboto text-section-label uppercase hover:text-accent";

  return (
    <div className={`flex w-full flex-col gap-1 ${isAuth ? "group" : ""}`}>
      {label && (
        <label htmlFor={inputId} className={labelClass}>
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          type={inputType}
          className={`${inputClass} ${error ? "border-red-500 focus:border-red-500" : ""} ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className={toggleClass}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {error && (
        <p className="text-[9px] font-roboto text-red-500">{error}</p>
      )}
    </div>
  );
}
