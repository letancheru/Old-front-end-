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
import { m } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Promotion({ className }: { className?: string }) {
  const animation = {
    hide: { x: 82, opacity: 0 },
    show: { x: 0, opacity: 1 },
  };
  // const [loading, setLoading] = useState(false);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const getSlides = async () => {
      // setLoading(true);
      await axios
        .get(process.env.NEXT_PUBLIC_API_URL + "/api/promotions")
        .then((response) => {
          setSlides(response.data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          console.log("loading");
          // setLoading(false);
        });
    };
    getSlides();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!slides || slides.length === 0) return; // Prevent running if slides are not valid

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides?.length); // Wrap around using modulo
    }, 4000); // Change slide every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [slides]);

  return (
    <>
      <div className="flex relative px-8 mb-4 h-[45vh] w-full gap-8">
        <div className="flex w-full relative overflow-hidden shadow-sm mt-2 rounded-sm h-full lg:ml-2">
          <div
            className="absolute brightness-75 z-20 w-full inset-0 transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${
                process.env.NEXT_PUBLIC_API_URL +
                "/storage/" +
                slides[currentIndex]?.["banner"]?.["file_path"]
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 1,
            }}
          ></div>
          <div className="absolute z-30 inset-0 flex items-center justify-center">
            {slides[currentIndex]?.["name"] ? (
              slides[currentIndex]?.["name"] !== "" && (
                <div className="absolute drop-shadow-2xl  text-white grid grid-cols-1 place-content-center justify-items-center gap-3  capitalize m-auto  left-10 top-10 w-full">
                  <div className="bg-gray-300/40 flex flex-col gap-2 items-center justify-center text-center rounded-sm py-2 px-4">
                    <h1 className="text-xl font-bold tracking-widest lg:text-2xl">
                      {slides[currentIndex]?.["name"]}
                    </h1>
                    <h2 className=" text-sm text-left lg:text-xl lg:max-w-screen-md tracking-widest leading-8">
                      {slides[currentIndex]?.["description"]}
                    </h2>
                    <p className="text-xl rounded-sm px-2 py-1 bg-black font-bold text-primary-600">
                      {slides[currentIndex]?.["discount_rate"]}
                    </p>
                    <p className="">
                      {slides[currentIndex]?.["start_date"]}{" "}
                      <span className="ml-2">
                        - {slides[currentIndex]?.["end_date"]}
                      </span>
                    </p>
                    <Link
                      className="rounded-sm p-3 bg-white text-black hover:bg-black hover:text-white hover:shadow-lg  shadow-white"
                      href={`/products}`}
                    >
                      Shope Now
                    </Link>
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full w-full ">
                <Button
                  className="p-8 text-2xl hover:bg-primary-800 hover:shadow-2xl"
                  variant="link"
                  size="lg"
                >
                  <Link className="uppercase text-white" href={`/products`}>
                    shop
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
