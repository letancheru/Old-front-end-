"use client";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Cart as CartServiceCart } from "@/components/service/CartService";
import { User as UserType } from "@/components/service/ProfileService";
import { Home, LogOut, ShoppingCart, User, Menu } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { CiHeart } from "react-icons/ci";
import MobileDrawer from "../website/header/MobileDrawer";

export default function MobileBottom() {
  const { cart } = useCart() as { cart: CartServiceCart | null };
  const { user } = useUser() as { user: UserType | null };
  const { wishlist } = useWishlist() as { wishlist: any[] | null };
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Calculate cart and wishlist counts safely
  const cartItemCount = cart?.items?.length || 0;
  const wishlistItemCount = wishlist?.length || 0;

  return (
    <>
      <div className="bg-white z-[1000] w-full flex border-t border-t-gray-300 h-16 fixed shadow-md bottom-0 left-0 lg:hidden">
        <div className="flex items-center justify-between w-full px-6">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>

          <Link
            href="/"
            className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Home"
          >
            <Home className="h-6 w-6 text-gray-700" />
          </Link>

          <Link
            href="/wishlist"
            className="relative flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Wishlist"
          >
            <CiHeart className="h-7 w-7 text-gray-700" />
            {wishlistItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {wishlistItemCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className="relative flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart className="h-6 w-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {cartItemCount}
              </span>
            )}
          </Link>

          {user ? (
            <Link
              href="/account/dashboard"
              className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Account"
            >
              <User className="h-6 w-6 text-gray-700" />
            </Link>
          ) : (
            <Link
              href="/signin"
              className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Login"
            >
              <LogOut className="h-6 w-6 text-gray-700" />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
