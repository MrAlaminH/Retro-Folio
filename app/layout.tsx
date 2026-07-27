import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

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

const PHProvider = dynamic(() => import("./providers").then((mod) => mod.PHProvider), {
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem("theme");
                  if (theme === "light") {
                    document.documentElement.classList.remove("dark");
                  } else {
                    document.documentElement.classList.add("dark");
                  }
                  // Disable transitions on initial load to prevent flash
                  document.documentElement.classList.add("disable-transitions");
                  // Re-enable after first paint
                  requestAnimationFrame(function() {
                    requestAnimationFrame(function() {
                      document.documentElement.classList.remove("disable-transitions");
                    });
                  });
                } catch(e) {}
              })();
            `,
          }}
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
