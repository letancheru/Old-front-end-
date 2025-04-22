"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '@/components/service/AuthService';

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className = '' }: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = () => {
    AuthService.logout();
    router.push('/');
  };

  return (
    <button
      onClick={handleLogout}
      className={`bg-[#F1356D] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#d82f61] transition-colors duration-200 ${className}`}
    >
      Logout
    </button>
  );
} 