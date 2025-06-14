"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useProductContext } from "@/app/context/ProductContext";
import { useState } from "react";
import ReviewComment from "../../../../components/product/ReviewComment";
import { useCartContext } from "@/app/context/CartContext";
import CartButton from "../../../../components/buttons/CartButton";
import RequireAuth from "../../../../components/auth/RequireAuth";

export default function ProductDetail() {
  const { id } = useParams();
  const { products, checking } = useProductContext();
  const { addToCart } = useCartContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (checking) return <p className="text-center mt-10">Loading ...</p>;

  const product = products.find((p) => p.id === Number(id));
  if (!product) return <p className="text-center mt-10">Produk tidak ditemukan</p>;

  const images = product.images || [];
  const getDiscountedPrice = (price: number, discount: number) => (price - price * (discount / 100)).toFixed(2);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <RequireAuth>
      <div className="max-w-5xl mx-auto my-10 ">
        <CartButton />
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <div className="relative w-full h-64 md:h-80 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
              {images.length > 0 && <Image src={images[currentIndex]} alt={`Image ${product.title} ${currentIndex + 1}`} fill className="object-contain rounded" />}
              {images.length > 1 && (
                <button onClick={prevImage} className="absolute left-2 bg-white rounded-full p-2 shadow hover:bg-gray-100">
                  ◀
                </button>
              )}

              {images.length > 1 && (
                <button onClick={nextImage} className="absolute right-2 bg-white rounded-full p-2 shadow hover:bg-gray-100">
                  ▶
                </button>
              )}
            </div>

            <div>
              <div className="flex justify-between">
                <h1 className="text-3xl font-bold mb-2 text-gray-800">{product.title}</h1>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 h-6 text-xs font-medium rounded-full">{product.category}</span>
              </div>
              <p className="text-gray-600 mb-4">{product.description}</p>

              <div className="flex gap-3 items-baseline mb-4">
                <p className="text-2xl font-bold text-green-600">${getDiscountedPrice(product.price, product.discountPercentage)}</p>
                <p className="line-through text-gray-400">${product.price}</p>
                <span className="bg-red-100 text-red-600 px-2 py-1 text-sm rounded">-{product.discountPercentage}%</span>
              </div>

              <div className="my-3">
                <div className="flex flex-wrap gap-2 w-full mb-1">
                  {product.tags.map((tag, i) => (
                    <span key={i} className="bg-blue-100 text-blue-600 px-3 py-1 text-xs font-medium rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 w-full">
                  <span className="bg-yellow-100 text-yellow-600 px-3 py-1 text-xs font-medium rounded-full">Brand: {product.brand}</span>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 text-xs font-medium rounded-full">Stock: {product.stock}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                {product.dimensions.width} x {product.dimensions.depth} x {product.dimensions.height} cm
              </p>
              <p className="text-sm text-gray-600 mt-1">{product.weight} kg</p>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600 mt-2">⭐ Rating: {product.rating}</p>
                <button onClick={() => addToCart(product)} className="bg-blue-600 text-white text-[0.7rem] px-2 py-2 rounded hover:bg-blue-700 cursor-pointer transition">
                  + Keranjang
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Ulasan Pengguna</h2>

            {product.reviews.length > 0 ? product.reviews.map((review, i) => <ReviewComment review={review} key={i} />) : <p className="text-gray-500">Belum ada ulasan untuk produk ini.</p>}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
