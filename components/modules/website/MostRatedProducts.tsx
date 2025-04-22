'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getMostRatedProducts } from '@/components/service/MostRatedProductsService';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { formatPrice } from '@/lib/utils';

interface Product {
  id: number;
  name: string;
  thumbnail: {
    file_path: string;
  };
  product_stores: Array<{
    price: string;
  }>;
  discount_type: string;
  discount: string;
  average_rating: string;
  review_count: number;
}

interface MostRatedProductsProps {
  title?: string;
  products?: Product[];
  showViewMore?: boolean;
  viewMoreLink?: string;
  onAddToCart?: (product: Product) => void;
}

export default function MostRatedProducts({
  title = "Top Rated Products",
  products: propProducts,
  showViewMore = true,
  viewMoreLink = "/products",
  onAddToCart,
}: MostRatedProductsProps) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>(propProducts || []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMostRatedProducts = async () => {
      if (propProducts) return; // Skip if products are provided as props
      
      setLoading(true);
      try {
        const data = await getMostRatedProducts();
        setProducts(data.data);
      } catch (err) {
        console.error("Error fetching most rated products:", err);
        setError("Failed to load most rated products");
      } finally {
        setLoading(false);
      }
    };

    fetchMostRatedProducts();
  }, [propProducts]);

  const renderRatingStars = (rating: string) => {
    const ratingNum = parseFloat(rating);
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          i < ratingNum ? (
            <FaStar key={`star-${i}`} className="text-yellow-400 w-4 h-4" />
          ) : (
            <FaRegStar key={`empty-${i}`} className="text-gray-200 w-4 h-4" />
          )
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-red-600">
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          {showViewMore && (
            <Link 
              href={viewMoreLink}
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
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => {
            const originalPrice = parseFloat(product.product_stores[0]?.price || "0");
            const discountAmount = product.discount_type === 'percent' 
              ? originalPrice * (parseFloat(product.discount) / 100)
              : parseFloat(product.discount);
            const discountedPrice = originalPrice - discountAmount;

            return (
              <div 
                key={product.id} 
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.02] cursor-pointer"
              >
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${product.thumbnail.file_path}`}
                      alt={product.name}
                      fill
                      className="object-contain rounded-lg transition-transform duration-300 hover:scale-110"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {renderRatingStars(product.average_rating)}
                    
                    <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">
                      {product.name}
                    </h3>

                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-400 line-through text-sm">
                        {formatPrice(originalPrice)}
                      </span>
                      <span className="text-red-500 font-semibold">
                        {formatPrice(discountedPrice)}
                      </span>
                    </div>

                    <button 
                      onClick={() => onAddToCart?.(product)}
                      className="w-full mt-2 bg-[#082F66] hover:bg-[#06244d] py-1.5 px-4 rounded text-sm font-medium text-center transition-colors text-white"
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
} 