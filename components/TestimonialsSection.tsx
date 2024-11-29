export default function TestimonialsSection() {
    return (
      <div className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            What Our Users Say
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Hear from our satisfied customers who have transformed their workflows.
          </p>
          <div className="mt-12 grid gap-10 sm:grid-cols-1 lg:grid-cols-2">
            {[
              { name: "John Doe", feedback: "This tool has made interacting with my PDFs a breeze!" },
              { name: "Jane Smith", feedback: "I love the efficiency and accuracy of this service." },
              { name: "Alice Johnson", feedback: "The contextual search is a game changer!" },
              { name: "Mark Lee", feedback: "Finally, a tool that lets me extract key data in seconds!" },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <p className="text-lg text-gray-700 dark:text-gray-300">"{testimonial.feedback}"</p>
                <h4 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                  - {testimonial.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  