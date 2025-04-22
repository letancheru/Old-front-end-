import { Order, ProductOrder } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function OrderProducts({ order }: { order: Order | undefined }) {
  return (
    <div className="w-full border-neutral-100">
      {order?.items?.map((item: ProductOrder, idx: number) => (
        <div
          key={idx}
          className="flex flex-col lg:flex-row items-center justify-between gap-6 p-6 border-b border-gray-200 bg-white shadow-sm rounded-lg w-full"
        >
          {/* Product Image */}
          <div className="w-32 h-20 flex-shrink-0">
            <Image
              alt="product"
              src={
                process.env.NEXT_PUBLIC_API_URL +
                "/storage/" +
                item?.product_store?.product?.thumbnail?.file_path
              }
              className="rounded-lg object-cover w-full h-full"
              width={120}
              height={70}
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 flex flex-col lg:flex-row lg:items-center justify-between w-full gap-4">
            <div className="flex flex-col">
              <Link href={`/products/${item?.product_store?.product?.slug}`}>
                <h2 className="font-semibold text-lg text-gray-800 hover:text-indigo-600 transition duration-300">
                  {item?.product_store?.product?.name?.substring(0, 60)}
                </h2>
              </Link>
              <p className="text-gray-500 text-sm">
                Quantity:{" "}
                <span className="text-gray-800">{item?.quantity}</span>
              </p>
            </div>

            {/* Price & Discount */}
            <div className="flex flex-col text-right">
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-lg font-semibold text-green-600">
                  ${item?.total_amount}
                </p>
              </div>
            </div>

            <div className="flex flex-col text-right">
              <div>
                <p className="text-sm text-gray-500">Discount</p>
                <p className="text-lg font-semibold text-red-500">
                  - ${item?.discount_amount}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
