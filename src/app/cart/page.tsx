"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartContext } from "../context/CartContext";
import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ThemeButton from "../../../components/buttons/ThemeButton";

export default function CartPage() {
  const { cart, addToCart, subtractCart, removeFromCart, clearCart, totalPrice, checkout } = useCartContext();
  const { currentUser, checkingAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!checkingAuth && !currentUser) {
      router.replace("/login");
    }
  }, [checkingAuth, currentUser]);

  if (checkingAuth || !currentUser) {
    return <div className="text-center mt-20 text-gray-800 dark:text-gray-100">Loading...</div>;
  }

  if (checkingAuth) return <p className="text-center mt-10 text-gray-800 dark:text-gray-100">Loading ...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">🛒 Keranjang Belanja</h1>
        {cart.length > 0 && (
          <button onClick={clearCart} className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-sm px-3 py-1 rounded hover:bg-red-200 dark:hover:bg-red-800 transition">
            Hapus Semua
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Keranjang kosong.{" "}
          <Link href="/" className="text-blue-600 dark:text-blue-400 underline">
            Belanja sekarang
          </Link>
        </p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow-sm flex gap-4 items-center hover:shadow-md transition">
              <Link href={`/product/${item.id}`} className="min-w-[80px]">
                <Image src={item.thumbnail} alt={item.title} width={80} height={80} className="object-cover rounded" />
              </Link>

              <div className="flex-1">
                <Link href={`/product/${item.id}`}>
                  <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100 hover:underline">{item.title}</h2>
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  ${item.price.toFixed(2)} x {item.quantity}
                  <span className={`text-[0.8rem] ps-2 ${item.stock <= 5 ? "text-rose-500" : "font-bold text-gray-700 dark:text-gray-100"}`}>({item.stock} left)</span>
                </p>
                <p className="text-sm font-medium mt-1 text-gray-800 dark:text-gray-200">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => subtractCart(item.id)} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600">
                  –
                </button>
                <span className="min-w-[24px] text-center text-gray-800 dark:text-gray-100">{item.quantity}</span>
                <button
                  onClick={() => addToCart(item)}
                  className={`px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded ${item.quantity >= item.stock ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300 dark:hover:bg-gray-600"}`}
                  disabled={item.quantity >= item.stock}
                >
                  +
                </button>
              </div>

              <button onClick={() => removeFromCart(item.id)} className="text-red-500 dark:text-red-400 text-sm hover:underline ml-4 cursor-pointer">
                Hapus
              </button>
            </div>
          ))}

          <div className="text-right mt-6">
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Total: ${totalPrice.toFixed(2)}</p>
            <Link href="/checkout" onClick={checkout}>
              <button className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition">Checkout</button>
            </Link>
          </div>
        </div>
      )}
      <ThemeButton />
    </div>
  );
}
