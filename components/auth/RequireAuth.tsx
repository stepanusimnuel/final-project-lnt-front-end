"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      router.replace("/login");
      return;
    } else setChecking(false);
  }, [currentUser]);

  if (checking) {
    return <div className="text-center mt-20 text-gray-500">Loading ...</div>;
  }

  return <>{children}</>;
}
