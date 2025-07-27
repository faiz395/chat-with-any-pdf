import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"


import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FooterSection from "@/components/FooterSection";
import Navigation from "@/components/Navigation";


// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "ChatPDF - Chat with Any PDF Instantly | AI PDF Q&A",
  description: "ChatPDF lets you chat with any PDF using AI. Instantly upload, ask questions, and get answers from your documents. Secure, fast, and free.",
  keywords: [
    "ChatPDF",
    "PDF chat",
    "AI PDF",
    "PDF Q&A",
    "Document AI",
    "Ask PDF",
    "PDF assistant",
    "Chat with PDF"
  ],
  openGraph: {
    title: "ChatPDF - Chat with Any PDF Instantly | AI PDF Q&A",
    description: "ChatPDF lets you chat with any PDF using AI. Instantly upload, ask questions, and get answers from your documents. Secure, fast, and free.",
    url: "https://chatpdf.example.com",
    siteName: "ChatPDF",
    images: [
      {
        url: "/file.svg",
        width: 1200,
        height: 630,
        alt: "ChatPDF Logo"
      }
    ],
    locale: "en_US",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {/* Only use Navigation component for all views, remove duplicate nav */}
          <Navigation />
          {/*           
          */}
          {children}
          <FooterSection />
        </body>
      </html>
    </ClerkProvider>
  )
}
