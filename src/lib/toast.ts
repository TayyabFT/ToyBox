"use client";

import React from "react";
import { toast, type ToastOptions } from "react-toastify";

export interface ToastContent {
  title: string;
  message?: string;
}

const baseOptions: ToastOptions = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const ERROR_DEDUPE_MS = 4000;
const recentErrorToasts = new Map<string, number>();

function errorToastId(title: string, message?: string): string {
  return `error:${title.trim().toLowerCase()}|${(message ?? "").trim().toLowerCase()}`;
}

function shouldShowErrorToast(toastId: string): boolean {
  const now = Date.now();
  const lastShownAt = recentErrorToasts.get(toastId);

  if (lastShownAt !== undefined && now - lastShownAt < ERROR_DEDUPE_MS) {
    return false;
  }

  recentErrorToasts.set(toastId, now);

  for (const [key, shownAt] of recentErrorToasts) {
    if (now - shownAt >= ERROR_DEDUPE_MS) {
      recentErrorToasts.delete(key);
    }
  }

  return true;
}

const renderContent = ({ title, message }: ToastContent) =>
  React.createElement(
    "div",
    { className: "toybox-toast-content" },
    React.createElement("div", { className: "toybox-toast-title" }, title),
    message &&
      React.createElement(
        "div",
        { className: "toybox-toast-message" },
        message,
      ),
  );

export const showToast = {
  success: (content: ToastContent, options?: ToastOptions) =>
    toast.success(renderContent(content), { ...baseOptions, ...options }),
  error: (content: ToastContent, options?: ToastOptions) => {
    const toastId = errorToastId(content.title, content.message);

    if (!shouldShowErrorToast(toastId)) {
      return;
    }

    return toast.error(renderContent(content), {
      ...baseOptions,
      ...options,
      toastId,
    });
  },
  warning: (content: ToastContent, options?: ToastOptions) =>
    toast.warning(renderContent(content), { ...baseOptions, ...options }),
  info: (content: ToastContent, options?: ToastOptions) =>
    toast.info(renderContent(content), { ...baseOptions, ...options }),
};

export const showSuccess = (message: string, options?: ToastOptions) =>
  showToast.success({ title: message }, options);

export const showError = (message: string, options?: ToastOptions) =>
  showToast.error({ title: message }, options);
