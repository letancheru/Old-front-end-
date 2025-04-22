"use client";
import React, { useEffect, useState } from "react";
import Container from "../../custom/Container";
import axios from "axios";
import { cn } from "@/lib/utils";
import "./style.css";
import { Product, Category, Brand } from "@/types";
import ProductCard from "../../custom/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryProducts from "./CategoryProducts";
import ShopsService from "@/components/service/ShopsService";
import Link from "next/link";
import {useBranch} from "@/hooks/useBranch";
import ProductCardSkeleton from "./ProductCardSkeleton";

export default function FeaturesProducts() {
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [group, setGroup] = useState<any>([]);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  useEffect(() => {
    const fetchStoreAndProducts = async () => {
      setLoading(true);
      try {
        // Get selected store from localStorage or fetch all stores and use the first one
        const selectedStoreSlug = localStorage.getItem('selectedStore');
        const stores = await ShopsService.getShops();
        
        let store;
        if (selectedStoreSlug) {
          store = stores.find((s: any) => s.slug === selectedStoreSlug);
          console.log(store)
        }
        if (!store && stores.length > 0) {
          store = stores[0];
          localStorage.setItem('selectedStore', store.slug);
        }
        
        setSelectedStore(store);

        if (store?.product_stores) {
          const mappedProducts = store.product_stores.map((ps: any) => ({
            id: ps.id,
            product_id: ps.product.id,
            store_id: ps.store_id,
            name: ps.product.name,
            slug: ps.product.slug,
            description: ps.product.description,
            details: ps.product.details,
            SKU: ps.product.SKU,
            code: ps.product.code,
            discount_type: ps.product.discount_type,
            discount: ps.product.discount,
            status: ps.product.status,
            thumbnail: ps.product.thumbnail,
            price: ps.price,
            quantity: ps.quantity,
            category_id: ps.product.category_id,
            category: ps.product.category,
            brand_id: ps.product.brand_id,
            brand: ps.product.brand,
            unit_id: ps.product.unit_id,
            product: {
              ...ps.product,
              id: ps.id,
              price: ps.price,
              quantity: ps.quantity
            }
          }));
          setAllProducts(mappedProducts);
          setFilteredProducts(mappedProducts);
          

          // Group products by category
          const groupedProducts = mappedProducts.reduce((acc: any, val: any) => {
            const categoryName = val.product.category.name;
            if (!acc[categoryName]) {
              acc[categoryName] = [];
            }
            acc[categoryName].push(val);
            return acc;
          }, {});
          setGroup(groupedProducts);
        }
      } catch (error) {
        console.error("Error fetching store and products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreAndProducts();
  }, []);

  // Listen for category changes
  useEffect(() => {
    const handleCategoryChange = () => {
      const storedCategory = localStorage.getItem('selectedCategory');
      const category = storedCategory ? JSON.parse(storedCategory) : null;
      setSelectedCategory(category);

      if (category) {
        const filtered = allProducts.filter(product => 
          product.category_id === category.id || 
          product.product.category_id === category.id
        );
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts(allProducts);
      }
    };

    // Initial check for selected category
    handleCategoryChange();

    // Listen for category selection changes
    window.addEventListener('categorySelected', handleCategoryChange);
    return () => {
      window.removeEventListener('categorySelected', handleCategoryChange);
    };
  }, [allProducts]);

  // Listen for brand changes
  useEffect(() => {
    const handleBrandChange = () => {
      const storedBrand = localStorage.getItem('selectedBrand');
      const brand = storedBrand ? JSON.parse(storedBrand) : null;
      setSelectedBrand(brand);

      if (brand) {
        const filtered = allProducts.filter(product => 
          product.brand_id === brand.id || 
          product.product.brand_id === brand.id
        );
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts(allProducts);
      }
    };

    // Initial check for selected brand
    handleBrandChange();

    // Listen for brand selection changes
    window.addEventListener('brandSelected', handleBrandChange);
    return () => {
      window.removeEventListener('brandSelected', handleBrandChange);
    };
  }, [allProducts]);

  const renderSkeleton = () => (
    <ProductCardSkeleton count={15} />
  );

  const renderFeaturedProducts = () => (
    <section className="py-8 bg-white rounded-lg shadow-lg relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50" />
      
      <Container className="relative">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-6 px-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedCategory ? `${selectedCategory.name} Products` : 
                 selectedBrand ? `${selectedBrand.name} Products` : 
                 'Featured Products'} 
                {selectedStore && ` from ${selectedStore.name}`}
              </h2>
              {selectedCategory && (
                <p className="text-gray-600 mt-1">
                  Showing {filteredProducts.length} products in {selectedCategory.name}
                </p>
              )}
              {selectedBrand && !selectedCategory && (
                <p className="text-gray-600 mt-1">
                  Showing {filteredProducts.length} products from {selectedBrand.name}
                </p>
              )}
            </div>
            <Link 
              href="/products" 
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center gap-2"
            >
              <span>See More</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {filteredProducts.length > 0 ? (
            <div className={cn("mySwiperd bg-white mt-8 border place-items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-4 p-6 rounded-sm h-full w-full")}>
              {filteredProducts?.slice(0, 15)?.map((item: Product, idx: number) => (
                <div key={idx} className="relative flex w-full p-0 items-center justify-center rounded-sm hover:shadow-md transition-shadow duration-300">
                  <ProductCard loading={loading} item={item} icon="" handler={() => {}} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found in this category.</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );

  if (!allProducts || allProducts.length === 0 || loading) {
    return renderSkeleton();
  }

  return (
    <>
      {renderFeaturedProducts()}
      {/* <CategoryProducts group={group} loading={loading} /> */}
    </>
  );
}
