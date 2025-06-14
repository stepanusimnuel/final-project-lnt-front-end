"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isLoggedIn, validateEmail, validatePassword, validatePhoneNumber } from "../../utils/forms/validator";
import Link from "next/link";
import { User } from "../../types/user";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [checking, setChecking] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    date_of_birth: "",
  });
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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-12 bg-white p-6 rounded-lg shadow space-y-5">
      <h2 className="text-3xl font-semibold text-center text-sky-600">Daftar Akun</h2>

      {error && <p className="text-red-600 text-sm text-center">{error}</p>}

      <div>
        <label className="block mb-1 font-medium">Nama Lengkap</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-300" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-300" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-300" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Nomor Telepon</label>
        <input type="tel" name="phone_number" value={form.phone_number} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-300" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Tanggal Lahir</label>
        <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-300" />
      </div>

      <div>
        <p className="text-sm text-center text-gray-600">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>

      <button type="submit" className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700 transition cursor-pointer">
        Daftar
      </button>
    </form>
  );
}
