import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { SponsorsSection } from "@/components/sponsors-section"
import { AppPreviewSection } from "@/components/app-preview-section"
import { StorePreviewSection } from "@/components/store-preview-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#1d2834]">
      <Navbar />
      <main>
        <HeroSection />
        <SponsorsSection />
        <AppPreviewSection />
        <StorePreviewSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
