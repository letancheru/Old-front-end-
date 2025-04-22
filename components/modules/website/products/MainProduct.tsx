"use client";
import React from "react";
import HeaderImage from "./HeaderImage";
import ShopProducts from "./ShopProducts";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "../../custom/ProductCard";

interface MainProductProps {
  products: any[];
  loading?: boolean;
}

export default function MainProduct({ products, loading = false }: MainProductProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          item={product}
          loading={false}
          icon="add"
          handler={() => {}}
        />
      ))}
    </div>
  );
}
