import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Mail, Instagram } from "lucide-react"

export function ContactSection() {
  return (
    <section className="py-4 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">¿Necesitas ayuda?</h2>
        <p className="text-lg md:text-xl text-gray-300 mb-4 px-2">
          Escribimos por la Red Social que te sea más cómoda!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-[#213041] border-[#305176]">
            <CardContent className="p-4 text-center py-4">
              <MessageCircle className="h-10 w-10 md:h-12 md:w-12 text-[#25d03f] mx-auto mb-2" />
              <h3 className="text-base md:text-lg font-semibold text-white mb-1">WhatsApp</h3>
              <p className="text-gray-400 text-sm mb-2">Chatea con nosotros en tiempo real</p>
              <Button size="sm" className="bg-[#25d03f] text-black hover:bg-[#20b136] w-full mt-7">
                Abrir Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#213041] border-[#305176]">
            <CardContent className="p-4 text-center">
              <Instagram className="h-10 w-10 md:h-12 md:w-12 text-[#ea3498] mx-auto mb-2" />
              <h3 className="text-base md:text-lg font-semibold text-white mb-1">Instagram</h3>
              <p className="text-gray-400 text-sm mb-2">Síguenos para contenido exclusivo</p>
              <Button size="sm" className="bg-[#ea3498] text-white hover:bg-[#d53e3e] w-full mx-0 mt-7">
                Seguir
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#213041] border-[#305176] sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 text-center">
              <Mail className="h-10 w-10 md:h-12 md:w-12 text-[#33d9f6] mx-auto mb-2" />
              <h3 className="text-base md:text-lg font-semibold text-white mb-1">Email</h3>
              <p className="text-gray-400 text-sm mb-2">Envíanos un correo electrónico</p>
              <Button size="sm" className="bg-[#33d9f6] text-black hover:bg-[#334be8] w-full mt-7">
                Escribir
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
