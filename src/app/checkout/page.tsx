"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ThemeButton from "../../../components/buttons/ThemeButton";

export default function CheckoutPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const hasCheckedOut = localStorage.getItem("hasCheckedOut");
    if (hasCheckedOut === "true") {
      setAllowed(true);

      const timeout = setTimeout(() => {
        router.push("/");
        localStorage.removeItem("hasCheckedOut");
      }, 3000);

      return () => clearTimeout(timeout);
    } else {
      router.replace("/");
    }
  }, []);

  if (!allowed) {
    return <p className="text-center mt-20 text-gray-600 dark:text-gray-300">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center g-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <h1 className="text-3xl font-bold text-green-600 dark:text-green-500 mb-2">Transaksi Berhasil!</h1>
      <p>Terima kasih telah berbelanja.</p>
      <p className="text-sm text-gray-600 dark:text-gray-200 mt-2">Anda akan diarahkan ke halaman utama...</p>
      <ThemeButton />
    </div>
  );
}
