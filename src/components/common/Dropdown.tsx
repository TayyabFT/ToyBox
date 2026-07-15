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
        <span className="text-[11px] font-medium tracking-[0.15em] font-roboto text-section-label uppercase">
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
          className={`flex w-full items-center justify-between rounded-lg border bg-card px-3 py-2.5 text-left text-sm font-roboto outline-none transition-colors ${
            disabled
              ? "cursor-not-allowed border-accent/25 text-secondary opacity-70"
              : open
                ? "border-accent text-foreground"
                : "border-accent/25 text-foreground"
          } ${error ? "border-red-500" : ""}`}
        >
          <span className={selected ? "text-foreground" : "text-secondary"}>
            {selected?.label ?? placeholder}
          </span>
          <svg
            className={`size-4 shrink-0 text-accent transition-transform ${open ? "rotate-180" : ""}`}
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
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-accent/25 bg-card shadow-[var(--shadow-modal)]">
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
                      ? "bg-accent/15 text-accent"
                      : "text-foreground hover:bg-accent/8"
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
