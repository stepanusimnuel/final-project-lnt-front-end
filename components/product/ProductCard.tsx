"use client";

import { useCartContext } from "@/app/context/CartContext";
import Link from "next/link";
import { getDiscountPrice, truncateText } from "../../utils/dashboard/helper";
import { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartContext();

  const isOutOfStock = product.stock <= 0;
  const finalPrice = getDiscountPrice(product.price, product.discountPercentage).toFixed(2);

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded shadow hover:shadow-2xl transition min-h-[450px] flex flex-col justify-between cursor-pointer">
      <Link href={`/product/${product.id}`} className={isOutOfStock ? "opacity-50" : ""}>
        <img src={product.thumbnail} alt={product.title} className="w-full h-40 object-cover rounded mb-3" />
        <h2 className="text-lg font-semibold bg-gray-100 dark:bg-gray-700 px-4 py-2">{product.title}</h2>
        <div className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {product.brand} - {product.category}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-200">{truncateText(product.description)}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg text-green-600 font-bold">${finalPrice}</span>
            <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">-{product.discountPercentage}%</span>
          </div>
        </div>
      </Link>
      <button
        onClick={() => addToCart(product)}
        className={`bg-blue-600 text-white text-xs text-center w-full py-2 rounded-b transition ${isOutOfStock ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-blue-700"}`}
        disabled={isOutOfStock}
      >
        + Keranjang
      </button>
    </div>
  );
}
