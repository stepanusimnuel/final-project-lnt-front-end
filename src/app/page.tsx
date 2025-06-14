"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { isLoggedIn } from "../../utils/forms/validator";
import { useRouter } from "next/navigation";
import { useProductContext } from "./context/ProductContext";
import Link from "next/link";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
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

  const filteredProducts = products.filter(
    (product) =>
      (!selectedBrand || product.brand === selectedBrand) &&
      (!selectedCategory || product.category === selectedCategory) &&
      product.rating >= minRating &&
      product.title?.toLowerCase().includes(toSearch.toLowerCase()) &&
      (selectedTags.length === 0 || selectedTags.every((tag) => product.tags?.includes(tag)))
  );

  useEffect(() => {
    if (!isLoggedIn()) router.push("/login");
  }, []);

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
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Halo, {currentUser?.name}</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
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

        <div className="w-full sm:w-auto">
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
        {filteredProducts.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <div className="bg-white rounded shadow hover:shadow-md transition min-h-[400px]">
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
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
