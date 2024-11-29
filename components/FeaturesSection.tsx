import React from 'react';
import { FileText, ShieldCheck, Smartphone, Gift } from 'lucide-react';
import { Zap, Search, Upload, Lock, BookOpen, MonitorSmartphone } from 'lucide-react';


const features = [
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
        <div className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-5xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
                    Powerful Features to Enhance Your Workflow
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 text-center">
                    Discover how our tool can transform your PDF interactions.
                </p>
                <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="bg-indigo-50 dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="flex items-center justify-center mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {feature.title}
                            </h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-300">{feature.desc}</p>
                            {/* <p className="mt-2 text-gray-600 dark:text-gray-300">{feature.description}</p> */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
