import type { Metadata } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "SantriOnline App",
  description: "Aplikasi iuran, hafalan, dan komunitas SantriOnline",
  metadataBase: new URL("https://app.santrionline.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="pb-20">
        <main className="max-w-3xl mx-auto p-4 space-y-4">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
