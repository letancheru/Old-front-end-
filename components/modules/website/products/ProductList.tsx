import { Product, User } from "@/types";
import React, { useState } from "react";
import ProductCard from "../../custom/ProductCard";
import { ShoppingBasket } from "lucide-react";
import Loading from "../../custom/Loading";
import { useUser } from "@/contexts/UserContext";
import { useWishlist } from "@/contexts/WishlistContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductList({
  loading,
  products,
}: {
  loading: boolean;
  products: Product[];
}) {
  const token = localStorage.getItem("token");
  const { user } = useUser() as { user: User | null };
  const { wishlist, setWishlist } = useWishlist() as {
    wishlist: any;
    setWishlist: any;
  };
  const router = useRouter();

  const addToWishlist = async (productId: any) => {
    try {
      if (token) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wishlists`,
          { product_id: productId },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token if authentication is required
            },
          }
        );

        if (response.status === 201) {
          alert("Product added to wishlist!");
          // Optional: Refetch wishlist data
          const updatedWishlist = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/wishlists`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setWishlist(updatedWishlist?.data);
        }
      } else {
        router.push("/signin");
      }
    } catch (err: any) {
      console.error("Error adding to wishlist:", err);
      // alert(err?.message);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-10 relative">
        {!loading &&
          products &&
          products?.length > 0 &&
          products?.map((item: Product, idx: number) => (
            <ProductCard
              loading={loading}
              item={item}
              key={idx}
              icon="add"
              handler={() => addToWishlist(item?.product?.id)}
            />
          ))}{" "}
        {loading && products?.length === 0 && (
          <>
            {[1, 2, 3, 4, 5, 6]?.map((e) => {
              return (
                <div className="relative flex flex-col justify-between items-center h-full border border-gray-200 rounded-lg bg-white shadow-sm p-4">
                  {/* Image Skeleton */}
                  <Skeleton className="h-[260px] w-full rounded-lg" />

                  {/* Title Skeleton */}
                  <Skeleton className="h-6 w-3/4 mt-4 rounded-md" />

                  {/* Rating Skeleton */}
                  <Skeleton className="h-4 w-20 mt-2 rounded-md" />

                  {/* Price Skeleton */}
                  <Skeleton className="h-6 w-1/3 mt-4 rounded-md" />

                  {/* Button Skeleton */}
                  <Skeleton className="h-10 w-3/4 mt-4 rounded-full" />
                </div>
              );
            })}
          </>
        )}
      </div>
      {!loading && products?.length <= 0 && (
        <div className="flex flex-col justify-center items-center py-20 px-20  gap-10 w-full">
          <ShoppingBasket className="font-bold" size={100} />
          <h1 className="font-medium text-center  text-2xl flex">
            No Product Found
          </h1>
        </div>
      )}
    </>
  );
}
