"use client";
import Link from 'next/link';
import React from 'react';
// import { cn } from 'shadcn-utils'; // Import utility if required for conditional styling

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-4 py-20 sm:py-28 bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Animated Gradient Blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl absolute -top-32 -left-32 animate-pulse" />
        <div className="w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl absolute -bottom-32 -right-32 animate-pulse" />
      </div>
      <div className="relative z-10 max-w-3xl w-full text-center animate-fade-in">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-700 via-indigo-500 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in-up">
          Engage with Your PDFs Like Never Before
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
          Transform the way you interact with documents. Upload your PDFs and get instant answers, insights, and information, all powered by intelligent processing.
        </p>
        <Link href="/dashboard" passHref legacyBehavior>
          <a className="inline-block mt-10 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 animate-pop-in">
            Get Started
          </a>
        </Link>
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both; }
        .animate-fade-in-up { animation: fade-in 0.8s cubic-bezier(.4,0,.2,1) both; }
        .animate-pop-in { animation: pop-in 0.4s cubic-bezier(.4,0,.2,1) both; }
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.7); }
          80% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}
