"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { isLoggedIn } from "../../utils/forms/validator";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) router.push("/login");
    else setChecking(false);
  }, []);

  if (checking) return <h2 className="text-center mt-10 text-gray-500">Loading...</h2>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Selamat datang {currentUser?.name}</h1>
      <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
        Logout
      </button>
    </div>
  );
}
