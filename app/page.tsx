'use client';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProblemSection from '@/components/ProblemSection';
import SolutionSection from '@/components/SolutionSection';
import FeaturesSection from '@/components/FeaturesSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function Home() {
  return (
    <div style={{ position: 'relative', backgroundColor: '#0e1012', minHeight: '100vh' }}>
      <AnimatedBackground />
      <main style={{ position: 'relative', zIndex: 10 }}>
        <Header />
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <CTASection />
        <Footer />
      </main>
    </div>
  );
}
