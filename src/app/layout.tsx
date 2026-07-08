import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import StoreProvider from "@/store/StoreProvider";
import ToastProvider from "@/components/common/ToastProvider";
import { ApiBackendUrlLog } from "@/components/common/ApiBackendUrlLog";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Toy Box",
  description: "Toy Box",
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("toybox-theme");document.documentElement.setAttribute("data-theme",t==="light"?"light":"dark");}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-body Custom__Scrollbar">
        <StoreProvider>
          <ThemeProvider>
            <ApiBackendUrlLog />
            {children}
            <ToastProvider />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
