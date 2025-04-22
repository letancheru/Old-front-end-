"use client";
import Container from "@/components/modules/custom/Container";
import MainProduct from "@/components/modules/website/products/MainProduct";
import SidebarLeft from "@/components/modules/website/products/SidebarLeft";
import { BrandService } from "@/components/service/BrandService";
import CategoryService from "@/components/service/CategoryService";
import ShopsService from "@/components/service/ShopsService";
import { cn } from "@/lib/utils";
import axios from "axios";
import { ChevronDown, ListFilter, SlidersHorizontal, ChevronRight, Home } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  description: string;
  created_at: string;
  updated_at: string;
  parent: Category | null;
}

interface Brand {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface Thumbnail {
  id: number;
  model_type: string;
  model_id: number;
  collection_name: string;
  type: string;
  file_path: string;
  gallery: null | string;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

interface ProductDetails {
  id: number;
  category_id: number;
  brand_id: number;
  unit_id: number;
  name: string;
  slug: string;
  description: string;
  details: string;
  youtube_link: string | null;
  SKU: string;
  code: string;
  min_deliverable_qty: number;
  max_deliverable_qty: number | null;
  discount_type: string;
  discount: string;
  status: number;
  created_at: string;
  updated_at: string;
  thumbnail: Thumbnail;
  category: Category;
  brand: Brand;
  average_rating?: number;
}

interface Product {
  id: number;
  product_id: number;
  store_id: number;
  name: string;
  price: number;
  quantity: number;
  category: Category;
  brand: Brand;
  thumbnail: Thumbnail;
  discount: string;
  rating: number;
  slug: string;
  product: ProductDetails;
}

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>("featured");

