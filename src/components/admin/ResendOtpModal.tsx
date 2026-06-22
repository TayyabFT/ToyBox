"use client";

import { useState } from "react";
import { Input } from "@/components/common";
import { showToast } from "@/lib/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resendOtp } from "@/store/slices/adminSlice";

const validateEmail = (email: string) => {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Enter a valid email address";
  }
  return "";
};

export function ResendOtpModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const { resendLoading } = useAppSelector((state) => state.admin);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  function resetForm() {
    setEmail("");
    setEmailError("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleResend() {
    const error = validateEmail(email);

    if (error) {
      setEmailError(error);
      return;
    }

    setEmailError("");

    const result = await dispatch(resendOtp({ email: email.trim() }));

    if (resendOtp.fulfilled.match(result)) {
      console.log("Resend OTP Response:", result.payload);
      showToast.success({
        title: "OTP Resent",
        message: result.payload.message || "A new code has been sent",
      });
      resetForm();
      onClose();
      return;
    }

    showToast.error({
      title: "Resend Failed",
      message: (result.payload as string) || "Failed to resend OTP",
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#D4A84740] bg-[#11100C] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg tracking-[0.06em] text-white uppercase">
            Resend OTP
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer text-[#7D7460] transition-colors hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <p className="font-roboto text-sm text-[#FFFFFF73]">
            Resend the 6-digit activation code to a pending invite.
          </p>

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="user@example.com"
            value={email}
            error={emailError}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
          />

          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="mt-2 w-full cursor-pointer rounded-lg bg-[#C9A84C] py-3 text-sm font-roboto font-semibold tracking-[0.15em] text-[#1a1208] uppercase disabled:opacity-60"
          >
            {resendLoading ? "Sending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}
