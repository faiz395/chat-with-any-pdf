"use client";
import * as React from "react";

interface FooterLink {
  label: string;
  href: string;
}

const footerLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms of Service", href: "#terms" },
  { label: "Contact Us", href: "#contact" },
];

const socialLinks = [
  { label: "Facebook", href: "#facebook", icon: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12"/></svg>
  ) },
  { label: "Twitter", href: "#twitter", icon: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.92 4.92 0 0 0 16.616 3c-2.73 0-4.942 2.21-4.942 4.936 0 .39.045.765.127 1.124C7.728 8.84 4.1 6.884 1.671 3.965c-.427.734-.666 1.584-.666 2.491 0 1.72.875 3.234 2.205 4.122a4.904 4.904 0 0 1-2.237-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 19.54a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.21-.005-.423-.015-.633A9.936 9.936 0 0 0 24 4.557z"/></svg>
  ) },
  { label: "LinkedIn", href: "#linkedin", icon: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.29c-.966 0-1.75-.79-1.75-1.75s.784-1.75 1.75-1.75 1.75.79 1.75 1.75-.784 1.75-1.75 1.75zm13.5 10.29h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.38v4.59h-3v-9h2.89v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v4.74z"/></svg>
  ) },
];

const FooterSection: React.FC = () => {
  return (
    <footer className="w-full py-8 bg-gradient-to-t from-indigo-100/80 via-white/80 to-white dark:from-gray-900 dark:via-gray-900/80 dark:to-gray-800 animate-fade-in-up">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
          <div className="flex items-center gap-2 animate-fade-in-spin">
            <img src="/file.svg" alt="Logo" className="h-7 w-7" />
            <span className="font-bold text-lg text-indigo-700 dark:text-indigo-300">ChatPDF</span>
          </div>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {footerLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all duration-200 underline-offset-4 hover:underline">
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-center space-x-6 animate-fade-in-up">
          {socialLinks.map((social) => (
            <a key={social.href} href={social.href} aria-label={social.label} className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-transform transform hover:scale-110">
              {social.icon}
            </a>
          ))}
        </div>
        <div className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm animate-fade-in-up">
          &copy; {new Date().getFullYear()} ChatPDF. All rights reserved.
        </div>
      </div>
      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.7s cubic-bezier(.4,0,.2,1) both; }
        .animate-fade-in-spin { animation: fade-in-spin 0.7s cubic-bezier(.4,0,.2,1) both; }
      `}</style>
    </footer>
  );
};

export default FooterSection;
  