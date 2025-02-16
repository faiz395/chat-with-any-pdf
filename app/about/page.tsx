import React from "react";
import { Heart, Target, Users, Star, Globe, Code } from "lucide-react";

export default function About() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <div className="py-20 md:py-40 dark:bg-gray-800 text-center px-6">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">
          About Us
        </h1>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Discover who we are, what we believe in, and how we strive to provide
          innovative solutions for seamless document interactions.
        </p>
      </div>

      {/* Our Mission & Values */}
      <div className="py-16 bg-indigo-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
            Our Mission & Values
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">
            Our mission is to empower users by making document interaction as
            seamless, secure, and insightful as possible. We are committed to
            excellence, integrity, and transparency in everything we do.
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
              {
                title: "Excellence",
                desc: "We strive to deliver exceptional value in every aspect of our work.",
                icon: <Star className="w-8 h-8 text-indigo-600" />,
              },
              {
                title: "Global Reach",
                desc: "We aim to make an impact by empowering users worldwide.",
                icon: <Globe className="w-8 h-8 text-indigo-600" />,
              },
              {
                title: "Technical Mastery",
                desc: "We combine deep technical expertise with a user-first approach.",
                icon: <Code className="w-8 h-8 text-indigo-600" />,
              },
            ].map((value, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {value.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meet Our Team */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
            Meet Our Team
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">
            A team of experts passionate about revolutionizing PDF interactions
            and creating impactful solutions.
          </p>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Alex Smith",
                role: "CEO & Founder",
                bio: "Visionary leader focused on innovation and impact.",
              },
              {
                name: "Jane Doe",
                role: "CTO",
                bio: "Tech enthusiast with a deep love for AI and automation.",
              },
              {
                name: "John Doe",
                role: "Head of Design",
                bio: "Creative mind ensuring the best user experience.",
              },
              {
                name: "Sarah Lee",
                role: "Marketing Director",
                bio: "Strategist with a passion for driving user engagement.",
              },
              {
                name: "Michael Brown",
                role: "Lead Engineer",
                bio: "Problem solver with expertise in scalable systems.",
              },
              {
                name: "Emily Davis",
                role: "Customer Success Manager",
                bio: "Dedicated to ensuring user satisfaction and success.",
              },
            ].map((teamMember, idx) => (
              <div
                key={idx}
                className="bg-indigo-50 dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 text-center"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {teamMember.name}
                </h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                  {teamMember.role}
                </p>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {teamMember.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-indigo-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
            What Our Users Say
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">
            Hear from our satisfied users who have experienced the impact of our
            platform.
          </p>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Anna Johnson",
                feedback:
                  "The platform is intuitive and has significantly improved my workflow.",
              },
              {
                name: "David Wilson",
                feedback:
                  "I love how secure and reliable the system is for managing my documents.",
              },
              {
                name: "Sophia Martinez",
                feedback:
                  "The innovative features have saved me so much time!",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
              >
                <p className="text-gray-600 dark:text-gray-300 italic">
                &quot;{testimonial.feedback}&quot;
                </p>
                <p className="mt-4 font-medium text-gray-900 dark:text-white">
                  - {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
