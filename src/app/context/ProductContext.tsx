"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../../../types/product";

interface ProductContextType {
  products: Product[];
  checking: boolean;
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  checking: true,
});

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const load = () => {
      const cached = localStorage.getItem("products");
      if (cached) setProducts(JSON.parse(cached));
      setChecking(false);
    };

    load();

    const handleRefresh = () => {
      const updated = localStorage.getItem("products");
      if (updated) setProducts(JSON.parse(updated));
    };

    window.addEventListener("refresh-products", handleRefresh);

    return () => window.removeEventListener("refresh-products", handleRefresh);
  }, []);

  return <ProductContext.Provider value={{ products, checking }}>{children}</ProductContext.Provider>;
};

export const useProductContext = () => useContext(ProductContext);
