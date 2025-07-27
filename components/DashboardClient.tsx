"use client";
import React from "react";
import PDFList from "@/components/PDFList";

interface DashboardClientProps {
  documents: any[];
}

export default function DashboardClient({ documents }: DashboardClientProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col w-full">
      {/* Upload Button Section */}
      <section className="w-full flex flex-col items-center justify-center py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="w-80 h-80 bg-indigo-300/30 rounded-full blur-3xl absolute -top-32 -left-32 animate-pulse" />
          <div className="w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl absolute -bottom-32 -right-32 animate-pulse" />
        </div>
        <div className="relative z-10 flex flex-col items-center w-full max-w-xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center animate-fade-in-up">Welcome to Your Dashboard</h1>
          <a href="/dashboard/upload" className="inline-block px-8 py-4 text-lg font-semibold rounded-xl shadow-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 animate-pop-in">
            Upload Your PDF
          </a>
        </div>
      </section>

      {/* My Documents Section */}
      <section className="w-full flex flex-col items-center justify-center py-10 px-4">
        <div className="w-full max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-8 animate-fade-in-up">My Documents</h2>
          <div className="animate-fade-in-up">
            <PDFList documents={documents} />
          </div>
        </div>
      </section>
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
    </main>
  );
}
