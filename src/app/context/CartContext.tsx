"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Product } from "../../../types/product";

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  subtractCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalHarga = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    setTotalItems(totalQty);
    setTotalPrice(totalHarga);
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const subtractCart = (id: number) => {
    setCart((prev) => {
      return prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item)).filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  return <CartContext.Provider value={{ cart, addToCart, subtractCart, removeFromCart, clearCart, totalItems, totalPrice }}>{children}</CartContext.Provider>;
}

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
