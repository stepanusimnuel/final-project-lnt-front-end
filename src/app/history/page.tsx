"use client";

import { useEffect, useState } from "react";
import ThemeButton from "../../../components/buttons/ThemeButton";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

type CartItem = {
  id: number;
  title: string;
  quantity: number;
  price: number;
};

type HistoryRecord = {
  id: number;
  date: string;
  items: CartItem[];
  totalPrice: number;
};

export default function HistoryPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    if (currentUser) {
      const data = JSON.parse(localStorage.getItem(`riwayat-${currentUser.email}`) || "[]");
      setHistory(data.reverse());
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      router.replace("/login");
    }
  }, [currentUser]);

  if (!currentUser) {
    return <div className="text-center mt-20 text-gray-600 dark:text-gray-300">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6">Riwayat Pembelian</h1>

      {history.length === 0 ? (
        <p>Tidak ada transaksi.</p>
      ) : (
        <div className="space-y-6">
          {history.map((record) => (
            <div key={record.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(record.date).toLocaleString()}</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">Total: ${record.totalPrice}</span>
              </div>
              <ul className="ml-4 list-disc">
                {record.items.map((item) => (
                  <li key={item.id}>
                    {item.title} × {item.quantity} — ${item.price * item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <ThemeButton />
    </div>
  );
}
