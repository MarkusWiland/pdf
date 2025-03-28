import BgGradient from '@/components/common/bg-gradient'
import DemoSection from '@/components/home/demo-section'
import HeroSection from '@/components/home/hero-section'
import { currentUser } from '@clerk/nextjs/server'

export default async function Home() {
  const user = await currentUser()
  console.log('user', user)
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
