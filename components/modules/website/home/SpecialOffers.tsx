"use client";
import React, { useEffect, useState } from "react";
import Container from "../../custom/Container";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { cn } from "@/lib/utils";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";
import { Product } from "@/types";
import ProductCard from "../../custom/ProductCard";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

export default function SpecialOffers() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = () => {
      setLoading(true);
      axios
        .get(process.env.NEXT_PUBLIC_API_URL + "/api/product-stores")
        .then((response) => {
          setProducts(response?.data?.data);
        })
        .catch((error) => {
          console.log(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    getProducts();
  }, []);

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-10 relative">
      {[1, 2, 3, 4, 5, 6]?.map((e) => (
        <div key={e} className="relative flex flex-col justify-between items-center h-full border border-gray-200 rounded-lg bg-white shadow-sm p-4">
          <Skeleton className="h-[260px] w-full rounded-lg" />
          <Skeleton className="h-6 w-3/4 mt-4 rounded-md" />
          <Skeleton className="h-4 w-20 mt-2 rounded-md" />
          <Skeleton className="h-6 w-1/3 mt-4 rounded-md" />
          <Skeleton className="h-10 w-3/4 mt-4 rounded-full" />
        </div>
      ))}
    </div>
  );

  if (!products || products.length === 0 || loading) {
    return renderSkeleton();
  }

  return (
    <section className="py-12 relative rounded-lg shadow-lg">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50" />
      
      <Container className="relative">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
          <div className="text-left mb-6 px-2">
            <h2 className="text-2xl font-bold text-gray-800">Special Offers</h2>
          </div>
          <Swiper
            breakpoints={{
              360: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              575: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 20,
              },
            }}
            autoplay={{
              delay: 25000,
              disableOnInteraction: false,
            }}
            spaceBetween={50}
            slidesPerView={1}
            navigation={false}
            pagination={true}
            modules={[Autoplay, Navigation, Pagination]}
            className={cn("mySwiper h-full w-full")}
          >
            {products &&
              products?.slice(0, 10)?.map((item: Product, idx: number) => (
                <SwiperSlide key={idx} className="relative py-10">
                  <ProductCard
                    loading={loading}
                    item={item}
                    icon=""
                    handler={() => {}}
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </Container>
    </section>
  );
} 