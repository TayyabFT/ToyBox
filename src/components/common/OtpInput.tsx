"use client";

import ReactOtpInput from "react-otp-input";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function OtpInput({ value, onChange, error }: OtpInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <ReactOtpInput
        value={value}
        onChange={onChange}
        numInputs={6}
        inputType="tel"
        shouldAutoFocus
        containerStyle="flex justify-between gap-2"
        renderInput={(props) => (
          <input
            {...props}
            className={`size-11 flex-1 rounded-lg border bg-[#121212] text-center text-lg font-roboto text-[#F2EAD5] outline-none transition-colors focus:border-[#DCC694] ${
              error ? "border-red-500" : "border-[#DCC69440]"
            }`}
          />
        )}
      />

      {error && (
        <p className="text-center text-[9px] font-roboto text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
