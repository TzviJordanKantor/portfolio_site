import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tzvi Kantor — UX Writer · AI Content Systems",
  description: "UX writer and content systems builder with 10+ years across SaaS, enterprise security, and AI-assisted content workflows.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
