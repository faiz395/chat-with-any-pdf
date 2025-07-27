// import { Accordion } from "@/components/ui/accordion";
import FAQSection from "@/components/FAQSection";
import FeaturesSection from "@/components/FeaturesSection";
// import FooterSection from "@/components/FooterSection";
import HeroSection from "@/components/HeroSection";
import TestimonialsSection from "@/components/TestimonialsSection";
// import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FAQSection />
    </main>
  );
}
