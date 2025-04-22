"use client";
import React, { useEffect, useState } from "react";
import Heading from "../../custom/Heading";
import Container from "../../custom/Container";
import { cn, formatPrice } from "@/lib/utils";
import { getBestSellingProducts } from "@/components/service/BestSellingProductService";
import Link from "next/link";
import Image from "next/image";

// Define the type for the best selling product from the API
interface BestSellingProduct {
  id: number;
  category_id: number;
  brand_id: number;
  unit_id: number;
  name: string;
  slug: string;
  description: string;
  details: string | null;
  youtube_link: string | null;
  SKU: string;
  code: string;
  min_deliverable_qty: number;
  max_deliverable_qty: number | null;
  discount_type: string;
  discount: string;
  status: number;
  created_at: string;
  updated_at: string;
  order_count: number;
  category: {
    id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
  brand: {
    id: number;
    name: string;
    is_active: boolean;
    is_default: boolean;
    created_at: string;
    updated_at: string;
  };
  thumbnail: {
    id: number;
    model_type: string;
    model_id: number;
    collection_name: string;
    type: string;
    file_path: string;
    gallery: string | null;
    mime_type: string | null;
    created_at: string;
    updated_at: string;
  };
  gallery: {
    id: number;
    model_type: string;
    model_id: number;
    collection_name: string;
    type: string;
    file_path: string | null;
    gallery: string | null;
    mime_type: string | null;
    created_at: string;
    updated_at: string;
  } | null;
  product_stores: Array<{
    id: number;
    product_id: number;
    store_id: number;
    quantity: number;
    price: string;
    created_at: string;
    updated_at: string;
    store: {
      id: number;
      parent_id: number | null;
      name: string;
      slug: string;
      location: string;
      created_at: string;
      updated_at: string;
    };
  }>;
  taxes: Array<{
    id: number;
    name: string;
    code: string;
    default_tax_rate: number;
    status: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    pivot?: {
      product_id: number;
      tax_id: number;
      custom_tax_rate: string;
    };
  }>;
  reviews: Array<{
    id: number;
    user_id: number;
    product_id: number;
    status: string;
    rating: number;
    comment: string;
    created_at: string;
    updated_at: string;
  }>;
}

export default function BestSellersProducts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<BestSellingProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getBestSellingProducts();
        setProducts(response || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch best selling products');
        console.error('Error fetching best selling products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return (
      <section className="py-10">
        <Container>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Best Products</h2>
            <Link href="/products" className="text-gray-600 hover:text-gray-900 flex items-center">
              View More
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          <div className="text-red-500 text-center py-4">{error}</div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-10">
      <Container>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Best Products</h2>
          <Link href="/products" className="text-gray-600 hover:text-gray-900 flex items-center">
            View More
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="animate-pulse min-w-[280px]">
                <div className="flex space-x-4">
                  <div className="bg-gray-200 rounded-lg w-24 h-24 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-4">No best selling products available</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.slice(0, 9).map((product) => (
              <Link href={`/products/${product.slug}`} key={product.id} className="group min-w-[280px]">
                <div className="flex items-center bg-white rounded-lg hover:shadow-md transition-shadow p-3">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${product.thumbnail.file_path}`}
                      alt={product.name}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                  <div className="flex-1 ml-4">
                    <h3 className="text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-gray-500 line-through text-sm">
                        {formatPrice(product.product_stores[0]?.price || "0")}
                      </span>
                      <span className="text-red-600 font-semibold text-lg">
                        {formatPrice((parseFloat(product.product_stores[0]?.price || "0") * (1 - parseFloat(product.discount) / 100)))}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
