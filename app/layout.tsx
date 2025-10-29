import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://invoicly.ditin.in"),
  title: "Invoicly - Manage your invoices with ease, speed, and clarity.",
  description:
    "Manage your invoices with ease, speed, and clarity. Perfect for freelancers, entrepreneurs, and small businesses.",
  keywords:
    "invoices, invoice management, invoice automation, invoice tracking, invoice creation, invoice sending, invoice receiving",
  authors: [{ name: "Invoicly" }],
  creator: "Ditin Agrawal",
  publisher: "Ditin Agrawal",
  robots: "index, follow",
  openGraph: {
    title: "Invoicly - Manage your invoices with ease, speed, and clarity.",
    description:
      "Manage your invoices with ease, speed, and clarity. Perfect for freelancers, entrepreneurs, and small businesses.",
    url: "https://invoicly.ditin.in",
    siteName: "Invoicly - Manage your invoices with ease, speed, and clarity.",
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "Invoicly - Manage your invoices with ease, speed, and clarity.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Invoicly - Manage your invoices with ease, speed, and clarity.",
    description:
      "Manage your invoices with ease, speed, and clarity. Perfect for freelancers, entrepreneurs, and small businesses.",
    images: ["/og.webp"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const themeColor = "#ffffff";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCReactProvider>
      <html lang="en">
        <body className={`${notoSans.className} antialiased`}>
          {children}
          <Toaster />
        </body>
      </html>
    </TRPCReactProvider>
  );
}
