import HeroSection from "@/components/HeroSection";
import DraftInterface from "@/components/DraftInterface";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <div className="container mx-auto px-4 py-12">
        <DraftInterface />
      </div>
    </div>
  );
};

export default Index;
