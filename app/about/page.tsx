import React from 'react';
import { Heart, Target, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <div className="py-20 md:py-40 dark:bg-gray-800 text-center px-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          About Us
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover who we are, what we believe in, and how we strive to provide innovative solutions.
        </p>
      </div>


      {/* Our Values Section */}
      <div className="py-16 bg-indigo-50 dark:bg-gray-800">
        <div className="max-w-5xl py-10 md:py-28 mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
            Our Mission & Values
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 text-center">
          Our mission is to empower users by making document interaction as seamless, secure, and insightful as possible. We are committed to excellence, integrity, and transparency in everything we do.
          </p>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Integrity",
                desc: "We uphold the highest standards in all interactions.",
                icon: <Heart className="w-8 h-8 text-indigo-600" />,
              },
              {
                title: "Innovation",
                desc: "We continuously improve our platform to deliver top-notch solutions.",
                icon: <Target className="w-8 h-8 text-indigo-600" />,
              },
              {
                title: "Community",
                desc: "We are here for our users, dedicated to helping them succeed.",
                icon: <Users className="w-8 h-8 text-indigo-600" />,
              },
            ].map((value, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {value.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Team Section */}
      <div className="py-16  bg-white dark:bg-gray-900">
        <div className="max-w-5xl py-10 md:py-28 mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
            Meet Our Team
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 text-center">
            A team of experts passionate about revolutionizing PDF interactions.
          </p>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Alex Smith", role: "CEO & Founder", bio: "Visionary leader focused on innovation and impact." },
              { name: "Jane Doe", role: "CTO", bio: "Tech enthusiast with a deep love for AI and automation." },
              { name: "John Doe", role: "Head of Design", bio: "Creative mind ensuring the best user experience." },
            ].map((teamMember, idx) => (
              <div key={idx} className="bg-indigo-50 dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {teamMember.name}
                </h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-medium">{teamMember.role}</p>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{teamMember.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
