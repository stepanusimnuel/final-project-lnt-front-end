"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Product } from "../../../types/product";
import { User } from "../../../types/user";
import { useProductContext } from "./ProductContext";
import { useAuth } from "./AuthContext";

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  subtractCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  checkout: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, updateCurrentUser } = useAuth();
  const { products } = useProductContext();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      setCart([]);
      return;
    }

    const cartKey = `cart-${currentUser.email}`;
    const storedCart = localStorage.getItem(cartKey);
    console.log("🔁 Load cart for", currentUser.email);

    if (storedCart) {
      setCart(JSON.parse(storedCart));
    } else {
      localStorage.setItem(cartKey, JSON.stringify([]));
      setCart([]);
    }
  }, [currentUser?.email]);

  useEffect(() => {
    if (!currentUser) return;

    const cartKey = `cart-${currentUser.email}`;
    localStorage.setItem(cartKey, JSON.stringify(cart));

    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalHarga = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalItems(totalQty);
    setTotalPrice(totalHarga);
  }, [cart, currentUser?.email]);

  const addToCart = useCallback(
    (product: Product) => {
      console.log("🛒 Add to cart by", currentUser?.email);

      setCart((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          if (existing.quantity >= product.stock) {
            alert("Jumlah barang melebihi stock yang tersedia");
            return prev;
          }
          return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    },
    [currentUser]
  );

  const subtractCart = useCallback((id: number) => {
    setCart((prev) => {
      return prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item)).filter((item) => item.quantity > 0);
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateProductStocks = useCallback(() => {
    const updated = products.map((p) => {
      const cartItem = cart.find((c) => c.id === p.id);
      if (!cartItem) return p;
      return {
        ...p,
        stock: Math.max(p.stock - cartItem.quantity, 0),
      };
    });

    localStorage.setItem("products", JSON.stringify(updated));
    window.dispatchEvent(new Event("refresh-products"));
  }, [cart, products]);

  const updateUserBalance = useCallback(() => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, balance: currentUser.balance - totalPrice };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    updateCurrentUser(updatedUser);

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((user: User) => (user.email === currentUser.email ? updatedUser : user));
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  }, [currentUser, totalPrice]);

  const savePurchaseHistory = useCallback(() => {
    if (!currentUser) return;

    const historyKey = `riwayat-${currentUser.email}`;
    const existingHistory = JSON.parse(localStorage.getItem(historyKey) || "[]");
    const newRecord = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: cart,
      totalPrice,
    };
    localStorage.setItem(historyKey, JSON.stringify([...existingHistory, newRecord]));
  }, [currentUser, cart, totalPrice]);

  const checkout = useCallback(() => {
    console.log("🧾 Checkout by", currentUser?.email);

    if (!currentUser || currentUser.balance < totalPrice) {
      alert("Saldo tidak cukup untuk checkout.");
      return;
    }

    updateProductStocks();
    updateUserBalance();
    savePurchaseHistory();
    clearCart();
    localStorage.setItem("hasCheckedOut", "true");
  }, [currentUser, totalPrice, updateProductStocks, updateUserBalance, savePurchaseHistory]);

  const clearCart = useCallback(() => {
    console.log("🧹 Clear cart by", currentUser?.email);
    setCart([]);
  }, [currentUser]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        subtractCart,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
