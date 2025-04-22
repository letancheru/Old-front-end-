"use client";
import React, { useEffect, useState } from "react";
import Container from "../../custom/Container";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Brand } from "@/types";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { BrandService } from "@/components/service/BrandService";

export default function BrandList() {
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  
  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const brandsData = await BrandService.getBrands();
        setBrands(brandsData);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleBrandSelect = (brand: Brand) => {
    localStorage.setItem('selectedBrand', JSON.stringify(brand));
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('brandSelected'));
  };

  return (
    <section className="py-12 bg-gray-50">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Featured Brands Section */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-1 bg-gray-900 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-gray-900">Featured Brands</h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((e) => (
                  <div key={e} className="flex flex-col items-center gap-2">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => handleBrandSelect(brand)}
                    className="group text-left"
                  >
                    <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center gap-3 transition-all duration-200 hover:bg-gray-100">
                      <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center transition-transform group-hover:scale-110 duration-200 overflow-hidden">
                        {brand.logo && brand.logo.file_path ? (
                          <Image 
                            src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${brand.logo.file_path}`} 
                            alt={brand.name} 
                            width={64} 
                            height={64}
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-xl font-bold text-gray-900">
                            {brand.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {brand.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hero Section */}
          <div className="bg-gradient-to-br from-[#f5e6d3] to-[#f8ede4] rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden shadow-lg min-h-[300px]">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-100/40 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
            
            <div className="relative z-10 max-w-[60%]">
              <span className="inline-block px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-600 mb-3 shadow-sm">
                Premium Quality Products
              </span>
              <h1 className="text-4xl font-bold mb-3 text-gray-900 leading-tight">
                Thousands of<br />
                <span className="text-orange-600">Useful Products</span>
              </h1>
              <p className="text-gray-600 mb-4 text-base">
                Discover our curated collection at unbeatable prices
              </p>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    <div className="w-6 h-6 rounded-full bg-orange-100 border-2 border-white"></div>
                    <div className="w-6 h-6 rounded-full bg-orange-200 border-2 border-white"></div>
                    <div className="w-6 h-6 rounded-full bg-orange-300 border-2 border-white"></div>
                  </div>
                  <span className="text-sm text-gray-600">2k+ Customers</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/products"
                  className="bg-gray-900 text-white px-6 py-2.5 rounded-lg inline-flex items-center gap-2 hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 group text-sm"
                >
                  Shop Now 
                  <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </Link>
              </div>
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[40%]">
              <div className="relative">
                {/* Decorative circle behind product image */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100/60 to-orange-50 rounded-full"></div>
                <Image
                  src="/assets/images/E-Commerce-Transparent-Images-PNG.png"
                  alt="Featured Products"
                  width={400}
                  height={400}
                  className="object-contain relative z-10 drop-shadow-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
