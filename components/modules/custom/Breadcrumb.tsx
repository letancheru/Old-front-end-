import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  items: {
    label: string;
    href?: string;
  }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="relative bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-4">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-100 dark:bg-primary-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-100 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-sm">
          <Link 
            href="/" 
            className="flex items-center text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500 transition-colors"
          >
            <Home className="w-4 h-4" />
          </Link>
          
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500 transition-colors capitalize"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 dark:text-white font-medium capitalize">
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
    </div>
  );
} 