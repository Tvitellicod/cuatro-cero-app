"use client"

import * as React from "react"
import { toast } from "@/hooks/use-toast"

interface Product {
  id: number
  name: string
  price: string
  image: string
}

interface CartItem extends Product {
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  cartTotalItems: number
  addItemToCart: (product: Product) => void
  clearCart: () => void
  getEbooks: () => CartItem[]
  getPizarras: () => CartItem[]
}

const CartContext = React.createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = React.useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem("app_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("app_cart", JSON.stringify(cart));
    }
  }, [cart]);

  const cartTotalItems = cart.reduce((total, item) => total + item.quantity, 0)

  const addItemToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)

      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })

    toast({
      title: "Producto Agregado",
      description: `El producto "${product.name}" se agregó al carrito. ¡Ahora tienes ${cartTotalItems + 1} ítems!`,
      variant: "default",
    })
  }

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Carrito Vaciado",
      description: "Todos los productos han sido eliminados del carrito.",
      variant: "default",
    });
  }
  
  // Lógica de filtrado de Ebooks (IDs 5, 6, 7, 8 según store-section.tsx)
  const getEbooks = () => cart.filter(item => item.id >= 5 && item.id <= 8);
  
  // Lógica de filtrado de Pizarras (IDs 1, 2, 3, 4 según store-section.tsx)
  const getPizarras = () => cart.filter(item => item.id >= 1 && item.id <= 4);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartTotalItems,
        addItemToCart,
        clearCart,
        getEbooks,
        getPizarras,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = React.useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}