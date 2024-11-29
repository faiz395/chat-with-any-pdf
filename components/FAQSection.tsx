import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


export default function FAQSection() {
    const faqs = [
        {
            question: "How does the PDF interaction work?",
            answer: "Simply upload your PDF, and our tool will analyze its contents. You can then ask questions or search for specific information.",
        },
        {
            question: "Is my data secure?",
            answer: "Yes, we prioritize your privacy. All documents are processed securely, and we do not store your files after interaction.",
        },
        {
            question: "Can I use this on mobile?",
            answer: "Absolutely! Our service is fully responsive, so you can use it on any device.",
        },
        {
            question: "Do you offer a free trial?",
            answer: "Yes, we offer a free trial so you can explore our features before committing to a plan.",
        },
    ];

    return (
        <div className="py-16 bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
                <div className="mt-8 space-y-6">
                {faqs.map((faq, idx) => (

                    <Accordion key={idx} className="text-left" type="multiple">
                        <AccordionItem value="item-idx">
                            <AccordionTrigger>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{faq.question}</h3>
                            </AccordionTrigger>
                            <AccordionContent>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">{faq.answer}</p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ))}
                </div>
            </div>
        </div>
    );
}
