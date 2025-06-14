import { Product } from "../../types/product";
import { Review } from "../../types/Review";

export default function ReviewComment({ review }: { review: Review }) {
  return (
    <div className="border rounded-lg p-4 bg-gray-50 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">{review.reviewerName}</span>
        <span className="text-sm text-gray-500">{review.date.split("T")[0]}</span>
      </div>
      <p>{review.comment}</p>
      <div className="flex items-center mb-1 text-2xl">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        ))}
      </div>
    </div>
  );
}
