"use client";
import React from "react";
import AuthProvider from "./AuthProvider";
import ToastProvider from "./ToastProvider";
import FramerMotionProvider from "./FramerMotionProvider";
import { Provider } from "react-redux";
import store from "@/store/index";
import { UserProvider } from "@/contexts/UserContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { BranchProvider } from "@/contexts/BranchContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <BranchProvider>
        <UserProvider>
          <CartProvider>
            <WishlistProvider>
              <Provider store={store}>
                <FramerMotionProvider>
                  <ToastProvider />
                  {children}
                </FramerMotionProvider>
              </Provider>
            </WishlistProvider>
          </CartProvider>
        </UserProvider>
      </BranchProvider>
    </AuthProvider>
  );
}
