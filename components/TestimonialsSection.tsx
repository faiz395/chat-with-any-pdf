"use client";

interface Testimonial {
  name: string;
  feedback: string;
}

const testimonials: Testimonial[] = [
  { name: "John Doe", feedback: "This tool has made interacting with my PDFs a breeze!" },
  { name: "Jane Smith", feedback: "I love the efficiency and accuracy of this service." },
  { name: "Alice Johnson", feedback: "The contextual search is a game changer!" },
  { name: "Mark Lee", feedback: "Finally, a tool that lets me extract key data in seconds!" },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white animate-fade-in-up">
          What Our Users Say
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 animate-fade-in-up delay-100">
          Hear from our satisfied customers who have transformed their workflows.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
          {testimonials.map((testimonial: Testimonial, idx: number) => (
            <div
              key={idx}
              className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <svg className="mx-auto mb-4 w-8 h-8 text-indigo-400 dark:text-indigo-500 animate-pop-in" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 17a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v6a4 4 0 01-4 4m-6 4h6" /></svg>
              <p className="text-lg text-gray-700 dark:text-gray-300 italic animate-fade-in">
                &quot;{testimonial.feedback}&quot;
              </p>
              <h4 className="mt-4 text-xl font-semibold text-indigo-700 dark:text-indigo-300 animate-fade-in">
                - {testimonial.name}
              </h4>
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
  