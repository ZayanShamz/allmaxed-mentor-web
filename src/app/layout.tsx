import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import AuthWrapper from "@/components/AuthWrapper";

export const metadata: Metadata = {
  title: "Allmaxed",
  description: "Web for Allmaxed Mentors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientProviders>
          <AuthWrapper>{children}</AuthWrapper>
        </ClientProviders>
      </body>
    </html>
  );
}
