"use client";

import { useCartContext } from "@/app/context/CartContext";
import Link from "next/link";

export default function CartButton() {
  const { cart, totalItems } = useCartContext();

  return (
    <Link href="/cart" className="relative block">
      <button className="bg-slate-700 text-white text-md px-4 py-2 rounded-full hover:bg-slate-600 transition cursor-pointer relative">
        🛒
        {totalItems > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-bounce">{totalItems}</span>}
      </button>
    </Link>
  );
}
