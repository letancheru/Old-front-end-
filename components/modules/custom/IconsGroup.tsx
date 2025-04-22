"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { CiShoppingBasket, CiHeart } from "react-icons/ci";
import CurrencyFormat from "./CurrencyFormat";
import { useSelector, useDispatch } from "react-redux";
import { IRootState } from "@/store";
import { Cart, CartItem, Product, User } from "@/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IoCloseOutline } from "react-icons/io5";
import { updateCart } from "@/store/cartSlice";
import toast from "react-hot-toast";
import Toast from "./Toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createOrder } from "@/store/orderSlice";
import axios from "axios";
import { signIn } from "next-auth/react";
import { ShoppingBasket } from "lucide-react";
import Link from "next/link";
import QuantityCart from "./QuantityCart";
import Loading from "./Loading";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useUser } from "@/contexts/UserContext";

export default function IconsGroup() {
  const { user } = useUser() as { user: User | null };
  const token = localStorage?.getItem("token");
  const { cart, setCart } = useCart() as {
    cart: Cart;
    setCart: any;
  };

  const { wishlist, setWishlist } = useWishlist() as {
    wishlist: Cart;
    setWishlist: React.Dispatch<React.SetStateAction<Cart>>;
  };

  const [cartOpen, setCartOpen] = useState(false);

  const handleRmoveItem = (item: CartItem) => {
    const newCart = cart?.items.filter((p: CartItem) => p.id !== item.id);
    setCart(newCart);
    toast.custom(
      <Toast message="Product deleted from cart" status="success" />
    );
  };

  const subtotal =
    cart &&
    cart?.items?.reduce(
      (accumulateur: number, currentValue: CartItem) =>
        accumulateur +
        Number(currentValue?.product?.product?.price) *
          Number(currentValue.qty),
      0
    );

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { status, data: session } = useSession();

  const handleRemoveCartItem = async (item: any) => {
    // if (order.orderDetails.length > 0) {
    //   toast.custom(
    //     <Toast message="An order has already been placed" status="success" />
    //   );

    //   router.push("/checkout");
    //   return;
    // } else {
    //   if (cart.items.length === 0) {
    //     toast.custom(
    //       <Toast
    //         message="Your cart is empty go to shop"
    //         status="success"
    //         link="/products"
    //       />
    //     );

    //     return;
    //   }

    if (user) {
      // setLoading(true);

      axios
        .delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cart/items/${item?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          const fetchCart = async () => {
            const data = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/cart`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            const value = await data.json();

            setCart(value);

            toast.custom(
              <Toast message={"Item removed from cart."} status="success" />
            );
          };

          fetchCart();
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      const localCart = JSON.parse(
        localStorage.getItem("elelan_cart_items") || "{}"
      );

      localStorage.setItem(
        "elelan_cart_items",
        JSON.stringify({
          ...localCart,
          items: localCart?.items?.filter((e: any, i: any) => i !== item),
        })
      );

      const afterUpdate = JSON.parse(
        localStorage.getItem("elelan_cart_items") || "{}"
      );
      setCart(afterUpdate);
      // router.push("/signin");
    }
  };

  return (
    <div
      className={cn(
        "hidden",
        "lg:flex items-center justify-end ms-auto text-right"
      )}
    >
      {loading && <Loading isLoading={loading} />}
      <div className="hidden w-auto ms-auto lg:flex items-center justify-center">
        <Sheet open={cartOpen} onOpenChange={setCartOpen}>
          <SheetTrigger>
            <div className="relative" id="openCart">
              <span className="absolute rounded-full text-center items-center justify-center flex top-2.5 text-xs -left-4 bg-red-600 text-white w-[26px] h-[26px]">
                {cart && cart?.items ? cart?.items?.length : 0}
              </span>
              <div className="border border-gray-300 p-2 rounded-full">
                <CiShoppingBasket className="h-7 w-7" />
              </div>
            </div>
          </SheetTrigger>

          <SheetTrigger>
            <div className="relative ml-8">
              <Link href="/wishlist">
                <span className="absolute rounded-full text-center items-center justify-center flex top-2.5 text-xs -left-4 bg-red-600 text-white w-[26px] h-[26px]">
                  {wishlist ? wishlist?.length : 0}
                </span>
                <div className="border border-gray-300 p-2 rounded-full">
                  <CiHeart className="h-7 w-7" />
                </div>
              </Link>
            </div>
          </SheetTrigger>

          <SheetContent className="p-0 w-full md-[400px]">
            <SheetHeader className="flex justify-between px-4 py-2 bg-primary-200">
              <SheetTitle>Shopping cart</SheetTitle>
              <SheetDescription>Your cart details goes here</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col h-full">
              <div className="flex flex-col gap-4  max-h-3/5 overflow-y-auto flex-1">
                {cart && cart?.items?.length > 0 ? (
                  cart?.items?.map((item: CartItem, idx: number) => {
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-8 border-b border-slate-100 p-4"
                      >
                        <Image
                          src={
                            process.env.NEXT_PUBLIC_API_URL +
                            "/storage/" +
                            item?.product_store?.product?.thumbnail?.file_path
                          }
                          alt={item?.product_store?.product?.name?.substring(
                            0,
                            20
                          )}
                          height="70"
                          width="100"
                        />
                        <div className="flex flex-col gap-2 w-full">
                          <div className="flex items-start justify-between w-full">
                            <h1 className="text-black font-medium">
                              {item?.product_store?.product?.name?.substring(
                                0,
                                40
                              )}
                            </h1>

                            <button
                              className="px-2 py-1 border rounded-lg"
                              onClick={() =>
                                handleRemoveCartItem(user ? item : idx)
                              }
                            >
                              <IoCloseOutline />
                            </button>
                          </div>
                          <p className="text-gray-700 text-sm">
                            {item?.product_store?.product?.description?.substring(
                              0,
                              60
                            )}
                          </p>
                          <div className="flex justify-between">
                            <QuantityCart item={item} />
                            {/* <div className="text-primary-700 text-base font-bold">
                              x ${item?.product_store?.price}{" "} */}
                            {/* <span className="ml-2 line-through">
                                ${item?.product?.base_buying_price}
                              </span> */}
                            {/* </div> */}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="grid place-content-center justify-items-center gap-4 h-full">
                    <ShoppingBasket className="font-bold" size="100" />
                    <h1 className="flex font-bold text-2xl ">
                      Your cart is empty
                    </h1>

                    <Button variant="link" asChild>
                      <Link
                        href="/products"
                        className="uppercase text-2xl tracking-wider text-white "
                      >
                        shop
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-rows-2 grid-cols-1 mb-20 px-2">
                <div className="flex items-center justify-between shadow-md">
                  <span className="capitalize">Sub total</span>
                  <span className="text-xl text-primary-800 font-bold">
                    <CurrencyFormat value={subtotal} className="text-right" />
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2  w-full py-2 bg-neutral-50 items-center justify-between">
                  <Button asChild variant="link" size="lg">
                    <Link
                      onClick={() => setCartOpen(false)}
                      href="/cart"
                      className="text-white"
                    >
                      View Cart
                    </Link>
                  </Button>

                  <Button variant="default" size="lg">
                    <Link
                      href={user ? "/checkout" : "signin"}
                      className="text-white"
                    >
                      Checkout
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      {/* <div className="flex">
        <CurrencyFormat
          value={0}
          className="text-right text-2xl  font-normal"
        />
      </div> */}
    </div>
  );
}
