import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Underground Club Manager",
  description: "A text-based management game where you run an underground nightclub",
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
