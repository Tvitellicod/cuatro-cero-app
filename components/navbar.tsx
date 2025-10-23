"use client"

import Link from "next/link"
import { ShoppingCart, User, Menu, X, Trash2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet" 
import { ScrollArea } from "@/components/ui/scroll-area" 
import { useMockIntegration } from "@/hooks/use-mock-integration" 
import { toast } from "@/hooks/use-toast"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false) 
  const { cart, cartTotalItems, clearCart, getEbooks, removeItemFromCart } = useCart() 
  const { integrateEbooks, hasManagementService } = useMockIntegration() 

  const subtotal = cart.reduce((sum, item) => {
    const priceNum = parseFloat(item.price.replace('$', '')) || 0;
    return sum + priceNum * item.quantity;
  }, 0);
  
  const handleCheckout = () => {
    window.open("/app", "_blank")
    
    if (hasManagementService()) {
        const ebooksToIntegrate = getEbooks();
        if (ebooksToIntegrate.length > 0) {
            integrateEbooks(ebooksToIntegrate);
        }
    }
    
    clearCart();
    setIsCartOpen(false);
  }

  const handleRemoveItem = (productId: number, productName: string) => {
      removeItemFromCart(productId); 
      toast({
          title: "Producto Eliminado",
          description: `"${productName}" ha sido retirado del carrito.`,
          variant: "default",
      });
  }

  return (
    <nav className="bg-[#213041] border-b border-[#305176] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:text-[#aff606] hover:bg-[#305176]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex items-center bg-[#213041] rounded-[10px] px-6 py-2 border border-[#305176]">
            <div className="flex items-center space-x-8 text-xs">
              <Link href="/" className="text-white hover:text-[#aff606] transition-colors">
                INICIO
              </Link>
              <Link href="/tienda" className="text-white hover:text-[#aff606] transition-colors">
                TIENDA
              </Link>
              <Link href="/gestion" className="text-white hover:text-[#aff606] transition-colors">
                SERVICIOS
              </Link>
              <Link href="/contacto" className="text-white hover:text-[#aff606] transition-colors">
                CONTACTO
              </Link>
            </div>
          </div>

          {/* Logo - Centrado absoluto */}
          <div className="absolute left-1/2 transform -translate-x-1/2 leading-9">
            <img
              src="/images/logo-cuatro-cero.png"
              alt="CUATRO CERO - Gestión de Equipo"
              className="h-[2.31rem] md:h-[3.41rem] w-auto" // <-- TAMAÑO AUMENTADO EN 5%
            />
          </div>

          {/* Right Icons */}
          <div className="flex items-center bg-[#213041] rounded-[10px] border border-[#305176] space-x-3 py-0 px-0">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-[#aff606] hover:bg-[#305176] h-12 w-12"
              onClick={() => window.open("/app", "_blank")}
            >
              <User className="h-5 w-5" />
            </Button>
            {/* Bloque de Carrito con Contador */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-[#aff606] hover:bg-[#305176] h-12 w-12"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {/* Contador de ítems */}
              {cartTotalItems > 0 && (
                <div className="absolute top-1 right-1 size-5 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold text-white leading-none p-0.5">
                  {cartTotalItems > 99 ? '99+' : cartTotalItems}
                </div>
              )}
            </div>
            {/* Fin del Bloque de Carrito */}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[#305176]">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-white hover:text-[#aff606] hover:bg-[#305176] rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                INICIO
              </Link>
              <Link
                href="/tienda"
                className="block px-3 py-2 text-white hover:text-[#aff606] hover:bg-[#305176] rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                TIENDA
              </Link>
              <Link
                href="/gestion"
                className="block px-3 py-2 text-white hover:text-[#aff606] hover:bg-[#305176] rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                GESTIÓN
              </Link>
              <Link
                href="/contacto"
                className="block px-3 py-2 text-white hover:text-[#aff606] hover:bg-[#305176] rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                CONTACTO
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* SHEET / DRAWER DEL CARRITO */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side="right" className="bg-[#213041] border-[#305176] text-white flex flex-col p-0">
          <SheetHeader className="p-4 border-b border-[#305176] pb-3">
            <SheetTitle className="text-white text-2xl font-bold flex items-center">
              <ShoppingCart className="h-6 w-6 mr-2 text-[#aff606]" />
              Tu Carrito ({cartTotalItems})
            </SheetTitle>
            <SheetDescription className="text-gray-400">
              {cartTotalItems > 0 ? "Revisa tus productos antes de pagar." : "Tu carrito está vacío."}
            </SheetDescription>
          </SheetHeader>
          
          <ScrollArea className="flex-1 px-4 py-4">
            <div className="space-y-4">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.id} className="flex items-start justify-between p-3 bg-[#1d2834] rounded-lg border border-[#305176]">
                    <div className="flex items-center space-x-3">
                      <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-10 h-10 object-cover rounded" />
                      <div>
                        <p className="text-white font-medium text-sm">{item.name}</p>
                        <p className="text-[#aff606] text-xs font-bold">{item.price} x {item.quantity}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-400 hover:bg-red-500/20"
                      onClick={() => handleRemoveItem(item.id, item.name)} 
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <ShoppingCart className="h-10 w-10 mx-auto mb-3" />
                  <p>Aún no has agregado nada a tu carrito.</p>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-[#305176] space-y-3 flex-shrink-0">
             <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-white">Subtotal:</span>
                <span className="text-2xl font-bold text-[#aff606]">${subtotal.toFixed(2)}</span>
            </div>
            <Button
              className="w-full bg-[#aff606] text-black hover:bg-[#25d03f] h-12 text-lg font-bold"
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              Pagar e Integrar
            </Button>
            <Button
                variant="outline"
                className="w-full border-red-500 text-red-500 hover:bg-red-500/10"
                onClick={clearCart}
            >
              Vaciar Carrito
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
                Al pagar serás redirigido para iniciar sesión o crear una cuenta antes de proceder al pago (Mercado Pago / Stripe).
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  )
}