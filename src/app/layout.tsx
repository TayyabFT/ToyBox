import type { Metadata } from "next";
import { Alegreya_Sans, Montserrat } from "next/font/google";
import StoreProvider from "@/store/StoreProvider";
import ToastProvider from "@/components/common/ToastProvider";
import { ApiBackendUrlLog } from "@/components/common/ApiBackendUrlLog";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import "./globals.css";

/** Headings — replaces Copperplate; kept as --font-copperplate for existing utilities */
const montserrat = Montserrat({
  variable: "--font-copperplate",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

/** Body / UI — replaces Roboto; kept as --font-roboto for existing utilities */
const alegreyaSans = Alegreya_Sans({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
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
    <html
      lang="en"
      className={`${montserrat.variable} ${alegreyaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
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
