import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Repogrep",
  description: "Ultra fast codebase search",
  icons: {
    icon: "https://ext.same-assets.com/663910855/2968358006.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
