"use client";

import { useEffect, useRef, useState } from "react";

export type DropdownOption = {
  label: string;
  value: string;
};

type DropdownProps = {
  label?: string;
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

export function Dropdown({
  label,
  options,
  value,
  placeholder = "Select",
  error,
  disabled = false,
  onChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="group flex w-full flex-col gap-2">
      {label && (
        <span className="text-[11px] font-medium tracking-[0.15em] font-roboto text-[#6E6455] uppercase">
          {label}
        </span>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            if (!disabled) {
              setOpen((prev) => !prev);
            }
          }}
          className={`flex w-full items-center justify-between rounded-lg border bg-[#11100C] px-3 py-2.5 text-left text-sm font-roboto outline-none transition-colors ${
            disabled
              ? "cursor-not-allowed border-[#D4A84740] text-[#7D7460] opacity-70"
              : open
                ? "border-[#C9A84C] text-white"
                : "border-[#D4A84740] text-white"
          } ${error ? "border-red-500" : ""}`}
        >
          <span className={selected ? "text-white" : "text-[#7D7460]"}>
            {selected?.label ?? placeholder}
          </span>
          <svg
            className={`size-4 shrink-0 text-[#C9A84C] transition-transform ${open ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open && !disabled && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-[#D4A84740] bg-[#11100C] shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange?.(option.value);
                    setOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 text-left text-sm font-roboto transition-colors ${
                    isSelected
                      ? "bg-[#C9A84C]/15 text-[#C9A84C]"
                      : "text-white hover:bg-white/5"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <p className="text-[9px] font-roboto text-red-500">{error}</p>
      )}
    </div>
  );
}
