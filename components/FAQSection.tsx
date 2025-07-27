"use client";
import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"



interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How does the PDF interaction work?",
    answer:
      "Simply upload your PDF, and our tool will analyze its contents. You can then ask questions or search for specific information.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we prioritize your privacy. All documents are processed securely, and we do not store your files after interaction.",
  },
  {
    question: "Can I use this on mobile?",
    answer:
      "Absolutely! Our service is fully responsive, so you can use it on any device.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Yes, we offer a free trial so you can explore our features before committing to a plan.",
  },
];

export default function FAQSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white animate-fade-in-up">
          Frequently Asked Questions
        </h2>
        <div className="mt-8 space-y-6 animate-fade-in-up delay-100">
          {faqs.map((faq: FAQ, idx: number) => (
            <Accordion key={idx} className="text-left animate-fade-in-up" type="multiple">
              <AccordionItem value={`item-${idx}`}>
                <AccordionTrigger>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {faq.question}
                  </h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
      `}</style>
    </section>
  );
}
