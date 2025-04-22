"use client";
import React, { useState, useEffect } from "react";
import Container from "../../custom/Container";
import Link from "next/link";
import Image from "next/image";
import { Search, User, LogOut, LayoutDashboard, ShoppingBag, UserCircle, KeyRound, Menu, Bell, X } from "lucide-react";
import { HiOutlineHeart, HiOutlineShoppingBag } from "react-icons/hi";
import AuthService from "@/components/service/AuthService";
import AuthModals from "../auth/AuthModals";
import CartService, { Cart } from "@/components/service/CartService";
import { useWishlist } from "@/contexts/WishlistContext";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { SettingAPi, GeneralSetting } from "@/components/service/SettingService";
import ProfileService from "@/components/service/ProfileService";
import MobileDrawer from "./MobileDrawer";

interface MediaItem {
  id: number;
  model_type: string;
  model_id: number;
  collection_name: string;
  type: string;
  file_path: string;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  image?: string;
  media?: MediaItem[];
}

interface WishlistData {
  items: Array<{
    id: number;
    product: {
      id: number;
      name: string;
    };
  }>;
}

interface AuthModalsProps {
  initialModal: "login" | "register" | "forgotPassword" | "emailVerification";
  onClose: () => void;
  isOpen: boolean;
  onLoginSuccess: (userData: UserData) => void;
}

