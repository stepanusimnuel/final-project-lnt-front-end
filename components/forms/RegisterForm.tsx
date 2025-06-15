"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { validateEmail, validatePassword, validatePhoneNumber } from "../../utils/forms/validator";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterForm() {
  const { currentUser, checkingAuth, register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    date_of_birth: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!checkingAuth && currentUser) {
      router.replace("/");
    }
  }, [checkingAuth, currentUser]);

  if (checkingAuth || currentUser) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, password, phone_number, date_of_birth } = form;

    if (!name || !email || !password) {
      return setError("Harap isi semua bidang.");
    }

    if (!validateEmail(email)) return setError("Format email tidak valid.");
    if (!validatePassword(password)) return setError("Password minimal 6 karakter.");
    if (phone_number && !validatePhoneNumber(phone_number)) return setError("Format nomor telepon tidak sesuai");

    const res = register(name, email, password, phone_number, date_of_birth);
    if (!res) return setError("Email sudah digunakan");

    router.push("/login");
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-12 bg-white dark:bg-gray-900 p-6 rounded-lg shadow space-y-5">
      <h2 className="text-3xl font-semibold text-center text-sky-600 dark:text-sky-400">Daftar Akun</h2>

      {error && <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>}

      <div>
        <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">Nama Lengkap</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-500"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-500"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-500"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">Nomor Telepon</label>
        <input
          type="tel"
          name="phone_number"
          value={form.phone_number}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-500"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">Tanggal Lahir</label>
        <input
          type="date"
          name="date_of_birth"
          value={form.date_of_birth}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-500"
        />
      </div>

      <div>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>

      <button type="submit" className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700 dark:hover:bg-sky-500 transition cursor-pointer">
        Daftar
      </button>
    </form>
  );
}
