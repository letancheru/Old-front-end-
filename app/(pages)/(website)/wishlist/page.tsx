"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/components/axiosInstance/AxiosInstance";
import { Product, User } from "@/types";
import { useWishlist } from "@/contexts/WishlistContext";
import { useUser } from "@/contexts/UserContext";
import ProductCard from "@/components/modules/custom/ProductCard";

const Wishlist: React.FC = () => {
  const { user } = useUser() as { user: User | null };
  const { wishlist, setWishlist } = useWishlist() as {
    wishlist: any;
    setWishlist: any;
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wishlists`
        );
        setWishlist(response?.data || []);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError("Failed to load wishlist.");
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [user?.id]);

  const removeFromWishlist = async (id: number) => {
    try {
      const response = await axiosInstance.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlists/${id}`
      );

      // Check if the status code indicates success
      if (response.status === 200 || response.status === 204) {
        // Refetch the wishlist to get the latest data
        const updatedWishlist = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wishlists`
        );
        setWishlist(updatedWishlist?.data || []);
      } else {
        console.error("Failed to delete item. Status:", response.status);
      }
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  if (loading) return <p>Loading wishlist...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex justify-center items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-red-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656l-7.071 7.071a.5.5 0 01-.707 0L3.172 10.828a4 4 0 010-5.656z" />
          </svg>
          My Wishlist
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          You have{" "}
          <span className="font-semibold text-red-600">{wishlist?.length}</span>{" "}
          {wishlist?.length === 1 ? "item" : "items"} in your wishlist.
        </p>
      </div>

      {wishlist?.length === 0 ? (
        <p className="text-center text-gray-500">
          Your wishlist is empty. Start adding your favorite products!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist?.map((product: any, i: number) => (
            <div
              key={product?.id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <ProductCard
                loading={loading}
                item={product}
                key={i}
                icon="remove"
                handler={() => removeFromWishlist(product?.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
