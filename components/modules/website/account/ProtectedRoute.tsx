"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, redirectIfNotAuthenticated, getRedirectPath } from '@/components/utils/authUtils';
import Loading from '../../custom/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (isAuthenticated()) {
      setIsAuthorized(true);
    } else {
      // Redirect to login if not authenticated
      redirectIfNotAuthenticated(pathname);
    }
    
    setIsLoading(false);
  }, [pathname]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading isLoading={true} />
      </div>
    );
  }

  // If not authorized, don't render children
  if (!isAuthorized) {
    return null;
  }

  // If authorized, render children
  return <>{children}</>;
} 