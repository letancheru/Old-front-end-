"use client";
import React, { useState, useEffect } from "react";
import Container from "../../custom/Container";
import Link from "next/link";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { IoHomeOutline, IoGridOutline, IoStorefrontOutline, IoInformationCircleOutline } from "react-icons/io5";
import { RiFileListLine, RiCustomerService2Line } from "react-icons/ri";
import { LuNewspaper } from "react-icons/lu";
import CategoryService from "@/components/service/CategoryService";
import { BrandService } from "@/components/service/BrandService";
import { Category } from "@/types";

// Define Brand type
interface Brand {
  id: string;
  name: string;
  // Add other brand properties as needed
}

const menuItems = [
  { name: "Home", icon: IoHomeOutline, href: "/" },
  { name: "Products", icon: IoGridOutline, href: "/products" },
  { name: "Shops", icon: IoStorefrontOutline, href: "/shops" },
  { name: "Most Popular", icon: RiFileListLine, href: "/popular-products" },
  { name: "Most Rated", icon: RiFileListLine, href: "/most-rated-product" },
  { name: "About Us", icon: RiFileListLine, href: "/about-us" },
  { name: "Blogs", icon: LuNewspaper, href: "/blogs" }
];

export default function Menus() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(false);
  const [hoveredBrand, setHoveredBrand] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [brandLoading, setBrandLoading] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      try {
        const categoriesData = await CategoryService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    const getBrands = async () => {
      setBrandLoading(true);
      try {
        const brandsData = await BrandService.getBrands();
        setBrands(brandsData);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setBrandLoading(false);
      }
    };
    getBrands();
  }, []);

  const handleCategorySelect = (category: Category) => {
    localStorage.setItem('selectedCategory', JSON.stringify(category));
    // Optionally refresh the page or update state if needed
    window.dispatchEvent(new Event('categorySelected'));
  };

  const handleBrandSelect = (brand: Brand) => {
    localStorage.setItem('selectedBrand', JSON.stringify(brand));
    // Optionally refresh the page or update state if needed
    window.dispatchEvent(new Event('brandSelected'));
  };

  return (
    <div className="w-full">
      {/* Desktop Menu */}
      <div className="bg-white border-b hidden lg:block">
        <Container>
          <div className="flex items-center h-12">
            {/* Categories Button */}
            <div className="relative">
              <button 
                className="flex items-center gap-2 px-4 h-full hover:text-[#1B4486] transition-colors duration-200"
                onMouseEnter={() => setHoveredCategory(true)}
                onMouseLeave={() => setHoveredCategory(false)}
              >
                <HiOutlineSquares2X2 className="w-5 h-5" />
                <span className="text-[15px] font-medium font-poppins">Categories</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${hoveredCategory ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Categories Dropdown */}
              {hoveredCategory && (
                <div 
                  className="absolute top-full left-0 w-64 bg-white border rounded-lg shadow-lg py-2 z-50"
                  onMouseEnter={() => setHoveredCategory(true)}
                  onMouseLeave={() => setHoveredCategory(false)}
                >
                  {loading ? (
                    <div className="px-4 py-2">
                      <div className="animate-pulse space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-6 bg-gray-200 rounded" />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          localStorage.removeItem('selectedCategory');
                          window.dispatchEvent(new Event('categorySelected'));
                          setHoveredCategory(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#1B4486]"
                      >
                        <span className="text-[15px] font-poppins">All Categories</span>
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            handleCategorySelect(category);
                            setHoveredCategory(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#1B4486]"
                        >
                          <span className="text-[15px] font-poppins">{category.name}</span>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Brands Button */}
            <div className="relative">
              <button 
                className="flex items-center gap-2 px-4 h-full hover:text-[#1B4486] transition-colors duration-200"
                onMouseEnter={() => setHoveredBrand(true)}
                onMouseLeave={() => setHoveredBrand(false)}
              >
                <IoStorefrontOutline className="w-5 h-5" />
                <span className="text-[15px] font-medium font-poppins">Brands</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${hoveredBrand ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Brands Dropdown */}
              {hoveredBrand && (
                <div 
                  className="absolute top-full left-0 w-64 bg-white border rounded-lg shadow-lg py-2 z-50"
                  onMouseEnter={() => setHoveredBrand(true)}
                  onMouseLeave={() => setHoveredBrand(false)}
                >
                  {brandLoading ? (
                    <div className="px-4 py-2">
                      <div className="animate-pulse space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-6 bg-gray-200 rounded" />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          localStorage.removeItem('selectedBrand');
                          window.dispatchEvent(new Event('brandSelected'));
                          setHoveredBrand(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#1B4486]"
                      >
                        <span className="text-[15px] font-poppins">All Brands</span>
                      </button>
                      {brands.map((brand) => (
                        <button
                          key={brand.id}
                          onClick={() => {
                            handleBrandSelect(brand);
                            setHoveredBrand(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#1B4486]"
                        >
                          <span className="text-[15px] font-poppins">{brand.name}</span>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Add a spacer div for the gap */}
            <div className="w-16"></div>

            {/* Navigation Links */}
            <nav className="flex items-center">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = false; // You can implement active state logic here
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 h-full flex items-center text-[15px] font-medium font-poppins ${
                      isActive 
                        ? 'text-[#1B4486]' 
                        : 'text-gray-600 hover:text-[#1B4486]'
                    } transition-colors duration-200`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Contact Us */}
            <Link 
              href="/contact" 
              className="ml-auto px-4 h-full flex items-center text-[15px] font-medium font-poppins text-gray-600 hover:text-[#1B4486] transition-colors duration-200"
            >
              <RiCustomerService2Line className="w-5 h-5 mr-2" />
              <span>Contact us</span>
            </Link>
          </div>
        </Container>
      </div>

      {/* Mobile Menu - Hidden on desktop */}
      <div className="lg:hidden">
        <div className={`fixed top-0 left-0 h-full w-[280px] bg-white shadow-xl transform transition-transform z-[60] ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4">
            <div className="flex flex-col">
              {/* Categories Section in Mobile */}
              <div className="mb-4">
                <button className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg w-full">
                  <HiOutlineSquares2X2 className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Categories</span>
                </button>
                <div className="mt-2 pl-2">
                  {loading ? (
                    <div className="animate-pulse space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-6 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          localStorage.removeItem('selectedCategory');
                          window.dispatchEvent(new Event('categorySelected'));
                          setIsDrawerOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                      >
                        <span className="text-sm font-medium">All Categories</span>
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            handleCategorySelect(category);
                            setIsDrawerOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                          <span className="text-sm font-medium">{category.name}</span>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>
              
              {/* Brands Section in Mobile */}
              <div className="mb-4">
                <button className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg w-full">
                  <IoStorefrontOutline className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Brands</span>
                </button>
                <div className="mt-2 pl-2">
                  {brandLoading ? (
                    <div className="animate-pulse space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-6 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          localStorage.removeItem('selectedBrand');
                          window.dispatchEvent(new Event('brandSelected'));
                          setIsDrawerOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                      >
                        <span className="text-sm font-medium">All Brands</span>
                      </button>
                      {brands.map((brand) => (
                        <button
                          key={brand.id}
                          onClick={() => {
                            handleBrandSelect(brand);
                            setIsDrawerOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                          <span className="text-sm font-medium">{brand.name}</span>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>
              
              {/* Mobile Menu Items */}
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = false; // You can implement active state logic here
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Overlay */}
        {isDrawerOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[55]"
            onClick={() => setIsDrawerOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
