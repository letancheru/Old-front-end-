"use client";
import React from "react";
import Container from "../../custom/Container";
import HomeSlide from "./HomeSlide";

const Banner = () => {
  return (
    <section className="py-4 w-full bg-white relative mb-1.5">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50" />
      
      <Container className="relative px-2">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
          <div className="flex w-full grid-herod gap-8">
            {/* <CategoryList className="hidden rounded-sm lg:flex ml-1 grid-area-categories w-[360px]" /> */}
            <HomeSlide className="w-full" />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Banner;
