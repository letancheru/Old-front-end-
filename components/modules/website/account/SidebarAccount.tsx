"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  User,
  MapPin,
  TicketCheck,
  KeyRound,
  FileText,
  Shield,
  LogOut,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import AuthService from '@/components/service/AuthService';
import ProfileService from '@/components/service/ProfileService';

export default function SidebarAccount() {
  const pathname = usePathname();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const userData = await ProfileService.getProfile();
        setProfileData(userData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        // Fallback to AuthService if ProfileService fails
        const authUser = AuthService.getUser();
        if (authUser) {
          setProfileData(authUser);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/account/dashboard', icon: LayoutDashboard },
    { 
      name: 'Order History', 
      href: '/account/order', 
      icon: ShoppingBag,
      submenu: [
        { name: 'All Orders', href: '/account/order' },
        { name: 'Pending', href: '/account/order?status=pending' },
        { name: 'Processing', href: '/account/order?status=processing' },
        { name: 'Completed', href: '/account/order?status=completed' },
        { name: 'Refund', href: '/account/order?status=refund' },
      ]
    },
    { name: 'Wishlist', href: '/account/wishlist', icon: Heart },
    { name: 'My Profile', href: '/account/profile', icon: User },
    { name: 'Change Password', href: '/account/passord-change', icon: KeyRound },
    { name: 'Terms & Conditions', href: '/account/term', icon: FileText },
    { name: 'Privacy Policy', href: '/account/privacy', icon: Shield },
    { name: 'Return Policy', href: '/account/return', icon: FileText },
  ];

  const handleLogout = () => {
    AuthService.logout();
    window.location.href = '/';
  };

  // Get user avatar URL
  const getUserAvatarUrl = () => {
    if (profileData?.media && profileData.media.length > 0) {
      const profileMedia = profileData.media.find((m: any) => m.collection_name === 'profile');
      if (profileMedia?.file_path) {
        return profileMedia.file_path.startsWith('blob:') 
          ? profileMedia.file_path 
          : `${process.env.NEXT_PUBLIC_API_URL}/storage/${profileMedia.file_path}`;
      }
    }
    return "https://cdn-icons-png.flaticon.com/128/236/236831.png";
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (profileData) {
      if (profileData.first_name && profileData.last_name) {
        return `${profileData.first_name} ${profileData.last_name}`;
      } else if (profileData.name) {
        return profileData.name;
      }
    }
    return "User";
  };

  const SidebarContent = () => (
    <>
      {/* User Profile Section */}
      <div className="p-8 text-center border-b border-gray-100">
        <div className="relative mx-auto mb-6">
          <div className="w-28 h-28 mx-auto rounded-2xl border-4 border-white ring-2 ring-gray-100 overflow-hidden shadow-md transform transition-transform duration-300 hover:scale-105">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Image
                src={getUserAvatarUrl()}
                alt={getUserDisplayName()}
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-1">
          {isLoading ? (
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mx-auto"></div>
          ) : (
            getUserDisplayName()
          )}
        </h3>
        <p className="text-sm text-gray-500 bg-gray-50 py-1 px-3 rounded-full inline-block">
          {isLoading ? (
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mx-auto"></div>
          ) : (
            profileData?.phone || profileData?.email || "No contact info"
          )}
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.submenu && item.submenu.some(sub => pathname === sub.href));
            
            return (
              <li key={item.name}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => setIsOrderMenuOpen(!isOrderMenuOpen)}
                      className={cn(
                        "flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                        isActive
                          ? "bg-gradient-to-r from-pink-50 to-pink-100/50 text-[#F1356D]"
                          : "text-gray-600 hover:bg-gray-50/80 hover:text-gray-900"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={cn(
                          "w-5 h-5 transition-all duration-200",
                          isActive ? "text-[#F1356D]" : "text-gray-400 group-hover:text-[#F1356D]"
                        )} />
                        <span className="hidden md:inline">{item.name}</span>
                      </div>
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform duration-200 hidden md:block",
                        isOrderMenuOpen ? "rotate-180" : ""
                      )} />
                    </button>
                    {isOrderMenuOpen && (
                      <ul className="mt-2 ml-4 space-y-1">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              href={subItem.href}
                              className={cn(
                                "flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200",
                                pathname === subItem.href
                                  ? "text-[#F1356D] bg-pink-50/50"
                                  : "text-gray-600 hover:text-[#F1356D] hover:bg-gray-50/50"
                              )}
                            >
                              <span className="hidden md:inline">{subItem.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                      isActive
                        ? "bg-gradient-to-r from-pink-50 to-pink-100/50 text-[#F1356D] shadow-sm"
                        : "text-gray-600 hover:bg-gray-50/80 hover:text-gray-900"
                    )}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 transition-all duration-200 relative z-10",
                      isActive ? "text-[#F1356D]" : "text-gray-400 group-hover:text-[#F1356D] group-hover:scale-110"
                    )} />
                    <span className="relative z-10 hidden md:inline">{item.name}</span>
                    {isActive && (
                      <div className="absolute inset-y-0 left-0 w-1 bg-[#F1356D] rounded-r-full" />
                    )}
                  </Link>
                )}
              </li>
            );
          })}

          {/* Logout Button */}
          <li className="pt-4 mt-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:-translate-x-1" />
              <span className="group-hover:translate-x-1 transition-transform duration-200 hidden md:inline">
                Log Out
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Drawer Toggle Button */}
      <button
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg md:hidden"
      >
        {isDrawerOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Mobile Drawer */}
      <div className={cn(
        "fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden",
        isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className={cn(
          "fixed inset-y-0 left-0 w-64 bg-white transform transition-transform duration-300",
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <SidebarContent />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-full max-w-[280px] bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
        <SidebarContent />
      </aside>
    </>
  );
}
