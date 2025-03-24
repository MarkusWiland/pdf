import BgGradient from '@/components/common/bg-gradient'
import DemoSection from '@/components/home/demo-section'
import HeroSection from '@/components/home/hero-section'

export default function Home() {
  return (
    <div className="relative h-full">
      <BgGradient />
      <div className="flex flex-col">
        <HeroSection />
        <DemoSection />
      </div>

      {/* <HowItWorkSection />*/}
      {/* <PricingSection />*/}
    </div>
  )
}