export default function Main() {
  // UI state
  const [searchFocused, setSearchFocused] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showAuthModals, setShowAuthModals] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [initialModal, setInitialModal] = useState<"login" | "register" | "forgotPassword" | "emailVerification">("login");
  const [generalSettings, setGeneralSettings] = useState<GeneralSetting | null>(null);
  const [logoLoading, setLogoLoading] = useState(true);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileUserMenu, setShowMobileUserMenu] = useState(false);
  
  // Navigation
  const router = useRouter();
  
  // Context hooks with proper typing
  const { user, setUser } = useUser() as { user: UserData | null; setUser: (user: UserData | null) => void };
  const { cart } = useCart() as { cart: Cart | null };
  const { wishlist } = useWishlist() as { wishlist: WishlistData | null };
  
  // Calculate cart total items with proper type checking
  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  
  // Update cart and wishlist counts when data changes
  useEffect(() => {
    setCartItemCount(cart?.items?.length || 0);
  }, [cart]);
  
  useEffect(() => {
    setWishlistCount(wishlist?.items?.length || 0);
  }, [wishlist]);

  // Add click outside handler for both mobile and desktop menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check for mobile menu
      const mobileMenu = document.querySelector('.mobile-user-menu');
      const mobileButton = document.querySelector('.mobile-user-button');
      
      // Check for desktop menu
      const desktopMenu = document.querySelector('.desktop-user-menu');
      const desktopButton = document.querySelector('.desktop-user-button');
      
      // Handle mobile menu
      if (mobileMenu && mobileButton && 
          !mobileMenu.contains(target) && 
          !mobileButton.contains(target)) {
        setShowMobileUserMenu(false);
      }
      
      // Handle desktop menu
      if (desktopMenu && desktopButton && 
          !desktopMenu.contains(target) && 
          !desktopButton.contains(target)) {
        setShowUserMenu(false);
      }
    };

    if (showMobileUserMenu || showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileUserMenu, showUserMenu]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const userData = AuthService.getUser();
        if (userData) {
          // If user has media, set the profile image
          if (userData.media && userData.media.length > 0) {
            const profileMedia = userData.media.find((m: { collection_name: string; file_path: string }) => m.collection_name === 'profile');
            if (profileMedia) {
              userData.image = `${process.env.NEXT_PUBLIC_API_URL}/storage/${profileMedia.file_path}`;
            }
          }
          setUser(userData as UserData);
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    initializeData();
  }, [setUser]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await ProfileService.getProfile();
        setUser(userData);
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const fetchGeneralSettings = async () => {
      try {
        setLogoLoading(true);
        const settings = await SettingAPi.getGeneralSetting();
        setGeneralSettings(settings);
      } catch (error) {
        console.error("Error fetching general settings:", error);
        setLogoError("Failed to load logo");
      } finally {
        setLogoLoading(false);
      }
    };

    fetchGeneralSettings();
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      setUser(null);
      router.push("/");
      setShowUserMenu(false);
      setShowMobileUserMenu(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleAuthClick = (modalType: "login" | "register" | "forgotPassword" | "emailVerification") => {
    setInitialModal(modalType);
    setShowAuthModals(true);
  };

  const handleLoginSuccess = (userData: UserData) => {
    setUser(userData);
    setShowAuthModals(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center w-full max-w-[200px]">
            {logoLoading ? (
              <div className="h-14 w-full bg-gray-200 animate-pulse rounded" />
            ) : logoError ? (
              <span className="text-lg font-bold text-gray-800">Logo</span>
            ) : generalSettings?.logo ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${generalSettings.logo.file_path}`}
                alt={generalSettings.title || "Logo"}
                width={200}
                height={80}
                className="h-14 w-full object-contain"
                priority
              />
            ) : (
              <span className="text-lg font-bold text-gray-800">Logo</span>
            )}
          </Link>

          {/* Search Bar - Hidden on Mobile */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="flex w-full">
              <input
                type="text"
                placeholder="Search product"
                className="w-full h-10 px-4 rounded-l-md border-2 border-gray-200 focus:border-[#0A54A8] focus:ring-1 focus:ring-[#0A54A8] transition-all duration-200"
              />
              <button className="px-5 bg-[#0A54A8] text-white rounded-r-md hover:bg-[#0A54A8] transition-colors duration-200">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Search Button and User Profile */}
          <div className="lg:hidden flex items-center">
            {/* Mobile Search Button */}
            <button 
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Search className="w-6 h-6 text-gray-700" />
            </button>

            {/* User Profile/Login Icon - Mobile Only */}
            <div className="ml-2 relative">
              {user ? (
                <button 
                  onClick={() => setShowMobileUserMenu(!showMobileUserMenu)}
                  className="p-2 hover:bg-gray-100 rounded-lg focus:outline-none mobile-user-button"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-200">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                </button>
              ) : (
                <button 
                  onClick={() => handleAuthClick("login")}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-200">
                    <LogOut className="w-5 h-5 text-gray-500" />
                  </div>
                </button>
              )}

              {/* Mobile User Dropdown */}
              {showMobileUserMenu && user && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 mobile-user-menu">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">{user.name || "User"}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link 
                      href="/account/dashboard" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowMobileUserMenu(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                    <Link 
                      href="/wishlist" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowMobileUserMenu(false)}
                    >
                      <HiOutlineHeart className="w-4 h-4 mr-2" />
                      Wishlist
                    </Link>
                    <Link 
                      href="profile" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowMobileUserMenu(false)}
                    >
                      <UserCircle className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <Link 
                      href="password-change" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowMobileUserMenu(false)}
                    >
                      <KeyRound className="w-4 h-4 mr-2" />
                      Change Password
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setShowMobileUserMenu(false);
                      }} 
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Navigation - Hidden on Mobile */}
          <div className="hidden lg:flex items-center space-x-5">
            {/* Notifications */}
            <button className="relative p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                2
              </span>
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative">
              <div className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200">
                <HiOutlineHeart className="w-5 h-5 text-gray-700" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative">
              <div className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200">
                <HiOutlineShoppingBag className="w-5 h-5 text-gray-700" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </Link>

            {/* User Menu - Desktop */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 focus:outline-none group desktop-user-button"
                >
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                    {user.name || "User"}
                  </span>
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-transparent group-hover:border-blue-600 transition-colors duration-200"
                    />
                  ) : user.media && user.media.length > 0 ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${user.media[0].file_path}`}
                      alt={user.name || "User"}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-transparent group-hover:border-blue-600 transition-colors duration-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-transparent group-hover:border-blue-600 transition-colors duration-200">
                      <User className="w-6 h-6 text-gray-500 group-hover:text-blue-600 transition-colors duration-200" />
                    </div>
                  )}
                </button>

                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 desktop-user-menu">
                    <div className="py-2">
                      <Link 
                        href="/account/dashboard" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                      <Link 
                        href="/wishlist" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <HiOutlineHeart className="w-4 h-4 mr-2" />
                        Wishlist
                      </Link>
                      <Link 
                        href="profile" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <UserCircle className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      <Link 
                        href="password-change" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <KeyRound className="w-4 h-4 mr-2" />
                        Change Password
                      </Link>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setShowUserMenu(false);
                        }} 
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleAuthClick("login")}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                <User className="w-5 h-5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile Search Field - Below Nav */}
      {showMobileSearch && (
        <div className="lg:hidden w-full bg-white border-t border-gray-200 py-3 px-4 shadow-sm">
          <div className="flex items-center">
            <div className="flex w-full">
              <input
                type="text"
                placeholder="Search product"
                className="w-full h-10 px-4 rounded-l-md border border-gray-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all duration-200"
                autoFocus
              />
              <button className="px-5 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors duration-200">
                <Search className="w-4 h-4" />
              </button>
            </div>
            <button 
              onClick={() => setShowMobileSearch(false)}
              className="ml-2 p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      )}

      {/* Auth Modals */}
      {showAuthModals && (
        <AuthModals
          initialModal={initialModal}
          onClose={() => setShowAuthModals(false)}
          isOpen={showAuthModals}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </header>
  );
}
