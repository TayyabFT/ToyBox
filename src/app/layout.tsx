import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import StoreProvider from "@/store/StoreProvider";
import ToastProvider from "@/components/common/ToastProvider";
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
    <html lang="en" className={`${roboto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-body Custom__Scrollbar">
        <StoreProvider>
          {children}
          <ToastProvider />
        </StoreProvider>
      </body>
    </html>
  );
}
