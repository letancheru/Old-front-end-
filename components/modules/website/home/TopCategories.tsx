"use client";
import React, { useEffect, useState } from "react";
import Container from "../../custom/Container";
import { Category } from "@/types";
import Link from "next/link";
import Image from "next/image";
import Loading from "../../custom/Loading";
import Heading from "../../custom/Heading";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryService from "@/components/service/CategoryService";

export default function TopCategories() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      try {
        const categoriesData = await CategoryService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    getCategories();

    // Get initial selected category from localStorage
    const storedCategory = localStorage.getItem('selectedCategory');
    if (storedCategory) {
      setSelectedCategory(JSON.parse(storedCategory));
    }

    // Listen for category selection changes
    const handleCategoryChange = () => {
      const storedCategory = localStorage.getItem('selectedCategory');
      setSelectedCategory(storedCategory ? JSON.parse(storedCategory) : null);
    };

    window.addEventListener('categorySelected', handleCategoryChange);
    return () => {
      window.removeEventListener('categorySelected', handleCategoryChange);
    };
  }, []);

  const handleCategoryClick = (category: Category) => {
    localStorage.setItem('selectedCategory', JSON.stringify(category));
    setSelectedCategory(category);
    window.dispatchEvent(new Event('categorySelected'));
  };

  return (
    <section className="py-4 w-full bg-white relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50" />
      
      <Container className="relative px-2">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
          <div className="text-left mb-6 px-2">
            <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
            <p className="text-gray-600 mt-1">Browse products by category</p>
          </div>

          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex space-x-4 pb-4 min-w-max">
                {loading ? (
                  <>
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="flex-shrink-0 w-[calc(16.666%-1rem)]">
                        <div className="flex flex-col items-center">
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                            <Skeleton className="h-full w-full" />
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-100/20" />
                          </div>
                          <Skeleton className="h-4 w-20 mt-3" />
                          <Skeleton className="h-3 w-16 mt-2" />
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        localStorage.removeItem('selectedCategory');
                        setSelectedCategory(null);
                        window.dispatchEvent(new Event('categorySelected'));
                      }}
                      className={`group flex-shrink-0 w-[calc(16.666%-1rem)] flex flex-col items-center p-2 rounded-xl transition-all duration-300 hover:shadow-xl bg-white border ${
                        !selectedCategory 
                          ? 'border-blue-200 bg-blue-50/30' 
                          : 'border-gray-100 hover:border-blue-100 hover:bg-blue-50/30'
                      }`}
                    >
                      <div className="category-icon relative w-32 h-32 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-gray-50 mb-3 flex items-center justify-center border border-gray-100 group-hover:border-blue-200">
                        <div className="text-4xl text-blue-600">All</div>
                      </div>
                      <h3 className="text-sm font-medium text-gray-800 text-center group-hover:text-blue-600">
                        All Categories
                      </h3>
                    </button>
                    {categories.map((item: Category) => (
                      <button
                        key={item.id}
                        onClick={() => handleCategoryClick(item)}
                        className={`group flex-shrink-0 w-[calc(16.666%-1rem)] flex flex-col items-center p-2 rounded-xl transition-all duration-300 hover:shadow-xl bg-white border ${
                          selectedCategory?.id === item.id 
                            ? 'border-blue-200 bg-blue-50/30' 
                            : 'border-gray-100 hover:border-blue-100 hover:bg-blue-50/30'
                        }`}
                      >
                        <div className="category-icon relative w-32 h-32 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-gray-50 mb-3 flex items-center justify-center border border-gray-100 group-hover:border-blue-200">
                          <Image
                            src={
                              process.env.NEXT_PUBLIC_API_URL +
                              "/storage/" +
                              item?.thumbnail?.file_path
                            }
                            alt={item?.name || "category"}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                        <h3 className="text-sm font-medium text-gray-800 text-center group-hover:text-blue-600">
                          {item?.name?.length > 20
                            ? item?.name?.substring(0, 20) + "..."
                            : item?.name}
                        </h3>
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>

      <style jsx global>{`
        .category-icon {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        .category-icon:hover {
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15);
          transform: translateY(-2px);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
          cursor: grab;
        }
        .scrollbar-hide:active {
          cursor: grabbing;
        }
      `}</style>
    </section>
  );
}
