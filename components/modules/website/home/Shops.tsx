'use client'

import { useEffect, useState } from 'react';
import ShopsService from '@/components/service/ShopsService';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Thumbnail {
    id: number;
    file_path: string;
    collection_name: string;
}

interface ProductStore {
    id: number;
    product_id: number;
    store_id: number;
    quantity: number;
    price: string;
    created_at: string;
    updated_at: string;
}

interface Shop {
    id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    location: string;
    created_at: string;
    updated_at: string;
    parent: Shop | null;
    children: Shop[];
    thumbnail: Thumbnail;
    product_stores: ProductStore[];
}

const Shops = () => {
    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const data = await ShopsService.getShops();
                setShops(data);
            } catch (error) {
                console.error('Error fetching shops:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchShops();
    }, []);

    const handleShopClick = (slug: string) => {
        router.push(`/shops/${slug}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {shops.map((shop) => (
                    <div
                        key={shop.id}
                        onClick={() => handleShopClick(shop.slug)}
                        className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105"
                    >
                        <div className="relative h-48 w-full">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${shop.thumbnail?.file_path}`}
                                alt={shop.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">{shop.name}</h2>
                            <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{shop.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <span>{shop.product_stores.length} Products</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {shops.length === 0 && (
                <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold text-gray-600">No shops available</h2>
                    <p className="text-gray-500 mt-2">Please check back later</p>
                </div>
            )}
        </div>
    );
};

export default Shops;
