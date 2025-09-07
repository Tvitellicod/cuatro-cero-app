import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#213041] border-t border-[#305176] py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand - Logo centrado */}
          <div className="sm:col-span-2 lg:col-span-1 text-center">
            <div className="flex justify-center mb-4">
              <img src="/images/cuatro-cero-logo.png" alt="CUATRO CERO - Gestión de Equipo" className="h-12 w-auto" />
            </div>
            <p className="text-gray-400 text-sm">
              La plataforma más completa para la gestión profesional de equipos de fútbol.
            </p>
          </div>

          {/* Navigation - Centrado */}
          <div className="text-center">
            <h3 className="text-white font-semibold mb-4">Navegación</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-400 hover:text-[#aff606] text-sm">
                Inicio
              </Link>
              <Link href="/tienda" className="block text-gray-400 hover:text-[#aff606] text-sm">
                Tienda
              </Link>
              <Link href="/gestion" className="block text-gray-400 hover:text-[#aff606] text-sm">
                Gestión
              </Link>
              <Link href="/contacto" className="block text-gray-400 hover:text-[#aff606] text-sm">
                Contacto
              </Link>
            </div>
          </div>

          {/* Contact - Centrado */}
          <div className="text-center">
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>WhatsApp: +54 9 11 1234-5678</p>
              <p>Email: info@cuatrocero.com</p>
              <p>Instagram: @cuatrocero</p>
            </div>
          </div>

          {/* Legal - Centrado */}
          <div className="text-center">
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <div className="space-y-2">
              <Link href="/terminos" className="block text-gray-400 hover:text-[#aff606] text-sm">
                Términos y Condiciones
              </Link>
              <Link href="/privacidad" className="block text-gray-400 hover:text-[#aff606] text-sm">
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[#305176] mt-6 pt-6 text-center">
          <p className="text-gray-400 text-sm">© 2025 CUATRO CERO. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
