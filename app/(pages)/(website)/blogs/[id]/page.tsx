'use client';

import { useEffect, useState } from 'react';
import { Blog, blogService } from '@/components/service/BlogService';
import Image from 'next/image';
import { format } from 'date-fns';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import Link from 'next/link';
import { FiCalendar, FiArrowLeft, FiImage, FiShare2, FiClock } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [canShare, setCanShare] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await blogService.getBlogById(parseInt(params.id));
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.description.replace(/<[^>]*>/g, '').slice(0, 100) + '...',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">
            {error || 'Blog post not found'}
          </h1>
          <p className="text-gray-600 mb-6">
            {error ? 'An error occurred while loading the blog post.' : "The blog post you're looking for does not exist."}
          </p>
          <Link 
            href="/blogs"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors duration-200"
          >
            <FiArrowLeft className="mr-2" />
            Return to Blogs
          </Link>
        </div>
      </div>
    );
  }

  // Parse gallery images with error handling
  let galleryImages: string[] = [];
  if (blog.gallery?.gallery) {
    try {
      console.log("Gallery data:", blog.gallery.gallery);
      // Check if the gallery string is already a valid JSON array
      if (blog.gallery.gallery.startsWith('[') && blog.gallery.gallery.endsWith(']')) {
        galleryImages = JSON.parse(blog.gallery.gallery);
      } else {
        // If it's not a JSON array, it might be a comma-separated string of paths
        galleryImages = blog.gallery.gallery.split(',').map(path => path.trim());
      }
      console.log("Parsed gallery images:", galleryImages);
    } catch (error) {
      console.error('Error parsing gallery data:', error);
      // If parsing fails, try to handle it as a single image path
      if (blog.gallery.gallery) {
        galleryImages = [blog.gallery.gallery];
      }
    }
  }
  
  const readingTime = Math.ceil((blog.description + blog.details).replace(/<[^>]*>/g, '').split(' ').length / 200);

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${blog.banner.file_path}`}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
              <m.h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {blog.title}
              </m.h1>
              <m.div 
                className="flex flex-wrap items-center justify-center gap-4 text-sm md:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center">
                  <FiCalendar className="mr-2" />
                  {format(new Date(blog.created_at), 'MMMM dd, yyyy')}
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-2" />
                  {readingTime} min read
                </div>
                {canShare && (
                  <button 
                    onClick={handleShare}
                    className="flex items-center hover:text-primary transition-colors duration-200"
                  >
                    <FiShare2 className="mr-2" />
                    Share
                  </button>
                )}
              </m.div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Navigation */}
          <m.div 
            className="mb-12"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/blogs"
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors duration-200"
            >
              <FiArrowLeft className="mr-2" />
              Back to Blogs
            </Link>
          </m.div>
          
          {/* Content */}
          <m.article
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-6 md:p-8 lg:p-10">
              {/* Description Section */}
              <div className="max-w-4xl mx-auto">
                <div className="prose prose-lg md:prose-xl max-w-none">
                  <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 shadow-sm">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      Overview
                    </h2>
                    <div 
                      className="text-gray-700"
                      dangerouslySetInnerHTML={{ __html: blog.description }}
                    />
                  </div>
                </div>

                {/* Details Section */}
                {blog.details && (
                  <div className="mt-12 pt-12 border-t border-gray-100">
                    <div className="prose prose-lg md:prose-xl max-w-none">
                      <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 shadow-sm">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                          Detailed Information
                        </h2>
                        <div 
                          className="text-gray-700"
                          dangerouslySetInnerHTML={{ __html: blog.details }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Gallery Section */}
                {galleryImages && galleryImages.length > 0 && (
                  <div className="mt-16 pt-12 border-t border-gray-100">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
                      <FiImage className="mr-3 text-primary" />
                      Photo Gallery
                    </h2>
                    <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 shadow-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {galleryImages.map((image: string, index: number) => (
                          <m.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group shadow-md"
                            onClick={() => setSelectedImage(image)}
                          >
                            <Image
                              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${image}`}
                              alt={`${blog.title} gallery image ${index + 1}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                              <span className="text-sm font-medium">View Image {index + 1}</span>
                            </div>
                          </m.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </m.article>
        </div>

        {/* Image Lightbox */}
        {selectedImage && (
          <m.div 
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 cursor-pointer backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-6xl h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${selectedImage}`}
                alt="Gallery image"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
              <button
                className="absolute top-4 right-4 text-white hover:text-primary transition-colors duration-200 bg-black/50 rounded-full p-2"
                onClick={() => setSelectedImage(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </m.div>
          </m.div>
        )}
      </div>
    </LazyMotion>
  );
} 