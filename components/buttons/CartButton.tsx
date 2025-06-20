"use client";

import { useCartContext } from "@/app/context/CartContext";
import Link from "next/link";

export default function CartButton() {
  const { cart, totalItems } = useCartContext();

  return (
    <Link href="/cart" className="relative inline-block">
      <button className="bg-gray-700 dark:bg-white dark:text-gray-700 text-gray-100 text-xl px-4 py-2 rounded-full hover:bg-slate-600 transition cursor-pointer relative">
        🛒
        {totalItems > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-bounce">{totalItems}</span>}
      </button>
    </Link>
  );
}
