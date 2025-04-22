"use client";
import Link from "next/link";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Slide } from "@/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { cn } from "@/lib/utils";
import "./style.css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";
import { m, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Percent, Clock, Sparkles } from "lucide-react";

export default function HomeSlide({ className }: { className?: string }) {
  const animation = {
    hide: { x: 82, opacity: 0 },
    show: { x: 0, opacity: 1 },
  };
  const [loading, setLoading] = useState(true);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const getSlides = async () => {
      setLoading(true);
      await axios
        .get(process.env.NEXT_PUBLIC_API_URL + "/api/active-banners")
        .then((response) => {
          setSlides(response.data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    getSlides();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!slides || slides.length === 0) return; // Prevent running if slides are not valid

    const interval = setInterval(() => {
      setDirection(1); // Set direction to 1 (forward)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides?.length); // Wrap around using modulo
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [slides]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const slideTransition = {
    type: "tween",
    duration: 0.5
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row w-full min-h-[50vh] md:min-h-[60vh] lg:min-h-[80vh] gap-4 md:gap-6 lg:gap-8">
        {/* Main Slide Section */}
        <div className="flex w-full relative overflow-hidden shadow-lg border-0 rounded-xl h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] lg:flex-[64%] bg-gradient-to-br from-gray-900/90 to-gray-800/90">
          {loading ? (
            <div className="w-full h-full">
              <Skeleton className="w-full h-full rounded-xl" />
            </div>
          ) : (
            <AnimatePresence initial={false} custom={direction}>
              <m.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                className="absolute z-20 inset-0 w-full h-full"
                style={{
                  backgroundImage: `url(${
                    process.env.NEXT_PUBLIC_API_URL +
                    "/storage/" +
                    slides[currentIndex]?.["banner"]?.["file_path"]
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
              </m.div>
              <div className="absolute z-30 inset-0 flex items-center justify-start">
                {slides[currentIndex]?.["title"] ? (
                  slides[currentIndex]?.["title"] !== "" && (
                    <div className="flex flex-col gap-4 md:gap-6 p-6 sm:p-8 md:p-10 lg:p-12 max-w-[80%]">
                      <m.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide leading-tight"
                      >
                        {slides[currentIndex]?.["title"]}
                      </m.h1>
                      <m.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 tracking-wide leading-relaxed"
                      >
                        {slides[currentIndex]?.["description"]}
                      </m.h2>
                      <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-4"
                      >
                        <Button
                          className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300"
                          variant="default"
                          size="lg"
                        >
                          <Link href="/products" className="flex items-center gap-2">
                            Shop Now <ArrowRight size={16} />
                          </Link>
                        </Button>
                      </m.div>
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full w-full">
                    <Button
                      className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300"
                      variant="default"
                      size="lg"
                    >
                      <Link href="/products" className="flex items-center gap-2">
                        Shop Now <ArrowRight size={20} />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </AnimatePresence>
          )}
        </div>
        
        {/* Promotion Cards Section */}
        <div className="flex w-full flex-col gap-4 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] lg:flex-[30%] lg:max-w-[300px]">
          {loading ? (
            <>
              {[1, 2, 3]?.map((e) => (
                <Skeleton key={e} className="h-[calc(33.33%-8px)] w-full rounded-xl" />
              ))}
            </>
          ) : (
            <>
              <div className="group relative overflow-hidden rounded-xl shadow-lg border-0 h-[calc(33.33%-8px)] bg-gradient-to-br from-primary-500 to-primary-600 hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-transparent"></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-300/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-400/20 rounded-tr-full"></div>
                <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <Percent size={20} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Special Offers</h3>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-white/90 text-sm">Get up to <span className="font-bold">50% off</span> on selected items</p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="mt-1 text-white hover:bg-white/20 w-fit px-0"
                    >
                      <Link href="/products?category=on-sale" className="flex items-center gap-1 text-sm">
                        View Deals <ArrowRight size={14} />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="group relative overflow-hidden rounded-xl shadow-lg border-0 h-[calc(33.33%-8px)] bg-gradient-to-br from-secondary-500 to-secondary-600 hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary-400/20 to-transparent"></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-300/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary-400/20 rounded-tr-full"></div>
                <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <Sparkles size={20} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">New Arrivals</h3>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-white/90 text-sm">Discover our <span className="font-bold">latest collection</span></p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="mt-1 text-white hover:bg-white/20 w-fit px-0"
                    >
                      <Link href="/products?sort=newest" className="flex items-center gap-1 text-sm">
                        Explore <ArrowRight size={14} />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="group relative overflow-hidden rounded-xl shadow-lg border-0 h-[calc(33.33%-8px)] bg-gradient-to-br from-orange-500 to-orange-600 hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-transparent"></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-300/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-400/20 rounded-tr-full"></div>
                <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <Clock size={20} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Limited Time Offer</h3>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-white/90 text-sm">Flash sale: <span className="font-bold">30% off</span> for the next 24 hours</p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="mt-1 text-white hover:bg-white/20 w-fit px-0"
                    >
                      <Link href="/products?category=flash-sale" className="flex items-center gap-1 text-sm">
                        Shop Now <ArrowRight size={14} />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
