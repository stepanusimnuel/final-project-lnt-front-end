"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "../types/user";

export function useAuth({
  redirectIfFound = false,
  redirectTo = "",
}: {
  redirectIfFound?: boolean;
  redirectTo?: string;
} = {}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    const user = stored ? JSON.parse(stored) : null;
    setCurrentUser(user);

    if (!user && redirectTo) {
      router.push(redirectTo);
    }

    setLoading(false);
  }, [redirectIfFound, redirectTo, router]);

  function register(name: string, email: string, password: string, phone_number: string, date_of_birth: string) {
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some((u) => u.email === email)) return false;

    const newUser: User = {
      user_id: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
      name,
      email,
      password,
      phone_number,
      date_of_birth,
      picture: "",
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    return true;
  }

  function login(email: string, password: string): boolean {
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) return false;

    localStorage.setItem("currentUser", JSON.stringify(user));
    setCurrentUser(user);
    return true;
  }

  function logout() {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    router.push("/login");
  }

  return { currentUser, register, login, logout };
}
