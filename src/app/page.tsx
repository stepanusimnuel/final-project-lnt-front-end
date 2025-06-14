"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useProductContext } from "./context/ProductContext";
import Link from "next/link";
import CartButton from "../../components/buttons/CartButton";
import { useCartContext } from "./context/CartContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { addToCart } = useCartContext();
  const { currentUser, checkingAuth, logout } = useAuth();
  const router = useRouter();

  const { products, checking } = useProductContext();

  const uniqueBrands = [...new Set(products.map((p) => p.brand).filter(Boolean))];
  const uniqueCategories = [...new Set(products.map((p) => p.category).filter(Boolean))];
  const uniqueTags = [...new Set(products.flatMap((p) => p.tags).filter(Boolean))];

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);

  const [toSearch, setToSearch] = useState("");

  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    if (!checkingAuth && !currentUser) {
      router.replace("/login");
    }
  }, [checkingAuth, currentUser]);

  if (checkingAuth || !currentUser) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  const filteredProducts = products.filter(
    (product) =>
      (!selectedBrand || product.brand === selectedBrand) &&
      (!selectedCategory || product.category === selectedCategory) &&
      product.rating >= minRating &&
      product.title?.toLowerCase().includes(toSearch.toLowerCase()) &&
      (selectedTags.length === 0 || selectedTags.every((tag) => product.tags?.includes(tag)))
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "discount":
        return b.discountPercentage - a.discountPercentage;
      case "price-high":
        return b.price - a.price;
      case "price-low":
        return a.price - b.price;
      case "stock":
        return b.stock - a.stock;
      case "reviews":
        return b.reviews.length - a.reviews.length;
      default:
        return 0;
    }
  });

  const getDiscountPrice = (price: number, disc: number): number => {
    const res: number = price - (disc * price) / 100;
    return Number(res.toFixed(2));
  };

  const truncateDescription = (desc: string, maxWords: number = 15): string => {
    const words = desc.split(" ");
    return words.length <= maxWords ? desc : words.slice(0, maxWords).join(" ") + "...";
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  if (checking) return <h2 className="text-center mt-10 text-gray-500">Loading...</h2>;

  return (
    <div className="min-h-screen p-6 bg-gray-100 pt-24 relative">
      <div className="flex justify-between items-center px-6 py-4 fixed top-0 left-0 right-0 z-50 bg-white shadow">
        <div className="flex gap-4 items-center relative">
          <h1 className="text-3xl font-bold">Halo, {currentUser?.name}</h1>
          <CartButton />
        </div>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition relative">
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap justify-center">
        {uniqueTags.map((tag, i) => (
          <span key={i} onClick={() => toggleTag(tag)} className={`py-1 px-3 text-sm rounded-xl border cursor-pointer hover:bg-rose-300 transition ${selectedTags.includes(tag) ? "bg-rose-300" : "bg-rose-200"}`}>
            {tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between flex-wrap gap-4 items-end mb-6">
        <div className="flex flex-wrap gap-4">
          <select onChange={(e) => setSelectedBrand(e.target.value)} className="p-2 px-4 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
            <option value="">Semua Brand</option>
            {uniqueBrands.map((brand, i) => (
              <option key={i} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <select onChange={(e) => setSelectedCategory(e.target.value)} className="p-2 px-4 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
            <option value="">Semua Kategori</option>
            {uniqueCategories.map((category, i) => (
              <option key={i} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select onChange={(e) => setMinRating(Number(e.target.value))} className="p-2 px-4 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
            <option value="0">⭐ 0+</option>
            <option value="1">⭐ 1+</option>
            <option value="2">⭐ 2+</option>
            <option value="3">⭐ 3+</option>
            <option value="4">⭐ 4+</option>
            <option value="5">⭐ 5</option>
          </select>
        </div>

        <div className="w-full flex gap-2 sm:w-auto">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 px-4 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
            <option value="">Urutkan</option>
            <option value="rating">Rating Tertinggi</option>
            <option value="discount">Diskon Terbesar</option>
            <option value="price-high">Harga Tertinggi</option>
            <option value="price-low">Harga Terendah</option>
            <option value="stock">Stok Terbanyak</option>
            <option value="reviews">Ulasan Terbanyak</option>
          </select>
          <input
            type="text"
            placeholder="🔍 Cari produk..."
            value={toSearch}
            onChange={(e) => setToSearch(e.target.value)}
            className="w-full sm:w-72 p-2 px-4 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-6">
        {sortedProducts.map((product) => (
          <div key={product.id} className="bg-white rounded shadow hover:shadow-2xl transition min-h-[450px] flex flex-col justify-between cursor-pointer">
            <Link href={`/product/${product.id}`}>
              <img src={product.thumbnail} alt={product.title} className="w-full h-40 object-cover rounded mb-3" />
              <h2 className="text-lg font-semibold bg-gray-100 px-4 py-2">{product.title}</h2>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-2">
                  {product.brand} - {product.category}
                </p>
                <p className="text-sm text-gray-700">{truncateDescription(product.description)}</p>
                <div className="flex items-center gap-2 mt-2">
                  {/* <span className="text-sm text-gray-400 line-through">${product.price.toFixed(2)}</span> */}
                  <span className="text-lg text-green-600 font-bold">${getDiscountPrice(product.price, product.discountPercentage).toFixed(2)}</span>
                  <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">-{product.discountPercentage}%</span>
                </div>
              </div>
            </Link>
            <button onClick={() => addToCart(product)} className="bg-blue-600 text-white text-xs text-center w-full py-2 rounded-b hover:bg-blue-700 cursor-pointer transition">
              + Keranjang
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
