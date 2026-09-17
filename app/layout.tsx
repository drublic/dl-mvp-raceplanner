import type { Metadata } from "next";
import { Bricolage_Grotesque, Lato } from "next/font/google";
import { AppHeader } from "@/components/AppHeader";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Startlist",
  description: "Local club race planner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${bricolage.variable} ${lato.variable}`}>
        <div className="app-shell">
          <AppHeader />
          <main className="app-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
