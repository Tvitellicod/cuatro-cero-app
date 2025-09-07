import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ContactPageSection } from "@/components/contact-page-section"

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-[#1d2834]">
      <Navbar />
      <main className="py-4">
        <ContactPageSection />
      </main>
      <Footer />
    </div>
  )
}
