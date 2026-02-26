import { cn } from "@/lib/utils";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AccredSystem \u2014 \u0421\u0438\u0441\u0442\u0435\u043c\u0430 \u0430\u043a\u043a\u0440\u0435\u0434\u0438\u0442\u0430\u0446\u0438\u0438",
  description: "\u041b\u0438\u0447\u043d\u044b\u0439 \u043a\u0430\u0431\u0438\u043d\u0435\u0442 \u043f\u043e\u0434\u0440\u044f\u0434\u0447\u0438\u043a\u0430 \u0434\u043b\u044f \u0430\u043a\u043a\u0440\u0435\u0434\u0438\u0442\u0430\u0446\u0438\u0438 \u043d\u0430 \u043c\u0435\u0440\u043e\u043f\u0440\u0438\u044f\u0442\u0438\u044f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}