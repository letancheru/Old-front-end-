import { discountPrice, formatPrice } from "@/lib/utils";
import { Option, Product } from "@/types";
import React from "react";

export default function ProductPrice({ product }: { product: Product }) {
  return (
    <div className="flex gap-2 flex-col">
      <div className="flex items-center gap-8">
        <div className="text-primary-700 tracking-widest font-bold">
          {/* ${option.discount > 0 ?
                    discountPrice(option.price, option.discount) : option.price } */}
          {formatPrice(product?.price)}
        </div>
      </div>
    </div>
  );
}
