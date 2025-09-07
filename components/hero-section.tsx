"use client"

export function HeroSection() {
  return (
    <section className="px-4 text-center py-[10] mt-2">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-0 mt-1.5">
          Gestiona tu equipo como un
          <span className="text-[#aff606]"> profesional</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-4 max-w-2xl mx-auto px-2">
          La plataforma más completa para la gestión de equipos de fútbol. Planifica entrenamientos, gestiona partidos y
          lleva estadísticas detalladas.
        </p>
      </div>
    </section>
  )
}
