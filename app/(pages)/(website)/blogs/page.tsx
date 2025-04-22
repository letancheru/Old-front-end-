'use client';
import { useEffect, useState } from 'react';
import { Blog, blogService } from '@/components/service/BlogService';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { FiCalendar } from 'react-icons/fi';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogService.getBlogs();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Blog</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our latest news, insights, and updates
            </p>
          </m.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <Link 
                key={blog.id}
                href={`/blogs/${blog.id}`}
                className="block group"
              >
                <m.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="h-full bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group-hover:ring-2 ring-primary/20"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${blog.banner.file_path}`}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <FiCalendar className="mr-2" />
                      {format(new Date(blog.created_at), 'MMMM dd, yyyy')}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                      {blog.title}
                    </h2>
                    <div 
                      className="text-gray-600 line-clamp-3 prose prose-sm"
                      dangerouslySetInnerHTML={{ __html: blog.description }}
                    />
                  </div>
                </m.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
