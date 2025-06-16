"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useAuth } from "@/app/context/AuthContext";

export default function DropdownProfile() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(dropdownRef, () => setOpen(false));

  if (!currentUser) return null;

  return (
    <div className="relative -right-4 " ref={dropdownRef}>
      <button onClick={() => setOpen((prev) => !prev)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition">
        <Image
          width={40}
          height={40}
          src={currentUser.picture || "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp"}
          alt="Profile Picture"
          className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
        />
        <span className="text-base font-medium text-gray-800 dark:text-white">{currentUser.name}</span>
        <svg className={`w-5 h-5 text-gray-500 dark:text-white transition-transform ${open ? "rotate-180" : ""}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50 dark:bg-gray-100 dark:text-gray-700">
          <button
            onClick={() => {
              router.push("/profile");
              setOpen(false);
            }}
            className={`block w-full px-4 py-2 text-left hover:bg-gray-300 `}
          >
            <div className="flex items-center gap-2">
              <span>👤</span>
              <span>Lihat Profil</span>
            </div>
          </button>
          <button
            onClick={() => {
              router.push("/topup");
              setOpen(false);
            }}
            className={`block w-full px-4 py-2 text-left hover:bg-gray-300 `}
          >
            <div className="flex items-center gap-2">
              <span>💲</span>
              <span> Top Up</span>
            </div>
          </button>
          <button
            onClick={() => {
              router.push("/history");
              setOpen(false);
            }}
            className={`block w-full px-4 py-2 text-left hover:bg-gray-300 `}
          >
            <div className="flex items-center gap-2">
              <span>📋</span>
              <span> Riwayat Pembelian</span>
            </div>
          </button>
          <button onClick={logout} className={`block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-300`}>
            <div className="flex items-center gap-2">
              <span>🚪</span>
              <span> Logout</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
