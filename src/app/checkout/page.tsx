"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-green-600 mb-2">Transaksi Berhasil!</h1>
      <p className="text-gray-600">Terima kasih telah berbelanja.</p>
      <p className="text-sm text-gray-400 mt-2">Anda akan diarahkan ke halaman utama...</p>
    </div>
  );
}
