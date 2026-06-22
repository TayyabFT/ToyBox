"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/common";
import { setSetupSession } from "@/lib/auth";
import { showToast } from "@/lib/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { verifyOtp } from "@/store/slices/authSlice";

const validateOtp = (otp: string) => {
  if (!otp.trim()) return "OTP is required";
  if (!/^\d{6}$/.test(otp)) return "Enter a valid 6-digit OTP";
  return "";
};

const VerifyOtpPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { verifyOtpLoading } = useAppSelector((state) => state.auth);

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  async function handleSubmit() {
    const error = validateOtp(otp);

    if (error) {
      setOtpError(error);
      return;
    }

    setOtpError("");

    const result = await dispatch(verifyOtp({ otp: otp.trim() }));

    if (verifyOtp.fulfilled.match(result)) {
      const { role, setupToken } = result.payload.data;

      console.log("Verify OTP Response:", result.payload);
      console.log("Verify OTP Data:", result.payload.data);

      setSetupSession(role, setupToken);
      showToast.success({
        title: "OTP Verified",
        message:
          result.payload.message || "Continue to set your password",
      });
      router.push("/auth/setup-password");
      return;
    }

    showToast.error({
      title: "Verification Failed",
      message: (result.payload as string) || "OTP verification failed",
    });
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-10"
      style={{ backgroundImage: "url(/images/auth.png)" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#292D3200] via-[#11131594] to-[#000000]" />

      <div className="relative z-10 flex w-full justify-center">
        <div className="w-full max-w-[490px] rounded-2xl border border-[#D4A8471F] px-9 py-7 backdrop-blur-xl space-y-8 bg-[#11100C80]">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={144}
            height={48}
            className="w-36 object-contain mx-auto"
          />

          <div className="space-y-2">
            <h2 className="font-copperplate text-center text-2xl tracking-[0.20em] text-[#EDE4CE]">
              Verify <span className="text-[#C9A84C]">OTP</span>
            </h2>
            <p className="font-roboto text-center text-sm font-light text-[#FFFFFF73]">
              Enter the 6-digit code sent to your email.
            </p>
          </div>

          <div className="flex flex-col gap-7 max-w-[320px] mx-auto">
            <Input
              variant="auth"
              label="OTP"
              type="text"
              name="otp"
              inputMode="numeric"
              placeholder="123456"
              maxLength={6}
              value={otp}
              error={otpError}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOtp(value);
                if (otpError) setOtpError("");
              }}
              autoComplete="one-time-code"
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={verifyOtpLoading}
              className="w-full rounded-lg bg-[#C9A84C] py-3 text-[11px] tracking-[0.2em] font-roboto font-semibold text-[#1a1208] uppercase cursor-pointer disabled:opacity-60"
            >
              {verifyOtpLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>

          <p className="text-center font-roboto text-[11px] text-[#FFFFFF40]">
            Membership by invitation only.
          </p>
        </div>
      </div>
    </main>
  );
};

export default VerifyOtpPage;
