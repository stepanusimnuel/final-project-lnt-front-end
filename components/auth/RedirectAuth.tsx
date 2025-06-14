"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

export default function RedirectAuth({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (currentUser) {
      router.replace("/");
      return;
    } else setChecking(false);
  }, [currentUser, checking]);

  if (checking || currentUser) {
    return <div className="text-center mt-20 text-gray-500">Loading ...</div>;
  }

  return <>{children}</>;
}
