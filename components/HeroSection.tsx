import Link from 'next/link';
import React from 'react';
// import { cn } from 'shadcn-utils'; // Import utility if required for conditional styling

export default function HeroSection() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-6 py-16">
      <div className="max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
          Engage with Your PDFs Like Never Before
        </h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          Transform the way you interact with documents. Upload your PDFs and get instant answers, insights, and information, all powered by intelligent processing.
        </p>
        <button className="mt-8 px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900">
          <Link href={"/dashboard"}>
          Get Started
          </Link>
        </button>
      </div>
    </div>
  );
}
