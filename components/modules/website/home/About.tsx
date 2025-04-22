'use client';
import React, { useEffect, useState } from 'react';
import { aboutUsService } from '@/components/service/AboutUsService';
import Image from 'next/image';
import { LazyMotion, domAnimation, m } from 'framer-motion';

interface AboutUsData {
  id: number;
  title: string;
  slug: string;
  description: string;
  details: string;
  mission: string;
  vision: string;
  core_value: string;
  banner: {
    id: number;
    file_path: string;
  };
  gallery: {
    id: number;
    gallery: string;
  };
}

const About = () => {
  const [aboutData, setAboutData] = useState<AboutUsData | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const data = await aboutUsService.getAboutUs();
        const aboutInfo = Array.isArray(data) ? data[0] : data;
        setAboutData(aboutInfo);

        // Handle gallery images parsing
        if (aboutInfo?.gallery?.gallery) {
          try {
            const parsedGallery = JSON.parse(aboutInfo.gallery.gallery);
            setGalleryImages(Array.isArray(parsedGallery) ? parsedGallery : []);
          } catch (error) {
            console.error('Error parsing gallery JSON:', error);
            setGalleryImages([]);
          }
        }
      } catch (error) {
        console.error('Error fetching about us data:', error);
      }
    };

    fetchAboutData();
  }, []);

  if (!aboutData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-purple-900/40 z-10" />
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${aboutData.banner.file_path}`}
          alt="About Us Hero"
          fill
          className="object-cover brightness-90 transform scale-105 animate-slow-zoom"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center text-white max-w-6xl px-4"
          >
            <m.h1 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-100"
            >
              {aboutData.title}
            </m.h1>
            <div className="w-40 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto mb-8 rounded-full"></div>
            <m.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg md:text-xl leading-relaxed font-light max-w-3xl mx-auto"
              dangerouslySetInnerHTML={{ __html: aboutData.description }}
            />
          </m.div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 items-stretch"
          >
            <m.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col space-y-8"
            >
              <div className="relative">
                <m.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-4xl font-bold text-gray-900 mb-6 relative z-10"
                >
                  Our Story
                  <div className="absolute -bottom-2 left-0 w-32 h-3 bg-blue-200 -z-10 transform -skew-x-3"></div>
                </m.h2>
                <div 
                  className="text-base text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: aboutData.details }}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 flex-grow">
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="group h-full"
                >
                  <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-300 relative overflow-hidden h-full flex flex-col transform hover:-translate-y-1">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">Our Mission</h3>
                    <p className="text-base text-gray-600 leading-relaxed flex-grow">
                      {aboutData.mission}
                    </p>
                  </div>
                </m.div>
                
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="group h-full"
                >
                  <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100 hover:border-purple-300 relative overflow-hidden h-full flex flex-col transform hover:-translate-y-1">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">Our Vision</h3>
                    <p className="text-base text-gray-600 leading-relaxed flex-grow">
                      {aboutData.vision}
                    </p>
                  </div>
                </m.div>
              </div>
            </m.div>

            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-full flex items-stretch"
            >
              <div className="relative w-full rounded-2xl overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform duration-500 group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 group-hover:opacity-75 transition-opacity duration-500"></div>
                <Image
                  src={galleryImages[0] ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${galleryImages[0]}` : `${process.env.NEXT_PUBLIC_API_URL}/storage/${aboutData.banner.file_path}`}
                  alt="Our Story"
                  fill
                  className="object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[2s]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `${process.env.NEXT_PUBLIC_API_URL}/storage/${aboutData.banner.file_path}`;
                  }}
                />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 rounded-full opacity-50 blur-2xl"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-100 rounded-full opacity-50 blur-2xl"></div>
              </div>
            </m.div>
          </m.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-blue-100 rounded-full opacity-20 blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-purple-100 rounded-full opacity-20 blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Core Values</h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {aboutData.core_value}
            </p>
          </m.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation",
                description: "Pushing boundaries and embracing new technologies to enhance your shopping experience.",
                icon: "💡",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                title: "Customer First",
                description: "Your satisfaction is our top priority. We're here to serve and delight you.",
                icon: "👥",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                title: "Excellence",
                description: "Committed to delivering the highest quality products and exceptional service.",
                icon: "⭐",
                gradient: "from-orange-500 to-yellow-500"
              }
            ].map((value, index) => (
              <m.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group h-full"
              >
                <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 relative overflow-hidden h-full flex flex-col transform hover:-translate-y-1">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${value.gradient}`}></div>
                  <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{value.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">{value.title}</h3>
                  <p className="text-base text-gray-600 leading-relaxed flex-grow">{value.description}</p>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>
    </LazyMotion>
  );
};

export default About;

// Add this to your global CSS file
const styles = `
@keyframes slow-zoom {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
}

.animate-slow-zoom {
  animation: slow-zoom 20s ease-in-out infinite alternate;
}
`; 