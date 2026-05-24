import HeroSection from './homeSections/HeroSection';
import ConfidenceSection from './homeSections/ConfidenceSection';
import ProcessingSection from './homeSections/ProcessingSection';
import PlatformSection from './homeSections/PlatformSection';
import TrendingSection from './homeSections/TrendingSection';
import InstallSection from './homeSections/InstallSection';
import CTASection from './homeSections/CTASection';
import Footer from './homeSections/Footer';

export default function HomePage() {
  return (
    <main className="marketsavy-page">
      <HeroSection />
      <ConfidenceSection />
      <ProcessingSection />
      <PlatformSection />
      <TrendingSection />
      <InstallSection />
      <CTASection />
      <Footer />
    </main>
  );
}
