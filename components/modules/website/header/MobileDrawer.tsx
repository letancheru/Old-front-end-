import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Home, ShoppingBag, User, KeyRound, LogOut, BookOpen, Star, Info, 
  Phone, Mail, MapPin, HelpCircle, CreditCard, Package, Heart, ShoppingCart, 
  Settings, FileText, Shield, Gift, Tag, Truck, Clock, ChevronRight } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { User as UserType } from '@/components/service/ProfileService';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const router = useRouter();
  const { user, setUser } = useUser() as { user: UserType | null; setUser: (user: UserType | null) => void };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
    onClose();
  };

  // Main navigation categories
  const mainCategories = [
    { 
      title: 'Shop',
      items: [
        { icon: Home, label: 'Home', href: '/' },
        { icon: ShoppingBag, label: 'All Products', href: '/products' },
        { icon: Tag, label: 'Categories', href: '/categories' },
        { icon: Star, label: 'Popular Products', href: '/popular-products' },
      
      
      ]
    },
    { 
      title: 'Information',
      items: [
        { icon: Info, label: 'About Us', href: '/about' },
        { icon: BookOpen, label: 'Blog', href: '/blog' },
        { icon: HelpCircle, label: 'Help & Support', href: '/support' },
        { icon: FileText, label: 'Terms & Conditions', href: '/terms' },
        { icon: Shield, label: 'Privacy Policy', href: '/privacy' },
       
      ]
    },
    { 
      title: 'Contact',
      items: [
        { icon: Phone, label: 'Call Us', href: 'tel:+1234567890' },
        { icon: Mail, label: 'Email Us', href: 'mailto:support@example.com' },
        { icon: MapPin, label: 'Store Locations', href: '/locations' },
      ]
    }
  ];

  // User account menu items
  const userMenuItems = user ? [
    { icon: User, label: 'My Profile', href: 'profile' },
    { icon: ShoppingCart, label: 'My Orders', href: '/account/orders' },
    { icon: Heart, label: 'My Wishlist', href: '/wishlist' },
    { icon: Package, label: 'My Returns', href: '/account/returns' },
    { icon: KeyRound, label: 'Change Password', href: 'change-password' },
    { icon: Settings, label: 'Account Settings', href: '/account/settings' },
  ] : [];

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* User Profile Section */}
          {user ? (
            <div className="p-4 border-b bg-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user.first_name} {user.last_name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 border-b bg-white">
              <Link href="/signin" className="flex items-center justify-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" onClick={onClose}>
                <LogOut className="w-4 h-4 mr-2" />
                <span>Sign In</span>
              </Link>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto">
            {/* Quick Links */}
            {/* <div className="p-4 border-b">
              <div className="grid grid-cols-4 gap-2">
                <Link href="/" className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={onClose}>
                  <Home className="w-5 h-5 text-gray-700 mb-1" />
                  <span className="text-xs text-gray-700">Home</span>
                </Link>
                <Link href="/products" className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={onClose}>
                  <ShoppingBag className="w-5 h-5 text-gray-700 mb-1" />
                  <span className="text-xs text-gray-700">Products</span>
                </Link>
                <Link href="/wishlist" className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={onClose}>
                  <Heart className="w-5 h-5 text-gray-700 mb-1" />
                  <span className="text-xs text-gray-700">Wishlist</span>
                </Link>
                <Link href="/cart" className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={onClose}>
                  <ShoppingCart className="w-5 h-5 text-gray-700 mb-1" />
                  <span className="text-xs text-gray-700">Cart</span>
                </Link>
              </div>
            </div> */}

            {/* Main Categories */}
            {mainCategories.map((category, index) => (
              <div key={index} className="border-b">
                <div className="px-4 py-2 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-700">{category.title}</h3>
                </div>
                <div className="py-1">
                  {category.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      href={item.href}
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={onClose}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 text-gray-600 mr-3" />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* User Account Menu */}
            {user && (
              <div className="border-b">
                <div className="px-4 py-2 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-700">My Account</h3>
                </div>
                <div className="py-1">
                  {userMenuItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={onClose}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 text-gray-600 mr-3" />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 transition-colors text-red-600"
                  >
                    <div className="flex items-center">
                      <LogOut className="w-5 h-5 mr-3" />
                      <span className="text-sm">Logout</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>© 2023 Your Store</span>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 