import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Library Management",
  description: "Manage books and check-in/check-out",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
