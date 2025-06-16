"use client";

import { useEffect, useRef, useState } from "react";
import DropdownFilterSelect from "../dropdowns/DropdownFilterSelect";
import { useOutsideClick } from "../../hooks/useOutsideClick";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: { brand: string; category: string; rating: number; minPrice: number; maxPrice: number }) => void;
  brands: string[];
  categories: string[];
};

export default function FilterModal({ isOpen, onClose, onApply, brands, categories }: Props) {
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const stars = ["0", "1", "2", "3", "4", "5"];

  useOutsideClick(modalRef, () => onClose());

  useEffect(() => {
    if (isOpen) {
      setBrand("");
      setCategory("");
      setRating(0);
      setMinPrice(0);
      setMaxPrice(100000);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4" ref={modalRef}>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Filter Produk</h2>

        <div className="mb-4">
          <DropdownFilterSelect label="Kategori" options={categories} values={categories} onChange={setCategory} />
        </div>

        <div className="mb-4">
          <DropdownFilterSelect label="Brand" options={brands} values={brands} onChange={setBrand} />
        </div>

        <div className="mb-4">
          <DropdownFilterSelect label="Rating" options={stars.map((star) => `⭐ ${star}+`)} values={stars} onChange={(val) => setRating(Number(val))} />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Rentang Harga ($)</label>
          <div className="flex gap-2">
            <input type="number" min={0} value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Min" />
            <input type="number" min={0} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Max" />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => {
              onApply({ brand, category, rating, minPrice, maxPrice });
              onClose();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Terapkan Filter
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded border border-gray-400 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
