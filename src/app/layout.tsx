import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "EchoID",
  description: "Web3 reputation you can verify",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-black text-white">
        <header className="border-b border-white/10">
          <div className="max-w-5xl mx-auto px-4 py-3 font-semibold">
            {process.env.NEXT_PUBLIC_APP_NAME || "EchoID"}
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
