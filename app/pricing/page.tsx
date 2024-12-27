import React from "react";

export default function Pricing() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <div className="py-20 md:py-40 dark:bg-gray-800 text-center px-6">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">
          Pricing Plans
        </h1>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Choose a plan that suits your needs. No hidden fees, no surprises—just
          great value for your business.
        </p>
      </div>

      {/* Pricing Plans */}
      <div className="py-16 bg-indigo-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
            Our Pricing
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">
            Whether you’re a solo user or a growing team, we’ve got a plan for
            you.
          </p>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
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
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`${
                  plan.isPopular ? "bg-indigo-600 text-white" : "bg-white"
                } dark:bg-gray-700 p-8 rounded-lg shadow hover:shadow-lg transition-shadow duration-300`}
              >
                {plan.isPopular && (
                  <div className="mb-4 text-center">
                    <span className="bg-indigo-700 text-white text-sm uppercase px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3
                  className={`text-2xl font-bold ${
                    plan.isPopular
                      ? "text-white"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {plan.title}
                </h3>
                <p
                  className={`mt-2 text-4xl font-extrabold ${
                    plan.isPopular
                      ? "text-white"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {plan.price}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {plan.period}
                </p>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className={`${
                        plan.isPopular
                          ? "text-indigo-100"
                          : "text-gray-600 dark:text-gray-300"
                      } flex items-center`}
                    >
                      <svg
                        className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <button
                    className={`${
                      plan.isPopular
                        ? "bg-white text-indigo-600 hover:bg-indigo-200"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    } px-6 py-3 rounded-lg text-lg font-medium transition-colors duration-300`}
                  >
                    {plan.button}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">
            Got questions? We’ve got answers. If you still have questions, feel
            free to contact our support team.
          </p>
          <div className="mt-12 grid gap-10 sm:grid-cols-1 lg:grid-cols-2">
            {[
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards, PayPal, and bank transfers for enterprise plans.",
              },
              {
                question: "Can I upgrade or downgrade my plan anytime?",
                answer:
                  "Yes, you can switch plans at any time to match your current needs.",
              },
              {
                question: "Is there a free trial available?",
                answer:
                  "Yes, we offer a 14-day free trial for all new users. No credit card required.",
              },
              {
                question: "Do you offer refunds?",
                answer:
                  "We offer refunds within 30 days of purchase if you are not satisfied with the service.",
              },
            ].map((faq, idx) => (
              <div key={idx}>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </h4>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}