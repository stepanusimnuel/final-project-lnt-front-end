import { Review } from "./Review";

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  weight: number;
  tags: Array<string>;
  dimensions: {
    height: number;
    width: number;
    depth: number;
  };
  review: Review;
  thumbnail: string;
  images: string;
}
