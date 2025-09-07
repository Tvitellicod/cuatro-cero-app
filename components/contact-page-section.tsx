import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Mail, Instagram } from "lucide-react"

export function ContactPageSection() {
  const contactMethods = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Chatea con nosotros en tiempo real",
      detail: "+54 9 11 1234-5678",
      action: "Abrir Chat",
      color: "bg-[#25d03f]",
      hoverColor: "hover:bg-[#20b136]",
    },
    {
      icon: Instagram,
      title: "Instagram",
      description: "Síguenos para contenido exclusivo",
      detail: "@cuatrocero",
      action: "Seguir",
      color: "bg-[#ea3498]",
      hoverColor: "hover:bg-[#d53e3e]",
    },
    {
      icon: Mail,
      title: "Email",
      description: "Envíanos un correo electrónico",
      detail: "info@cuatrocero.com",
      action: "Escribir",
      color: "bg-[#33d9f6]",
      hoverColor: "hover:bg-[#334be8]",
    },
  ]

  const faqs = [
    {
      question: "¿Cuál es el mejor plan para mi equipo?",
      answer:
        "Depende del tamaño de tu club y tus necesidades. Contáctanos por WhatsApp y te ayudaremos a elegir el plan perfecto.",
    },
    {
      question: "¿Puedo cambiar de plan después?",
      answer: "Sí, puedes actualizar o cambiar tu plan en cualquier momento desde tu panel de control.",
    },
    {
      question: "¿Ofrecen soporte técnico?",
      answer:
        "Todos nuestros planes incluyen soporte técnico. Los planes superiores tienen soporte prioritario y 24/7.",
    },
    {
      question: "¿Hay período de prueba gratuito?",
      answer: "Sí, ofrecemos 14 días de prueba gratuita para que puedas probar todas las funcionalidades.",
    },
    {
      question: "¿Los datos están seguros?",
      answer: "Absolutamente. Utilizamos encriptación de nivel bancario y respaldos automáticos diarios.",
    },
    {
      question: "¿Puedo importar datos de otras plataformas?",
      answer: "Sí, nuestro equipo te ayuda a migrar tus datos desde Excel, otras apps o sistemas existentes.",
    },
    {
      question: "¿Funciona sin conexión a internet?",
      answer:
        "La app requiere conexión para sincronizar, pero puedes consultar datos previamente cargados sin internet.",
    },
    {
      question: "¿Hay límite en el número de partidos?",
      answer:
        "No, puedes registrar partidos ilimitados en todos los planes. Solo varía el número de equipos y jugadores.",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Contacto</h1>
        <p className="text-lg md:text-xl text-gray-300 px-2">
          Estamos aquí para ayudarte. Elige la forma que prefieras para contactarnos
        </p>
      </div>

      {/* Main Contact Methods - Botones a la misma altura */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
  {contactMethods.map((method, index) => (
    <Card
      key={index}
      className="bg-[#213041] border-[#305176] flex flex-col h-full"
    >
      <CardContent className="p-4 text-center flex flex-col flex-1 pt-0 pb-0">
        <method.icon className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-white" />
        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
          {method.title}
        </h3>
        <p className="text-gray-400 text-sm mb-2">{method.description}</p>
        <p className="text-[#aff606] font-medium mb-4 text-sm md:text-base flex-1 flex items-center justify-center">
          {method.detail}
        </p>
        <Button
          className={`${method.color} text-white h-auto font-extrabold ${method.hoverColor} w-full mt-auto`}
        >
          {method.action}
        </Button>
      </CardContent>
    </Card>
  ))}
</div>


      {/* FAQ Section - Más preguntas */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardContent className="p-4">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">Preguntas Frecuentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-base md:text-lg font-semibold text-white">{faq.question}</h3>
                <p className="text-gray-400 text-sm md:text-base">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
