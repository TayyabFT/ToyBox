"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/common";
import {
  clearSetupSession,
  getDashboardPath,
  getStoredSetupEmail,
  getStoredSetupToken,
  isUserRole,
} from "@/lib/auth";
import { showToast } from "@/lib/toast";
import { useClientStorage } from "@/lib/useClientStorage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setupPassword } from "@/store/slices/authSlice";

type FieldErrors = {
  email?: string;
  newPassword?: string;
  confirmPassword?: string;
};

const validateSetupPassword = (
  email: string,
  newPassword: string,
  confirmPassword: string,
): FieldErrors => {
  const errors: FieldErrors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address";
  }

  if (!newPassword.trim()) {
    errors.newPassword = "Password is required";
  } else if (newPassword.length < 8) {
    errors.newPassword = "Password must be at least 8 characters";
  }

  if (!confirmPassword.trim()) {
    errors.confirmPassword = "Confirm password is required";
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

const SetupPasswordPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { setupPasswordLoading } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const hasSetupToken = useClientStorage(
    () => !!getStoredSetupToken(),
    false,
  );
  const storedEmail = useClientStorage(
    () => getStoredSetupEmail() ?? "",
    "",
  );
  const displayEmail = email ?? storedEmail;

  useEffect(() => {
    if (!hasSetupToken) {
      router.replace("/auth/login");
    }
  }, [hasSetupToken, router]);

  async function handleSubmit() {
    const setupToken = getStoredSetupToken();

    if (!setupToken) {
      router.replace("/auth/login");
      return;
    }

    const errors = validateSetupPassword(
      displayEmail,
      newPassword,
      confirmPassword,
    );

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const result = await dispatch(
      setupPassword({
        setupToken,
        newPassword,
        confirmPassword,
        email: displayEmail.trim(),
      }),
    );

    if (setupPassword.fulfilled.match(result)) {
      const { role } = result.payload.data;

      clearSetupSession();

      if (isUserRole(role)) {
        showToast.success({
          title: "Account Activated",
          message:
            result.payload.message || "Your account is ready to use",
        });
        router.push(getDashboardPath(role));
        return;
      }

      showToast.success({
        title: "Password Set",
        message: result.payload.message || "Your password has been saved",
      });
      return;
    }

    showToast.error({
      title: "Setup Failed",
      message: (result.payload as string) || "Failed to set password",
    });
  }

  if (!hasSetupToken) return null;

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
              Set Your <span className="text-[#C9A84C]">Password</span>
            </h2>
            <p className="font-roboto text-center text-sm font-light text-[#FFFFFF73]">
              Create a password to activate your account.
            </p>
          </div>

          <div className="flex flex-col gap-7 max-w-[320px] mx-auto">
            <Input
              variant="auth"
              label="Email"
              type="email"
              name="email"
              placeholder="user@example.com"
              value={displayEmail}
              error={fieldErrors.email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              autoComplete="email"
            />

            <Input
              variant="auth"
              label="New Password"
              type="password"
              name="newPassword"
              placeholder="••••••••"
              value={newPassword}
              error={fieldErrors.newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (fieldErrors.newPassword) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    newPassword: undefined,
                  }));
                }
              }}
              autoComplete="new-password"
            />

            <Input
              variant="auth"
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={confirmPassword}
              error={fieldErrors.confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (fieldErrors.confirmPassword) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    confirmPassword: undefined,
                  }));
                }
              }}
              autoComplete="new-password"
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={setupPasswordLoading}
              className="w-full rounded-lg bg-[#C9A84C] py-3 text-[11px] tracking-[0.2em] font-roboto font-semibold text-[#1a1208] uppercase cursor-pointer disabled:opacity-60"
            >
              {setupPasswordLoading ? "Setting Password..." : "Set Password"}
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

export default SetupPasswordPage;
