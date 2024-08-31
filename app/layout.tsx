import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import MatrixCursor from "@/components/MatrixCursor/MatrixCursor";

export const metadata: Metadata = {
  title: "MrAlaminH",
  description: "Alamin's Worls",
};

const ibmBios = localFont({ src: "../public/fonts/WebPlus_IBM_BIOS.woff" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ibmBios.className} bg-black`}>
        <Navbar />
        {children}
        <MatrixCursor />
        <Footer />
      </body>
    </html>
  );
}
