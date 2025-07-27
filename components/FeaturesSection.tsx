"use client";
import React from 'react';
// import { FileText, ShieldCheck, Smartphone, Gift } from 'lucide-react';
import { Zap, Search, Upload, Lock, BookOpen, MonitorSmartphone } from 'lucide-react';


interface Feature {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    title: "Instant Answers",
    desc: "Get quick responses from your documents.",
    icon: <Zap className="w-8 h-8 text-indigo-600" />,
  },
  {
    title: "Data Extraction",
    desc: "Extract insights and key data points effortlessly.",
    icon: <BookOpen className="w-8 h-8 text-indigo-600" />,
  },
  {
    title: "Contextual Search",
    desc: "Search for information with context-aware results.",
    icon: <Search className="w-8 h-8 text-indigo-600" />,
  },
  {
    title: "Seamless Upload",
    desc: "Upload PDFs with a simple drag and drop.",
    icon: <Upload className="w-8 h-8 text-indigo-600" />,
  },
  {
    title: "Privacy Focused",
    desc: "We prioritize your data privacy and security.",
    icon: <Lock className="w-8 h-8 text-indigo-600" />,
  },
  {
    title: "Multi-Device Access",
    desc: "Access your PDFs from any device, anytime.",
    icon: <MonitorSmartphone className="w-8 h-8 text-indigo-600" />,
  },
];

// const features = [
//     {
//         title: "Interact with PDFs",
//         description: "Upload PDFs and interact with them by asking questions or searching for specific information.",
//         icon: <FileText className="w-8 h-8 text-indigo-600" />,
//     },
//     {
//         title: "Secure and Private",
//         description: "We prioritize your privacy. All documents are processed securely without being stored.",
//         icon: <ShieldCheck className="w-8 h-8 text-indigo-600" />,
//     },
//     {
//         title: "Mobile Friendly",
//         description: "Our service works smoothly on all devices, providing you a seamless experience.",
//         icon: <Smartphone className="w-8 h-8 text-indigo-600" />,
//     },
//     {
//         title: "Free Trial Available",
//         description: "Try our services for free to explore all features before making a commitment.",
//         icon: <Gift className="w-8 h-8 text-indigo-600" />,
//     },
// ];

// export default function FeatureSection() {

//   return (
//     <div className="py-16 bg-indigo-50 dark:bg-gray-800">
//       <div className="max-w-5xl mx-auto px-6 text-center">
//         <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Features</h2>
//         <p className="mt-4 text-gray-600 dark:text-gray-300">
//           Discover how our platform helps you interact with your documents like never before.
//         </p>
//         <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//           {features.map((feature, idx) => (
//             <div key={idx} className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
//               <div className="flex items-center justify-center mb-4">
//                 {feature.icon}
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{feature.title}</h3>
//               <p className="mt-2 text-gray-600 dark:text-gray-400">{feature.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



export default function FeaturesSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-800 relative">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white text-center animate-fade-in-up">
          Powerful Features to Enhance Your Workflow
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 text-center animate-fade-in-up delay-100">
          Discover how our tool can transform your PDF interactions.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature: Feature, idx: number) => (
            <div
              key={idx}
              className="relative bg-indigo-50 dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center group animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center justify-center mb-4 animate-pop-in">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white animate-fade-in">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300 animate-fade-in">
                {feature.desc}
              </p>
              <div className="absolute -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            </div>
          ))}
        </div>
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
