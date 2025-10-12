import BasicHero from "@/components/constants/Heros/BasicHero";
import CTA from "@/components/constants/Sections/CTA";
import About from "@/components/pages/Home/About";
import Actions from "@/components/pages/Home/Actions";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <BasicHero />
      <div className="py-12 md:py-16 bg-gray-50">
        <Actions />
      </div>
      <div className="py-12 md:py-16">
        <About />
      </div> 
      <CTA />
    </div>
  );
}
