import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MissionSection from "@/components/MissionSection";
import AppraisalSection from "@/components/AppraisalSection";
import GuidesSection from "@/components/GuidesSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <MissionSection />
      <AppraisalSection />
      <GuidesSection />
    </div>
  );
};

export default Index;

