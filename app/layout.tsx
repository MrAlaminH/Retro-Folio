import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { PHProvider } from "./providers";
import dynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FontProvider } from "@/contexts/FontContext";

const PostHogPageView = dynamic(() => import("./PostHogPageView"), {
  ssr: false,
});

const MatrixCursor = dynamic(
  () => import("@/components/MatrixCursor/MatrixCursor"),
  {
    ssr: false,
  }
);

const ChatWidget = dynamic(() => import("@/components/ChatWidget"), {
  ssr: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://uralamin.is-a.dev/"),
  title: {
    default: "MrAlaminH: Code, Create, Innovate",
    template:
      "A showcase of MrAlaminH journey | I'm on a journey to blend creativity with technology.",
  },
  description:
    "A showcase of MrAlaminH journey | I'm on a journey to blend creativity with technology.",
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    images: "/opengraph-image.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <PHProvider>
        <ThemeProvider>
          <FontProvider>
            <body className="bg-white dark:bg-stone-900 text-black dark:text-white">
              <PostHogPageView />
              <Navbar />
              <div className=""></div>
              {children}
              <Analytics />
              <MatrixCursor />
              <Footer />
              <ChatWidget />
            </body>
          </FontProvider>
        </ThemeProvider>
      </PHProvider>
    </html>
  );
}
