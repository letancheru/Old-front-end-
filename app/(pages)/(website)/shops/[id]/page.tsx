'use client'

import { useEffect, useState } from 'react';
import ShopsService from '@/components/service/ShopsService';
import Link from 'next/link';
import ProductList from '@/components/modules/website/products/ProductList';
import Container from '@/components/modules/custom/Container';
import { cn } from "@/lib/utils";
import Image from 'next/image';

export default function ShopProducts({ params }: { params: { id: string } }) {
    const [store, setStore] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStore = async () => {
            try {
                const data = await ShopsService.getShops();
                const selectedStore = data.find((s: any) => s.slug === params.id);
                if (selectedStore?.product_stores) {
                    // Map the data structure to match what ProductList expects
                    selectedStore.product_stores = selectedStore.product_stores.map((ps: any) => ({
                        id: ps.id, // Using product_store id instead of product id
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
                        brand_id: ps.product.brand_id,
                        unit_id: ps.product.unit_id,
                        product: {
                            ...ps.product,
                            id: ps.id, // Using product_store id for consistency
                            price: ps.price,
                            quantity: ps.quantity
                        }
                    }));
                }
                setStore(selectedStore);
            } catch (error) {
                console.error('Error fetching store:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStore();
    }, [params.id]);

    return (
        <section className="py-12 bg-gradient-to-b from-gray-50 via-white to-gray-50 min-h-screen relative">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-30" />
            
            <Container className="relative">
                {/* Store Header Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-xl">
                    <div className="relative h-64 sm:h-72 md:h-80 lg:h-96 w-full">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${store?.thumbnail?.file_path}`}
                            alt={store?.name || 'Store Image'}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <div className="max-w-4xl">
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{store?.name || 'Shop Products'}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-gray-200 text-lg">
                                    {store?.location && (
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{store.location}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <span>{store?.product_stores?.length || 0} Products Available</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link 
                            href="/shops" 
                            className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-full hover:bg-white transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transform"
                        >
                            <span>←</span> Back to Shops
                        </Link>
                    </div>
                </div>

                {/* Products Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
                        <div className="text-gray-500">
                            Showing {store?.product_stores?.length || 0} products
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
                        {!loading && store?.product_stores?.map((product: any) => (
                            <div key={product.id} className="relative flex w-full p-0 items-center justify-center rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <ProductList 
                                    loading={loading} 
                                    products={[product]} 
                                />
                            </div>
                        ))}
                        
                        {/* Loading State */}
                        {loading && (
                            <div className="col-span-full flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        )}
                        
                        {/* Empty State */}
                        {!loading && (!store?.product_stores || store.product_stores.length === 0) && (
                            <div className="col-span-full text-center py-12">
                                <h3 className="text-xl font-semibold text-gray-600">No products available</h3>
                                <p className="text-gray-500 mt-2">This shop hasn't added any products yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </section>
    );
} 