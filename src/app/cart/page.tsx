"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartContext } from "../context/CartContext";
import { useAuth } from "../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (checkingAuth) return <p className="text-center mt-10">Loading ...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🛒 Keranjang Belanja</h1>
        {cart.length > 0 && (
          <button onClick={clearCart} className="bg-red-100 text-red-600 text-sm px-3 py-1 rounded hover:bg-red-200 transition">
            Hapus Semua
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-lg">
          Keranjang kosong.{" "}
          <Link href="/" className="text-blue-600 underline">
            Belanja sekarang
          </Link>
        </p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded shadow-sm flex gap-4 items-center hover:shadow-md transition">
              <Link href={`/product/${item.id}`} className="min-w-[80px]">
                <Image src={item.thumbnail} alt={item.title} width={80} height={80} className="object-cover rounded" />
              </Link>

              <div className="flex-1">
                <Link href={`/product/${item.id}`}>
                  <h2 className="font-semibold text-lg hover:underline">{item.title}</h2>
                </Link>
                <p className="text-sm text-gray-600">
                  ${item.price.toFixed(2)} x {item.quantity}
                </p>
                <p className="text-sm font-medium mt-1">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => subtractCart(item.id)} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
                  –
                </button>
                <span className="min-w-[24px] text-center">{item.quantity}</span>
                <button onClick={() => addToCart(item)} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
                  +
                </button>
              </div>

              <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm hover:underline ml-4">
                Hapus
              </button>
            </div>
          ))}

          <div className="text-right mt-6">
            <p className="text-xl font-bold mb-2">Total: ${totalPrice.toFixed(2)}</p>
            <Link href="/checkout" onClick={checkout}>
              <button className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition">Checkout</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
