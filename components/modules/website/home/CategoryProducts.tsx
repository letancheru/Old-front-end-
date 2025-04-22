"use client";
import React from "react";
import Container from "../../custom/Container";
import Heading from "../../custom/Heading";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { cn } from "@/lib/utils";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";
import { Product } from "@/types";
import ProductCard from "../../custom/ProductCard";

interface CategoryProductsProps {
  group: { [key: string]: Product[] };
  loading: boolean;
}

export default function CategoryProducts({ group, loading }: CategoryProductsProps) {
  return (
    <>
      {group &&
        Object.keys(group)
          ?.slice(0, 5)
          ?.map((e: string) => {
            return (
              <section key={e} className="py-6 relative">
                <Container>
                  <Heading name={e} />
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
                    {e &&
                      group[e]
                        ?.slice(0, 10)
                        ?.map((item: Product, idx: number) => (
                          <SwiperSlide
                            key={idx}
                            className="relative py-10"
                          >
                            <ProductCard
                              loading={loading}
                              item={item}
                              icon=""
                              handler={() => {}}
                            />
                          </SwiperSlide>
                        ))}
                  </Swiper>
                </Container>
              </section>
            );
          })}
    </>
  );
} 