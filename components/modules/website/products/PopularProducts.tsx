'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCardSkeleton from "../home/ProductCardSkeleton";
import { getPopularProducts } from '@/components/service/PopularProductService';
import { formatPrice } from '@/lib/utils';

// Define the type for the popular product from the API
interface PopularProduct {
  id: number;
  name: string;
  description: string;
  order_count: number;
  total_quantity_sold: string;
  total_revenue: string;
}

const PopularProducts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<PopularProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPopularProducts();
        setProducts(response || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch popular products');
        console.error('Error fetching popular products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">{error}</div>
    );
  }

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Best Products</h2>
          <Link 
            href="/products" 
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300"
          >
            View More
            <svg 
              className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {loading ? (
          <ProductCardSkeleton count={12} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.02] cursor-pointer"
              >
                <div className="flex flex-col">
                  <h3 className="font-medium text-gray-900 text-lg mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3">
                    {product.description}
                  </p>
                  <div className="flex justify-between mt-2">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Orders</p>
                      <p className="font-semibold">{product.order_count}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Sold</p>
                      <p className="font-semibold">{product.total_quantity_sold}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Revenue</p>
                      <p className="font-semibold text-green-600">{formatPrice(product.total_revenue)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularProducts;
