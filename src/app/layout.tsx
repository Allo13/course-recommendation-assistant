import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Course Rec Assistant | Study Abroad Counselor Copilot",
  description:
    "AI-powered RAG course recommendation system for study abroad counselors during live student counseling sessions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-blue-500 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
