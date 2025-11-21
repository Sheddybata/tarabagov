import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Taraba State Unified Citizen Portal",
  description: "Secure e-governance platform for Taraba State Government",
  icons: {
    icon: [
      { url: "/images/logo/Tarabastategovernmentlogo.jpg", type: "image/jpeg" },
      { url: "/images/logo/Tarabastategovernmentlogo.jpg", sizes: "32x32", type: "image/jpeg" },
      { url: "/images/logo/Tarabastategovernmentlogo.jpg", sizes: "16x16", type: "image/jpeg" },
    ],
    apple: [
      { url: "/images/logo/Tarabastategovernmentlogo.jpg", type: "image/jpeg" },
    ],
    shortcut: "/images/logo/Tarabastategovernmentlogo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

