import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Localio — Your Business Website, Built in 60 Seconds",
  description:
    "Answer 3 quick questions and we build a professional website for your local business — free, fast, no tech skills needed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";

  return (
    <html lang="en" className={jakarta.variable}>
      <body style={{ fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)" }}>
        {children}
        {paypalClientId && (
          <Script
            src={`https://www.paypal.com/sdk/js?client-id=${paypalClientId}&vault=true&intent=subscription`}
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  );
}
