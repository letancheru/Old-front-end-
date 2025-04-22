'use client'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const Cta1 = () => {
  return (
    <LazyMotion features={domAnimation}>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left CTA Card */}
          <m.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#E5F8FF] to-[#F0FBFF]"
          >
            {/* Abstract Shapes */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-300 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-300 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative flex flex-col md:flex-row items-center p-8 md:p-12">
              <div className="flex-1 z-10 text-left">
                <m.span 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4"
                >
                  NEW STYLE
                </m.span>
                <m.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6"
                >
                  Get 65% Offer &<br />
                  Make New<br />
                  Fusion.
                </m.h2>
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link 
                    href="/shop"
                    className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-full
                             hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span className="text-white drop-shadow-sm">Shop Now</span>
                    <svg 
                      className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7" 
                      />
                    </svg>
                  </Link>
                </m.div>
              </div>
              <m.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-1 relative mt-8 md:mt-0"
              >
                <div className="relative w-full h-[400px]">
                  <Image
                    src="/assets/images/A.jpg"
                    alt="Fashion Collection"
                    fill
                    className="object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </m.div>
            </div>
          </m.div>

          {/* Right CTA Card */}
          <m.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFE5F4] to-[#FFF0F8]"
          >
            {/* Abstract Shapes */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-300 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative flex flex-col md:flex-row items-center p-8 md:p-12">
              <div className="flex-1 z-10 text-left">
                <m.span 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-block px-4 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium mb-4"
                >
                  MEGA OFFER
                </m.span>
                <m.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6"
                >
                  Make your New<br />
                  Styles with Our<br />
                  Products
                </m.h2>
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link 
                    href="/shop"
                    className="inline-flex items-center px-8 py-3 bg-pink-600 text-white font-semibold rounded-full
                             hover:bg-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span className="text-white drop-shadow-sm">Shop Now</span>
                    <svg 
                      className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7" 
                      />
                    </svg>
                  </Link>
                </m.div>
              </div>
              <m.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex-1 relative mt-8 md:mt-0"
              >
                <div className="relative w-full h-[400px]">
                  <Image
                    src="/assets/images/R.png"
                    alt="Fashion Collection"
                    fill
                    className="object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </m.div>
            </div>
          </m.div>
        </div>
      </div>
    </LazyMotion>
  )
}

export default Cta1
