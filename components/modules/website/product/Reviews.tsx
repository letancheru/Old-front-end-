"use client";
import React, { useEffect, useState } from "react";
import { Product, Review } from "@/types";
import AddReview from "../reviews/AddReview";
import ReviewList from "../reviews/ReviewList";
import axios from "axios";

export default function Reviews({ product }: { product: Product }) {
  const [reviews, setReviews] = useState<Review[]>([]); // FIXED: Ensuring it's always an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!product?.id) return;

    const getProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/reviews?product_id=${product?.id}`
        );

        console.log(response.data, "review from inside response");
        setReviews(response?.data || []); // FIXED: Ensuring response is always an array
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load review.");
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [product?.id]);

  console.log(reviews, "reviews from reviews 2");

  return (
    <section>
      <div className="flex flex-col gap-4">
        <AddReview
          product={product}
          reviews={reviews}
          setReviews={setReviews}
        />
        <ReviewList reviews={reviews} />
      </div>
    </section>
  );
}
