export default function FooterSection() {
    return (
      <footer className="py-8 bg-indigo-100 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-gray-700 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Your Company. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#privacy" className="text-gray-700 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400">
                Privacy Policy
              </a>
              <a href="#terms" className="text-gray-700 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400">
                Terms of Service
              </a>
              <a href="#contact" className="text-gray-700 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400">
                Contact Us
              </a>
            </div>
          </div>
          <div className="mt-6 flex justify-center space-x-4">
            <a href="#facebook" className="text-gray-700 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400">
              <span className="sr-only">Facebook</span>
              <svg className="h-5 w-5" /* Facebook SVG */></svg>
            </a>
            <a href="#twitter" className="text-gray-700 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" /* Twitter SVG */></svg>
            </a>
            <a href="#linkedin" className="text-gray-700 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-5 w-5" /* LinkedIn SVG */></svg>
            </a>
          </div>
        </div>
      </footer>
    );
  }
  