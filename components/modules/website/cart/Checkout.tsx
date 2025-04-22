import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { cn, formatPrice } from "@/lib/utils";
import { Cart } from "@/types";
import Link from "next/link";
import React from "react";
import { ShoppingCart } from "lucide-react";

interface CheckoutProps {
  totalDiscount: string;
  showbutton: boolean;
  itemsCount: number;
  subtotal: string;
  productDiscount: string;
  couponDiscount: string;
  tax: { name: string; rate: number }[];
  total: string;
  proceedCheckout: () => void;
  loading: boolean;
}

export default function Checkout({
  totalDiscount,
  showbutton,
  itemsCount,
  subtotal,
  productDiscount,
  couponDiscount,
  tax,
  total,
  proceedCheckout,
  loading,
}: CheckoutProps) {
  // const totalTax = tax
  //   ?.reduce((acc: number, tax: any) => {
  //     const taxRate = tax?.rate || tax.default_tax_rate;
  //     return (
  //       Number(acc) + Number(subtotal) * (Number(tax?.rate) / Number(subtotal))
  //     );
  //   }, 0)
  //   .toFixed(2);

  // const { cart, setCart } = useCart() as {
  //     cart: Cart;
  //     setCart: any;
  // };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Items ({itemsCount})</span>
          <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
        </div>

        {Number(productDiscount) > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Product Discount</span>
            <span className="font-medium text-red-600">-{formatPrice(productDiscount)}</span>
          </div>
        )}

        {Number(couponDiscount) > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Coupon Discount</span>
            <span className="font-medium text-red-600">-{formatPrice(couponDiscount)}</span>
          </div>
        )}

        {tax.map((t, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-600">{t.name} ({t.rate}%)</span>
            <span className="font-medium text-gray-900">
              {formatPrice((Number(subtotal) - Number(totalDiscount)) * (t.rate / 100))}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between">
          <span className="text-base font-medium text-gray-900">Total</span>
          <span className="text-base font-bold text-primary-600">$ {total}</span>
        </div>
      </div>

      {showbutton && (
        <Button
          onClick={proceedCheckout}
          disabled={loading || itemsCount === 0}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-2 rounded-lg hover:shadow-lg hover:shadow-primary-500/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium group/btn disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4 transition-transform duration-200 group-hover/btn:scale-110" />
          <span className="transition-transform duration-200 group-hover/btn:scale-105">
            {loading ? 'Processing...' : 'Proceed to Checkout'}
          </span>
        </Button>
      )}
    </div>
  );
}
