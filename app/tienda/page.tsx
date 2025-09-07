import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { StoreSection } from "@/components/store-section"

export default function TiendaPage() {
  return (
    <div className="min-h-screen bg-[#1d2834]">
      <Navbar />
      <main className="py-2.5 pb-6">
        <StoreSection />
      </main>
      <Footer />
    </div>
  )
}
