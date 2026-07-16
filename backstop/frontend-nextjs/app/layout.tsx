import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gleaner — Disruption-to-Dispatch",
  description: "AI-powered supply chain orchestration for food banks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Cera+Pro:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-void-black text-fog font-cera-pro antialiased">
        {children}
      </body>
    </html>
  );
}
