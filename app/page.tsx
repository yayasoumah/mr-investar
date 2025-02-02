import { Header } from "@/components/landing-page/Header";
import { Hero } from "@/components/landing-page/Hero";
import { Opportunities } from "@/components/landing-page/Opportunities";
import { OurProcess } from "@/components/landing-page/OurProcess";
import { TeamPreview } from "@/components/landing-page/TeamPreview";
import { Footer } from "@/components/landing-page/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Opportunities />
      <TeamPreview />
      <OurProcess />
      <Footer />
    </main>
  );
}
