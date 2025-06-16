"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { validateEmail, validateName, validatePassword, validatePhoneNumber } from "../../utils/forms/validator";
import Link from "next/link";
import { InputField } from "./InputField";
import { useAuth } from "@/app/context/AuthContext";

export default function RegisterForm() {
  const { currentUser, register } = useAuth();
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
    if (currentUser) {
      router.replace("/");
    }
  }, [currentUser]);

  if (currentUser) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  const validateForm = () => {
    const { name, email, password, phone_number } = form;
    if (!name || !email || !password) return "Harap isi semua bidang.";
    if (!validateName(name)) return "Nama maksimal 30 karakter";
    if (!validateEmail(email)) return "Format email tidak valid.";
    if (!validatePassword(password)) return "Password minimal 6 karakter.";
    if (phone_number && !validatePhoneNumber(phone_number)) return "Format nomor telepon tidak sesuai.";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) return setError(errorMsg);

    const { name, email, password, phone_number, date_of_birth } = form;
    const res = register(name, email, password, phone_number, date_of_birth);
    if (!res) return setError("Email sudah digunakan");

    router.push("/login");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-12 bg-white dark:bg-gray-900 p-6 rounded-lg shadow space-y-5">
      <h2 className="text-3xl font-semibold text-center text-sky-600 dark:text-sky-400">Daftar Akun</h2>

      {error && <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>}

      <InputField label="Nama Lengkap" name="name" value={form.name} onChange={handleChange} mustFill={true} />
      <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} mustFill={true} />
      <InputField label="Password" name="password" type="password" value={form.password} onChange={handleChange} mustFill={true} />
      <InputField label="Nomor Telepon" name="phone_number" type="tel" value={form.phone_number} onChange={handleChange} />
      <InputField label="Tanggal Lahir" name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} />

      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
          Masuk di sini
        </Link>
      </p>

      <button type="submit" className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700 dark:hover:bg-sky-500 transition cursor-pointer">
        Daftar
      </button>
    </form>
  );
}
