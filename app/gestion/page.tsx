import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PlansSection } from "@/components/plans-section"

export default function GestionPage() {
  return (
    <div className="min-h-screen bg-[#1d2834]">
      <Navbar />
      <main className="py-4">
        <PlansSection />
      </main>
      <Footer />
    </div>
  )
}
