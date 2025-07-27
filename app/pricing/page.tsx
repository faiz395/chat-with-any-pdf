"use client";
import React from "react";
import { CheckCircle } from "lucide-react";

interface Plan {
  title: string;
  price: string;
  period: string;
  features: string[];
  button: string;
  isPopular?: boolean;
}

const plans: Plan[] = [
  {
    title: "Basic",
    price: "$9",
    period: "per month",
    features: [
      "Access to all basic features",
      "5 PDF uploads per day",
      "Email support",
    ],
    button: "Get Started",
  },
  {
    title: "Pro",
    price: "$29",
    period: "per month",
    features: [
      "Unlimited PDF uploads",
      "Advanced AI capabilities",
      "Priority email support",
    ],
    button: "Upgrade Now",
    isPopular: true,
  },
  {
    title: "Enterprise",
    price: "Custom",
    period: "Contact Us",
    features: [
      "Custom solutions for your business",
      "Dedicated account manager",
      "24/7 premium support",
    ],
    button: "Contact Sales",
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white flex flex-col">
      {/* Hero Section */}
      <div className="relative py-20 md:py-32 text-center px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl absolute -top-32 -left-32 animate-pulse" />
          <div className="w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl absolute -bottom-32 -right-32 animate-pulse" />
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-700 via-indigo-500 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in">
          Pricing Plans
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in delay-100">
          Choose a plan that suits your needs. No hidden fees, no surprises—just great value for your business.
        </p>
      </div>

      {/* Pricing Plans */}
      <div className="py-16 bg-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white animate-fade-in-up">
            Our Pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto animate-fade-in-up delay-100">
            Whether you’re a solo user or a growing team, we’ve got a plan for you.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan: Plan, idx: number) => (
              <div
                key={idx}
                className={`relative group rounded-3xl shadow-xl border border-indigo-100 dark:border-gray-700 bg-white dark:bg-gray-800 px-8 py-10 flex flex-col items-center transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:border-indigo-400 dark:hover:border-indigo-500 animate-fade-in-up ${plan.isPopular ? "ring-2 ring-indigo-500 scale-[1.04] z-10" : ""}`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {plan.isPopular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold uppercase px-4 py-1 rounded-full shadow animate-bounce">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl sm:text-2xl font-bold text-center mb-2 tracking-tight animate-fade-in">
                  {plan.title}
                </h3>
                <p className="mt-2 text-4xl font-extrabold text-indigo-700 dark:text-indigo-300 animate-fade-in">
                  {plan.price}
                  <span className="text-base font-medium text-gray-600 dark:text-gray-300 ml-2">{plan.period}</span>
                </p>
                <ul className="mt-8 space-y-4 w-full animate-fade-in">
                  {plan.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-200 text-base">
                      <CheckCircle className="w-5 h-5 text-indigo-500 dark:text-indigo-400 animate-pop-in" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-8 w-full py-3 rounded-xl font-semibold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 shadow-md animate-fade-in-up ${plan.isPopular ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-gray-700 dark:text-indigo-200 dark:hover:bg-gray-600"}`}
                >
                  {plan.button}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section (empty for now, can be filled as needed) */}
      <div className="py-16 bg-white dark:bg-gray-900"></div>
      {/* Animations */}
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
        .animate-bounce { animation: bounce 1.2s infinite alternate; }
        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}