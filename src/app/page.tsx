"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useProductContext } from "./context/ProductContext";
import { useRouter } from "next/navigation";
import ThemeButton from "../../components/buttons/ThemeButton";
import Navbar from "../../components/navbar/Navbar";
import ProductCard from "../../components/product/ProductCard";
import DropdownFilterSelect from "../../components/dropdowns/DropdownFilterSelect";
import FilterModal from "../../components/modal/FilterModal";

export default function Dashboard() {
  const { currentUser, checkingAuth } = useAuth();
  const router = useRouter();

  const { products, checking } = useProductContext();

  const uniqueBrands = [...new Set(products.map((p) => p.brand).filter(Boolean))];
  const uniqueCategories = [...new Set(products.map((p) => p.category).filter(Boolean))];
  const uniqueTags = [...new Set(products.flatMap((p) => p.tags).filter(Boolean))];
  const uniqueSortBy = ["Rating Tertinggi", "Diskon Terbesar", "Harga Tertinggi", "Harga Terendah", "Stok Terbanyak", "Ulasan Terbanyak"];

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [toSearch, setToSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);

  useEffect(() => {
    if (!checkingAuth && !currentUser) {
      router.replace("/login");
    }
  }, [checkingAuth, currentUser]);

  if (checkingAuth || !currentUser) {
    return <div className="text-center mt-20 text-gray-600 dark:text-gray-300">Loading...</div>;
  }

  const filteredProducts = products.filter(
    (product) =>
      (!selectedBrand || product.brand === selectedBrand) &&
      (!selectedCategory || product.category === selectedCategory) &&
      product.rating >= minRating &&
      product.price >= minPrice &&
      product.price <= maxPrice &&
      product.title.toLowerCase().includes(toSearch.toLowerCase()) &&
      (selectedTags.length === 0 || selectedTags.every((tag) => product.tags.includes(tag)))
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "Rating Tertinggi":
        return b.rating - a.rating;
      case "Diskon Terbesar":
        return b.discountPercentage - a.discountPercentage;
      case "Harga Tertinggi":
        return b.price - a.price;
      case "Harga Terendah":
        return a.price - b.price;
      case "Stok Terbanyak":
        return b.stock - a.stock;
      case "Ulasan Terbanyak":
        return b.reviews.length - a.reviews.length;
      default:
        return 0;
    }
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  if (checking) return <h2 className="text-center mt-10 text-gray-500 dark:text-gray-300">Loading...</h2>;

  return (
    <div className="min-h-screen p-6 pt-32 relative bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />

      <div className="flex gap-2 mb-4 flex-wrap justify-center">
        {uniqueTags.map((tag, i) => (
          <span key={i} onClick={() => toggleTag(tag)} className={`py-1 px-3 text-sm rounded-xl border cursor-pointer transition ${selectedTags.includes(tag) ? "bg-rose-400 dark:bg-rose-600 text-white" : "bg-rose-200 dark:bg-rose-800"}`}>
            {tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between flex-wrap gap-4 items-end mb-6">
        <div className="flex flex-wrap gap-4">
          <button onClick={() => setIsFilterOpen(true)} className="p-2 px-4 bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white border border-gray-300 dark:border-gray-600 rounded shadow-sm">
            🔍 Filter
          </button>
        </div>

        <div className="w-full flex gap-2 sm:w-auto">
          <DropdownFilterSelect label="Urutkan" options={uniqueSortBy} values={uniqueSortBy} onChange={(val) => setSortBy(val)} />

          <input
            type="text"
            placeholder="🔍 Cari produk..."
            value={toSearch}
            onChange={(e) => setToSearch(e.target.value)}
            className="w-full sm:w-72 p-2 px-4 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-6">
        {sortedProducts.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>

      <ThemeButton />

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        brands={uniqueBrands}
        categories={uniqueCategories}
        onApply={({ brand, category, rating, minPrice, maxPrice }) => {
          setSelectedBrand(brand);
          setSelectedCategory(category);
          setMinRating(rating);
          setMinPrice(minPrice);
          setMaxPrice(maxPrice);
        }}
      />
    </div>
  );
}
