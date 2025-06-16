"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ThemeButton from "../../../components/buttons/ThemeButton";
import { useAuth } from "../context/AuthContext";

export default function TopUpPage() {
  const { currentUser, login, updateCurrentUser } = useAuth();
  const router = useRouter();

  const [amount, setAmount] = useState<number>(0);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleTopUp = () => {
    if (!currentUser) return;

    if (!login(currentUser.email, password)) {
      setError("Password salah.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((user: any) => {
      if (user.email === currentUser.email) {
        user.balance = (user.balance || 0) + amount;
        localStorage.setItem("currentUser", JSON.stringify(user));
        updateCurrentUser(user);
        return user;
      }
      return user;
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Top Up Saldo</h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <label className="block mb-2 text-gray-700 dark:text-gray-300">Jumlah Top Up</label>
        <input type="number" min={0} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full p-2 mb-4 rounded border dark:bg-gray-700 dark:text-white" />

        <label className="block mb-2 text-gray-700 dark:text-gray-300">Konfirmasi Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mb-6 rounded border dark:bg-gray-700 dark:text-white" />

        <button onClick={handleTopUp} className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
          Top Up
        </button>
      </div>
      <ThemeButton />
    </div>
  );
}
