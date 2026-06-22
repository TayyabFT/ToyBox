"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input, OtpInput } from "@/components/common";
import {
  getDashboardPath,
  isUserRole,
  setSetupEmail,
  setSetupSession,
} from "@/lib/auth";
import { showToast } from "@/lib/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { signIn, verifyOtp } from "@/store/slices/authSlice";

type FieldErrors = {
  email?: string;
  password?: string;
};

const validateLogin = (email: string, password: string): FieldErrors => {
  const errors: FieldErrors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address";
  }

  if (!password.trim()) {
    errors.password = "Password is required";
  }

  return errors;
};

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, verifyOtpLoading } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  function resetOtpForm() {
    setOtp("");
    setOtpError("");
  }

  function handleCloseOtp() {
    resetOtpForm();
    setOtpOpen(false);
  }

  async function handleOtpSubmit() {
    if (!otp.trim()) {
      setOtpError("OTP is required");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setOtpError("Enter a valid 6-digit OTP");
      return;
    }

    setOtpError("");

    const result = await dispatch(verifyOtp({ otp: otp.trim() }));

    if (verifyOtp.fulfilled.match(result)) {
      const { role, setupToken } = result.payload.data;

      console.log("Verify OTP Response:", result.payload);
      console.log("Verify OTP Data:", result.payload.data);

      setSetupSession(role, setupToken);

      if (email.trim()) {
        setSetupEmail(email.trim());
      }

      showToast.success({
        title: "OTP Verified",
        message:
          result.payload.message || "Continue to set your password",
      });
      handleCloseOtp();
      router.push("/auth/setup-password");
      return;
    }

    showToast.error({
      title: "Verification Failed",
      message: (result.payload as string) || "OTP verification failed",
    });
  }

  async function handleSubmit() {
    const errors = validateLogin(email, password);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const result = await dispatch(signIn({ email, password }));

    if (signIn.fulfilled.match(result)) {
      const { role } = result.payload.data;

      if (isUserRole(role)) {
        showToast.success({
          title: "Signed In",
          message: result.payload.message || "Welcome back to the club",
        });
        router.push(getDashboardPath(role));
        return;
      }

      showToast.error({
        title: "Sign In Failed",
        message: "Sign in failed",
      });
      return;
    }

    showToast.error({
      title: "Sign In Failed",
      message: (result.payload as string) || "Sign in failed",
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
            <h2 className="font-copperplate text-center text-xl text-[#EDE4CE] uppercase">
              Welcome to the <span className="text-[#C9A84C]">club</span>
            </h2>
            <p className="font-roboto text-center text-sm font-light text-[#FFFFFF73]">
              Sign in to access your private club.
            </p>
          </div>

          <div className="flex flex-col gap-7 max-w-[320px] mx-auto">
            <Input
              variant="auth"
              label="Email"
              type="email"
              name="email"
              placeholder="faris@almansoori.ae"
              value={email}
              error={fieldErrors.email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              autoComplete="email"
            />

            <div>
              <Input
                variant="auth"
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••••"
                value={password}
                error={fieldErrors.password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                autoComplete="current-password"
              />

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  className="font-roboto text-[10px] font-medium tracking-[0.15em] text-[#C9A84C] cursor-pointer uppercase"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setOtpOpen(true)}
                className="w-full rounded-lg border border-[#C9A84C] bg-transparent py-3 text-[11px] tracking-[0.2em] font-roboto font-semibold text-[#C9A84C] uppercase cursor-pointer"
              >
                Login via OTP
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full rounded-lg bg-[#C9A84C] py-3 text-[11px] tracking-[0.2em] font-roboto font-semibold text-[#1a1208] uppercase cursor-pointer disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </div>

          <p className="text-center font-roboto text-[11px] text-[#FFFFFF40]">
            Membership by invitation only.
          </p>
        </div>
      </div>

      {otpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#D4A84740] bg-[#11100C] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg tracking-[0.06em] text-white uppercase">
                Enter OTP
              </h2>
              <button
                type="button"
                onClick={handleCloseOtp}
                className="cursor-pointer text-[#7D7460] transition-colors hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <p className="font-roboto text-sm text-[#FFFFFF73]">
                Enter the 6-digit code sent to your email.
              </p>

              <OtpInput
                value={otp}
                error={otpError}
                onChange={(value) => {
                  setOtp(value);
                  if (otpError) setOtpError("");
                }}
              />

              <button
                type="button"
                onClick={handleOtpSubmit}
                disabled={verifyOtpLoading}
                className="mt-2 w-full cursor-pointer rounded-lg bg-[#C9A84C] py-3 text-sm font-roboto font-semibold tracking-[0.15em] text-[#1a1208] uppercase disabled:opacity-60"
              >
                {verifyOtpLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default LoginPage;
