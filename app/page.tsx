import BasicHero from "@/components/constants/Heros/BasicHero";
import About from "@/components/pages/Home/About";
import Actions from "@/components/pages/Home/Actions";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <BasicHero />
      <Actions />
      <About />
      {/* <Events /> */}
    </div>
  );
}