  useEffect(() => {
    const initializePage = async () => {
      setLoading(true);
      try {
        // Get selected store from localStorage
        const storeSlug = localStorage.getItem('selectedStore');
        setSelectedStore(storeSlug);

        // Fetch categories and brands
        const categoriesData = await CategoryService.getCategories();
        const brandsData = await BrandService.getBrands();
        setCategories(categoriesData);
        setBrands(brandsData);

        // Fetch store products
        const stores = await ShopsService.getShops();
        let targetStore;

        if (storeSlug) {
          // Find selected store
          targetStore = stores.find((s: any) => s.slug === storeSlug);
        }
        
        if (!targetStore) {
          // If no store selected or store not found, use main store
          targetStore = stores.find((s: any) => s.slug === 'main-store') || stores[0];
          if (targetStore) {
            localStorage.setItem('selectedStore', targetStore.slug);
            setSelectedStore(targetStore.slug);
          }
        }

        if (targetStore?.product_stores) {
          const mappedProducts = targetStore.product_stores.map((ps: any) => ({
            id: ps.id,
            product_id: ps.product.id,
            store_id: ps.store_id,
            name: ps.product.name,
            price: parseFloat(ps.price),
            category: ps.product.category,
            brand: ps.product.brand,
            thumbnail: ps.product.thumbnail,
            discount: ps.product.discount,
            rating: ps.product.average_rating,
            slug: ps.product.slug,
            quantity: ps.quantity,
            product: ps.product
          }));
          setProducts(mappedProducts);
          setFilteredProducts(mappedProducts);
          
          const highestPrice = Math.max(...mappedProducts.map((p: Product) => p.price));
          setMaxPrice(highestPrice);
          setPriceRange([0, highestPrice]);
        }
      } catch (error) {
        console.error("Error initializing product page:", error);
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.product.category_id === parseInt(selectedCategory)
      );
    }

    // Brand filter
    if (selectedBrand) {
      filtered = filtered.filter(product => 
        product.product.brand_id === parseInt(selectedBrand)
      );
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.product.name.localeCompare(b.product.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.product.name.localeCompare(a.product.name));
        break;
      // Add other sorting options as needed
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, selectedBrand, priceRange, sortBy, products]);

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50" />

      <Container>
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 py-4 text-sm">
          <Link href="/" className="flex items-center text-gray-600 hover:text-[#081C63]">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link href="/shops" className="text-gray-600 hover:text-[#081C63]">Shops</Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link 
            href={`/shops/${selectedStore}`} 
            className="text-gray-600 hover:text-[#081C63]"
          >
            {selectedStore}
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-[#081C63] font-medium">Products</span>
        </nav>

        {/* Header with Decorative Elements */}
        <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-[#081C63]/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-gradient-to-tr from-[#081C63]/5 to-transparent rounded-full blur-2xl" />
          
          <div className="relative">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {selectedStore ? `Products from ${selectedStore}` : 'All Products'}
            </h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#081C63]/5 text-[#081C63] rounded-full text-sm font-medium">
                {filteredProducts.length} Products
              </span>
              {selectedCategory && (
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                  {categories.find(c => c.id.toString() === selectedCategory)?.name}
                </span>
              )}
              {selectedBrand && (
                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
                  {brands.find(b => b.id.toString() === selectedBrand)?.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filters Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <ListFilter className="w-5 h-5" />
            <span className="font-medium">Filters</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={cn(
            "lg:w-72 flex-shrink-0 bg-white rounded-xl border border-gray-200 overflow-hidden",
            "lg:block lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]",
            showMobileFilters ? "fixed inset-0 z-50 w-full h-full" : "hidden"
          )}>
            {/* Filter Header */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#081C63]/5 via-transparent to-transparent">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <p className="text-sm text-gray-500">Refine your product search</p>
            </div>

            {/* Filter Content */}
            <div className="p-6 space-y-8 overflow-y-auto h-full">
              {/* Categories */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-gray-900">Categories</h3>
                <div className="space-y-3">
                  <label className="flex items-center group cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={!selectedCategory}
                      onChange={() => setSelectedCategory(null)}
                      className="h-4 w-4 text-[#081C63] border-gray-300 focus:ring-[#081C63]"
                    />
                    <span className="ml-2 text-sm text-gray-600 group-hover:text-[#081C63] transition-colors">
                      All Categories
                    </span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center group cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id.toString()}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="h-4 w-4 text-[#081C63] border-gray-300 focus:ring-[#081C63]"
                      />
                      <span className="ml-2 text-sm text-gray-600 group-hover:text-[#081C63] transition-colors">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-gray-900">Brands</h3>
                <div className="space-y-3">
                  <label className="flex items-center group cursor-pointer">
                    <input
                      type="radio"
                      name="brand"
                      checked={!selectedBrand}
                      onChange={() => setSelectedBrand(null)}
                      className="h-4 w-4 text-[#081C63] border-gray-300 focus:ring-[#081C63]"
                    />
                    <span className="ml-2 text-sm text-gray-600 group-hover:text-[#081C63] transition-colors">
                      All Brands
                    </span>
                  </label>
                  {brands.map((brand) => (
                    <label key={brand.id} className="flex items-center group cursor-pointer">
                      <input
                        type="radio"
                        name="brand"
                        value={brand.id}
                        checked={selectedBrand === brand.id.toString()}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="h-4 w-4 text-[#081C63] border-gray-300 focus:ring-[#081C63]"
                      />
                      <span className="ml-2 text-sm text-gray-600 group-hover:text-[#081C63] transition-colors">
                        {brand.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-gray-900">Price Range</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1.5 block">Min Price</label>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#081C63] focus:ring-1 focus:ring-[#081C63]/30"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1.5 block">Max Price</label>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#081C63] focus:ring-1 focus:ring-[#081C63]/30"
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#081C63]"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedBrand(null);
                  setPriceRange([0, maxPrice]);
                }}
                className="w-full py-3 px-4 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 mt-4"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#081C63]" />
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border-0 text-gray-700 focus:ring-0 bg-transparent cursor-pointer font-medium hover:text-[#081C63] transition-colors"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>

            {/* Products Grid */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
                {loading ? (
                  Array(8).fill(null).map((_, idx) => (
                    <div key={idx} className="flex justify-center transform hover:scale-105 transition-transform duration-300">
                      <MainProduct products={[{} as Product]} loading={true} />
                    </div>
                  ))
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div key={product.id} className="flex justify-center transform hover:scale-105 transition-transform duration-300">
                      <MainProduct products={[product]} loading={false} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full min-h-[400px] flex flex-col items-center justify-center">
                    <div className="bg-gray-50 rounded-full p-8 mb-6">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 text-center max-w-md mb-8">
                      Try adjusting your filters or search criteria to find what you're looking for
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedBrand(null);
                        setPriceRange([0, maxPrice]);
                      }}
                      className="px-8 py-3 bg-[#081C63] text-white rounded-xl hover:bg-[#081C63]/90 transition-all duration-200 font-medium hover:shadow-lg hover:shadow-[#081C63]/10"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
