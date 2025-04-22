import { Skeleton } from "@/components/ui/skeleton";
import {

} from "@/lib/utils";
import { Cart, Product } from "@/types";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Rating } from "@mui/material";
import CurrencyFormat from "./CurrencyFormat";
import { AiOutlineHeart, AiFillHeart, AiFillCloseCircle } from "react-icons/ai";
import { BsCart } from "react-icons/bs";
import { Eye } from "lucide-react";
import axios from "axios";
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";
import Toast from "./Toast";
import { useBranch } from "@/contexts/BranchContext";
import { useUser } from "@/contexts/UserContext";
import { useWishlist } from "@/contexts/WishlistContext";
import CartService from "@/components/service/CartService";
import { formatPrice } from "@/lib/utils";

export default function ProductCard({
  item,
  loading,
  icon,
  handler,
}: {
  item: Product;
  loading: boolean;
  icon: string;
  handler: any;
}) {
  const { cart, setCart } = useCart() as unknown as { cart: Cart; setCart: any };
  const { wishlist, setWishlist } = useWishlist() as { wishlist: any; setWishlist: any };
  const { user }: { user: any } = useUser();
  const { branch } = useBranch();
  const token = localStorage.getItem("token");
  const [isWishlist, setIsWishlist] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  
 

  // Check if item is in wishlist
  useEffect(() => {
    if (wishlist) {
      const isInWishlist = wishlist.some((wishlistItem: any) => 
        wishlistItem?.product?.id === item?.product?.id
      );
      setIsWishlist(isInWishlist);
    }
  }, [wishlist, item]);

  const handleWishlist = async () => {
    if (!user) {
      toast.custom(<Toast message="Please login to add items to wishlist" status="error" />);
      return;
    }

    try {
      if (isWishlist) {
        // Remove from wishlist
        const wishlistItem = wishlist.find((w: any) => w?.product?.id === item?.product?.id);
        if (wishlistItem) {
          const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/api/wishlists/${wishlistItem.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200 || response.status === 204) {
            const updatedWishlist = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/wishlists`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setWishlist(updatedWishlist?.data || []);
            toast.custom(<Toast message="Removed from wishlist" status="success" />);
          }
        }
      } else {
        // Add to wishlist
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wishlists`,
          { product_id: item?.product?.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          const updatedWishlist = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/wishlists`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setWishlist(updatedWishlist?.data);
          toast.custom(<Toast message="Added to wishlist" status="success" />);
        }
      }
    } catch (err: any) {
      console.error("Error managing wishlist:", err);
      toast.custom(<Toast message={err?.response?.data?.message || "Error managing wishlist"} status="error" />);
    }
  };

  const addTocartHandler = async () => {
    if (!user) {
      toast.custom(<Toast message="Please login to add items to cart" status="error" />);
      return;
    }

    if (!branch) {
      toast.custom(<Toast message="Please select your branch!" status="error" />);
      return;
    }

    try {
      setCartLoading(true);
      await CartService.addItem(String(item?.id), 1);
      const updatedCart = await CartService.getCart();
      setCart(updatedCart);
      toast.custom(<Toast message="Added to cart" status="success" />);
    } catch (error: any) {
      toast.custom(<Toast message={error?.response?.data?.message || "Error adding to cart"} status="error" />);
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <div className="group relative w-[280px] bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_10px_40px_-3px_rgba(6,81,237,0.2)] transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary-100 hover:-translate-y-1">
      {item.product && item.product.discount && Number(item.product.discount) > 0 && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm">
            {item.product.discout_type === 'percent' 
              ? `${item.product.discount} OFF`
              : `${item.product.discount}% OFF` }
          </span>
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
        <button 
          onClick={handleWishlist}
          className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 hover:bg-primary-50 transition-all duration-200 backdrop-blur-sm bg-opacity-80"
        >
          {isWishlist ? (
            <AiFillHeart className="w-5 h-5 text-red-500" />
          ) : (
            <AiOutlineHeart className="w-5 h-5 text-gray-600" />
          )}
        </button>
        <button 
          className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 hover:bg-primary-50 transition-all duration-200 backdrop-blur-sm bg-opacity-80"
        >
          <Eye className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Product Image */}
      <Link href={`/products/${item?.product?.slug}`} className="block relative h-[180px] overflow-hidden bg-gray-50">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <>
            <div
              className="w-full h-full bg-cover bg-center transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
              style={{
                backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}/storage/${item?.product?.thumbnail?.file_path})`,
              }}
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-4 pt-3">
        {/* Category */}
        <div className="inline-block text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium mb-2">
          {item?.product?.category?.name || "Category"}
        </div>

        {/* Product Name */}
        <Link href={`/products/${item.product?.slug}`}>
          <h3 className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors duration-200 line-clamp-1 mb-1.5 group-hover:text-primary-600">
            {item.product?.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-2.5">
          <Rating
            size="small"
            value={Number(item?.product?.average_rating || 0)}
            precision={0.5}
            readOnly
          />
          <span className="ml-2 text-xs font-medium text-gray-500">
            ({item?.product?.average_rating || "0"})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            {formatPrice(item?.price)}
          </span>
          {item?.product?.discount && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(Number(item?.price) + Number(item?.product?.discount))}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={addTocartHandler}
          disabled={cartLoading}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-2 rounded-lg hover:shadow-lg hover:shadow-primary-500/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium group/btn disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <BsCart className="w-4 h-4 transition-transform duration-200 group-hover/btn:scale-110" />
          <span className="transition-transform duration-200 group-hover/btn:scale-105">
            {cartLoading ? 'Adding...' : 'Add to Cart'}
          </span>
        </button>
      </div>

      {/* Stock Status - Optional */}
      {item?.quantity <= 0 && (
        <div className="absolute top-0 left-0 w-full h-full bg-white/80 backdrop-blur-[1px] flex items-center justify-center">
          <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium">
            Out of Stock
          </span>
        </div>
      )}
    </div>
  );
}
