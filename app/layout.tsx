import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import MatrixCursor from "@/components/MatrixCursor/MatrixCursor";
import { PHProvider } from "./providers";
import dynamic from "next/dynamic";

const PostHogPageView = dynamic(() => import("./PostHogPageView"), {
  ssr: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://uralamin.is-a.dev/"),
  title: {
    default: "MrAlaminH: Code, Create, Innovate",
    template:
      "A showcase of MrAlaminH journey | I’m on a journey to blend creativity with technology.",
  },
  description:
    "A showcase of MrAlaminH journey | I’m on a journey to blend creativity with technology.",
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    images: "/opengraph-image.png",
  },
};

const ibmBios = localFont({ src: "../public/fonts/WebPlus_IBM_BIOS.woff" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <PHProvider>
        <body className={`${ibmBios.className} bg-black`}>
          <PostHogPageView />
          <Navbar />
          {children}
          <MatrixCursor />
          <Footer />
        </body>
      </PHProvider>
    </html>
  );
}
