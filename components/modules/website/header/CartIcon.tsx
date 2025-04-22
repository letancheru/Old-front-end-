'use client';

import { useCart } from '@/contexts/CartContext';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function CartIcon() {
  const { cartCount, isLoading } = useCart();

  return (
    <Link href="/cart" className="relative inline-flex items-center">
      <ShoppingBag className="w-6 h-6 text-gray-700 hover:text-primary-600 transition-colors" />
      {!isLoading && cartCount > 0 && (
        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary-600 flex items-center justify-center">
          <span className="text-[11px] font-medium text-white">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        </span>
      )}
    </Link>
  );
} 