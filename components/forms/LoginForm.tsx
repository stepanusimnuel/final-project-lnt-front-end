"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { isLoggedIn } from "../../utils/forms/validator";
import { useAuth } from "../../hooks/useAuth";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn()) router.push("/");
    else setChecking(false);
  }, []);

  if (checking) return <h2 className="text-center mt-10 text-gray-500">Loading...</h2>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = form;
    if (!email || !password) return setError("Harap isi semua bidang");

    const res = login(email, password);
    if (!res) return setError("Email/password salah");

    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-12 bg-white p-6 rounded-lg shadow space-y-5">
      <h2 className="text-2xl font-semibold text-center text-blue-600">Masuk</h2>

      {error && <p className="text-red-600 text-sm text-center">{error}</p>}

      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-300" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-300" />
      </div>

      <div>
        <p className="text-sm text-center text-gray-600">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>

      <button type="submit" className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700 transition">
        Masuk
      </button>
    </form>
  );
}
