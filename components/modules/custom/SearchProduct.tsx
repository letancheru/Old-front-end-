import { cn } from "@/lib/utils";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CurrencyFormat from "./CurrencyFormat";

export default function SearchProduct({
  products,
  className,
}: {
  products: Product[];
  className?: string;
}) {
  return (
    <div className="w-full gap-4">
      {products?.length > 0 ? (
        products.map((item: Product, idx: number) => (
          <Link
            key={idx}
            className="flex gap-4 w-full border-b hover:shadow-md py-2 justify-between items-center"
            href={`/products/${item?.product?.slug}`}
          >
            <div className="flex-shrink-0 h-10 w-full flex items-center justify-center">
              <Image
                src={
                  process.env.NEXT_PUBLIC_API_URL +
                  "/storage/" +
                  item?.product?.thumbnail?.file_path
                }
                width="48"
                height="40"
                alt="product"
                className="object-cover w-10"
              />
            </div>

            <div className="text-lg flex gap-2 flex-col w-full font-medium text-gray-800 capitalize">
              <p> {item?.product?.name.substring(0, 40)}</p>
              {/* <div className="text-lg font-medium w-full text-gray-800 capitalize">
                  {item?.product?.category.name}
                </div> */}
              <div className="text-primary-800 w-full text-xl font-medium">
                <CurrencyFormat className="font-bold" value={item?.price} />
              </div>
            </div>
          </Link>
        ))
      ) : (
        <p className="text-center">No products found.</p>
      )}
    </div>
  );
}
