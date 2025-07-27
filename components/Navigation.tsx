"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import Link from "next/link";
import { Menu } from "lucide-react";
import * as React from "react";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { Button } from "@/components/ui/button";


interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
];

export default function Navigation() {
  return (
    <nav className="w-full">
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center justify-between px-6 py-3 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm rounded-2xl mt-4 mx-auto max-w-5xl animate-fade-in-down">
        <div className="flex items-center gap-3">
          <img src="/file.svg" alt="Logo" className="h-8 w-8 animate-fade-in-spin" />
          <span className="font-extrabold text-xl tracking-tight text-indigo-700 dark:text-indigo-300">ChatPDF</span>
        </div>
        <NavigationMenu className="flex items-center gap-6">
          <NavigationMenuList>
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <Link href={link.href} passHref legacyBehavior>
                  <NavigationMenuLink className="relative px-4 py-2 font-medium text-gray-700 dark:text-gray-200 transition hover:text-indigo-600 dark:hover:text-indigo-400 group">
                    {link.label}
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full group-hover:h-0.5"></span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
            <div>
              <SignedOut>
                <Button>
                  <SignInButton />
                </Button>
              </SignedOut>
              <SignedIn>
                <div className="flex justify-center items-center gap-x-3">
                <Button>
                <Link href="/dashboard">
                  Dashboard
                </Link>
                </Button>
                <UserButton />
                </div>
              </SignedIn>
            </div>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {/* Mobile Nav - toggle left, then logo, then rest */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm rounded-2xl mt-4 mx-2 animate-fade-in-down">
        <Sheet>
          <SheetTrigger asChild>
            <button aria-label="Open menu" className="p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900 transition mr-2">
              <Menu className="h-6 w-6 text-indigo-700 dark:text-indigo-300" />
            </button>
            
          </SheetTrigger>
          <SheetContent side="left" className="w-3/4 max-w-xs bg-white dark:bg-gray-900 animate-slide-in-left">
            <div className="flex flex-col gap-6 mt-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-lg font-semibold text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  {link.label}
                </Link>
              ))}
            </div>
          </SheetContent>

        </Sheet>
        <div className="flex items-center gap-2 flex-1">
          <img src="/file.svg" alt="Logo" className="h-7 w-7 animate-fade-in-spin" />
          <span className="font-extrabold text-lg tracking-tight text-indigo-700 dark:text-indigo-300">ChatPDF</span>
        </div>
        <div>
          <SignedOut>
            <Button>
              <SignInButton />
            </Button>
          </SignedOut>
          <SignedIn>
            <div className="flex justify-center items-center gap-x-3">
            <Button>
            <Link href="/dashboard">
              Dashboard
            </Link>
            </Button>
            <UserButton />
            </div>
          </SignedIn>
        </div>
        {/* Add any right-side mobile actions here if needed */}
      </div>
      <style jsx global>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.6s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fade-in-spin {
          0% { transform: rotate(-10deg) scale(0.9); opacity: 0; }
          100% { transform: rotate(0deg) scale(1); opacity: 1; }
        }
        .animate-fade-in-spin { animation: fade-in-spin 0.7s cubic-bezier(.4,0,.2,1) both; }
        @keyframes slide-in-left {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-left { animation: slide-in-left 0.4s cubic-bezier(.4,0,.2,1) both; }
      `}</style>
    </nav>
  );
}