"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { cn } from "@/lib/utils";
import "./style.css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";
import Container from "../../custom/Container";
import Image from "next/image";
import Link from "next/link";

interface CtaItem {
  title: string;
  description: string;
  image: string;
  link: string;
  delay: number;
}

export default function Cta() {
  const [isVisible, setIsVisible] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const textVariations = [
    "Discover Our Premium Collection",
    "Explore Our Curated Products",
    "Experience Quality & Style"
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Text rotation effect
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % textVariations.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden mt-8">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#263CB6] opacity-20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#DCA704] opacity-10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-r from-[#263CB6] to-[#DCA704] opacity-10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main CTA Banner */}
      <div className="relative bg-gradient-to-r from-[#263CB6] via-[#1e2d8a] to-[#DCA704] p-8 md:p-12 overflow-hidden rounded-xl mx-4 md:mx-8 shadow-2xl">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className={`text-white space-y-3 max-w-xl transition-all duration-1000 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
            <div className="h-24 overflow-hidden relative">
              {textVariations.map((text, i) => (
                <div 
                  key={i} 
                  className={`absolute w-full transition-all duration-500 ease-in-out ${
                    i === textIndex ? 'translate-y-0 opacity-100' : 
                    i < textIndex ? '-translate-y-full opacity-0' : 
                    'translate-y-full opacity-0'
                  }`}
                  style={{ 
                    transitionDelay: `${i * 100}ms`,
                    top: '0',
                    left: '0'
                  }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold leading-snug">{text}</h2>
                </div>
              ))}
            </div>
            <p className="text-lg md:text-xl opacity-90 leading-snug">Experience quality products designed for you</p>
          </div>
          <div 
            className={`mt-6 md:mt-0 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Link 
              href="/products" 
              className={`bg-white text-[#263CB6] px-8 py-3 rounded-md font-semibold transition-all inline-block transform duration-300 shadow-lg ${isHovered ? 'scale-110 -translate-y-1' : 'scale-100 translate-y-0'}`}
            >
              EXPLORE NOW
            </Link>
          </div>
        </div>
        
        {/* Animated Abstract Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-20 h-20 border-2 border-white opacity-20 rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>
          <div className="absolute bottom-1/3 right-1/3 w-16 h-16 border-2 border-white opacity-20 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white opacity-20 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
        </div>
      </div>

      {/* Main CTA Grid */}
      <div className="bg-gradient-to-b from-[#f8f0ea] to-white py-4 relative mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6 container mx-auto">
          {[
            {
              title: "Shop Now",
              description: "Discover our latest products.",
              image: "/assets/images/E-Commerce-Transparent-Images-PNG.png",
              link: "/products",
              delay: 0
            },
            {
              title: "About Us",
              description: "Learn more about our story.",
              image: "/assets/images/E-Commerce-Logo-Transparent-File.png",
              link: "/about",
              delay: 200
            },
            {
              title: "Contact Us",
              description: "Get in touch with us.",
              image: "/assets/images/E-Commerce-PNG-Background-Image.png",
              link: "/contact",
              delay: 400
            }
          ].map((item: CtaItem, index: number) => (
            <div 
              key={index}
              className={`bg-white shadow-lg rounded-xl hover:shadow-xl transition-all duration-500 flex flex-col items-center justify-center p-8 text-center transform hover:scale-105 hover:-translate-y-2 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
              style={{ transitionDelay: `${item.delay}ms` }}
            >
              <div className="relative w-24 h-24 mb-4 group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#263CB6] to-[#DCA704] opacity-0 group-hover:opacity-20 rounded-full blur-md transition-all duration-300"></div>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h2 className="text-xl font-bold mb-2">{item.title}</h2>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <Link
                href={item.link}
                className="bg-[#263CB6] hover:bg-[#1e2d8a] text-white font-bold py-2 px-6 rounded-md transition duration-300 hover:scale-105 transform shadow-md hover:-translate-y-1"
              >
                Visit
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
