import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "DUEZERO AI — Never miss a deadline",
  description: "One calm command center for renewals, bills and important deadlines.",
  manifest: "/manifest.webmanifest",
  themeColor: "#0b0d12"
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}