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
    const cached = localStorage.getItem("products");

    if (cached) {
      setProducts(JSON.parse(cached));
      setChecking(false);
    } else {
      axios.get("https://dummyjson.com/products").then((res) => {
        setProducts(res.data.products);
        localStorage.setItem("products", JSON.stringify(res.data.products));
        setChecking(false);
      });
    }
  }, []);

  return <ProductContext.Provider value={{ products, checking }}>{children}</ProductContext.Provider>;
};

export const useProductContext = () => useContext(ProductContext);
