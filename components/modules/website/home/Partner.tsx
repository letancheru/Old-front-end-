'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { m } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Partner, partnerService } from '@/components/service/Partner';

const PartnerCard: React.FC<Partner> = ({ name, logo }) => {
  return (
    <div className="px-2 sm:px-3 py-3 sm:py-4">
      <m.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg overflow-hidden transition-all duration-300 border border-gray-200 hover:border-gray-300 w-full max-w-[300px] h-[160px] md:h-[180px] lg:h-[200px] 2xl:h-[220px] shadow-2xl hover:shadow-xl mx-auto"
      >
        <div className="h-full flex flex-col">
          <div className="h-[75%] w-full bg-gray-50 p-3 md:p-4 lg:p-5 flex items-center justify-center">
            <div className="relative h-full w-full">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${logo.file_path}`}
                alt={name}
                fill
                className="object-contain p-2"
                sizes="(max-width: 640px) 160px, 
                       (max-width: 768px) 200px,
                       (max-width: 1024px) 240px,
                       (max-width: 1280px) 260px,
                       (max-width: 1536px) 280px,
                       300px"
                priority
              />
            </div>
          </div>
          <div className="h-[25%] p-2 sm:p-2.5 flex items-center justify-center bg-white">
            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 text-center tracking-tight line-clamp-1">{name}</h3>
          </div>
        </div>
      </m.div>
    </div>
  );
};

const PartnerSkeleton = () => {
  return (
    <div className="px-2 sm:px-3 py-3 sm:py-4">
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200 w-full max-w-[300px] h-[160px] md:h-[180px] lg:h-[200px] 2xl:h-[220px] animate-pulse">
        <div className="h-full flex flex-col">
          <div className="h-[75%] w-full bg-gray-200"></div>
          <div className="h-[25%] flex items-center justify-center">
            <div className="h-4 md:h-5 lg:h-6 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PartnerSection: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await partnerService.getAllPartners();
        if (Array.isArray(data)) {
          setPartners(data);
        } else {
          setPartners([]);
        }
      } catch (err) {
        setError('Failed to fetch partners');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1536, // 2xl
        settings: {
          slidesToShow: 6,
        }
      },
      {
        breakpoint: 1280, // xl
        settings: {
          slidesToShow: 5,
        }
      },
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 768, // md
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded max-w-2xl mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {[...Array(7)].map((_, index) => (
              <PartnerSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  if (!partners.length) {
    return (
      <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
              Our Trusted Partners
            </h2>
            <p className="text-gray-600">No partners available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
            Our Trusted Partners
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed">
            We collaborate with industry leaders to deliver exceptional solutions and drive innovation forward.
          </p>
        </div>
        <div className="relative">
          <div className="client-only">
            <Slider {...sliderSettings}>
              {partners.map((partner, index) => (
                <PartnerCard key={index} {...partner} />
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
