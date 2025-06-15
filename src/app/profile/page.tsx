"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { validatePhoneNumber, validatePassword } from "../../../utils/forms/validator";
import ThemeButton from "../../../components/buttons/ThemeButton";

export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const [name, setName] = useState(currentUser?.name || "");
  const [phone, setPhone] = useState(currentUser?.phone_number || "");
  const [dob, setDob] = useState(currentUser?.date_of_birth || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setPhone(currentUser.phone_number || "");
      setDob(currentUser.date_of_birth || "");
    }
  }, [currentUser]);

  if (!currentUser) return <p className="text-center mt-10 text-gray-800 dark:text-gray-200">Loading ...</p>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (!name) return setError("Nama tidak boleh kosong");

    if (password) {
      if (!newPassword || !confirmPassword) {
        return setError("Mohon isi password baru dan konfirmasi password.");
      }

      if (!validatePassword(password) || !validatePassword(newPassword) || !validatePassword(confirmPassword)) {
        return setError("Password minimal 6 karakter.");
      }

      if (newPassword !== confirmPassword) {
        return setError("Password baru dan konfirmasi tidak cocok.");
      }
    }

    if (phone && !validatePhoneNumber(phone)) {
      return setError("Format nomor telpon tidak sesuai");
    }

    const updatedUsers = users.map((u: any) =>
      u.email === currentUser.email
        ? {
            ...u,
            name,
            phone_number: phone,
            date_of_birth: dob,
            ...(newPassword
              ? {
                  password: newPassword,
                }
              : {}),
          }
        : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    const updatedCurrentUser = updatedUsers.find((u: any) => u.email === currentUser.email);
    localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));

    if (password) {
      logout();
      return;
    }
    window.location.reload();
  };

  return (
    <div className="max-w-xl mx-auto p-6 my-10 bg-white dark:bg-gray-900 shadow-lg rounded-xl text-gray-800 dark:text-gray-100">
      <div className="flex items-center gap-6">
        <Image
          src={currentUser.picture || "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp"}
          alt="Profile"
          width={100}
          height={100}
          className="rounded-full border-2 border-gray-300 dark:border-gray-700 object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">{currentUser.email}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">User ID: {currentUser.user_id}</p>
        </div>
      </div>

      {error && <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border rounded-md p-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nomor HP</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full border rounded-md p-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Lahir</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="mt-1 w-full border rounded-md p-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <hr className="my-6 border-gray-300 dark:border-gray-600" />

        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Ganti Password</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password Sekarang</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full border rounded-md p-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password Baru</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 w-full border rounded-md p-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Konfirmasi Password Baru</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 w-full border rounded-md p-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="flex w-full justify-between">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Simpan Perubahan
          </button>
          <button type="button" onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
            Logout
          </button>
        </div>
      </form>
      <div className="mt-6 flex justify-end">
        <ThemeButton />
      </div>
    </div>
  );
}
