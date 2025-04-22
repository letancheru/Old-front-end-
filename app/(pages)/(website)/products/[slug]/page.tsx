"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Container from "@/components/modules/custom/Container";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Product, Variation, Batch } from "@/types";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { BsFacebook, BsLinkedin, BsTwitterX, BsWhatsapp } from "react-icons/bs";
import Loading from "@/components/modules/custom/Loading";
import FeaturesProducts from "@/components/modules/website/home/FeaturesProducts";
import Reviews from "@/components/modules/website/product/Reviews";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  AlertCircle,
  Check,
  CreditCard,
  RefreshCw,
  ShoppingCart,
  Star,
  Truck,
  ChevronRight,
  Home,
  Package,
  Info,
} from "lucide-react";
import { Rating } from "@mui/material";

import { useWishlist } from "@/contexts/WishlistContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";
import Toast from "@/components/modules/custom/Toast";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface ProductGallery {
  id: number;
  file_path: string;
  gallery?: string;
}

interface ProductCategory {
  id: number;
  name: string;
}

interface ProductDetails {
  id: number;
  name: string;
  thumbnail?: {
    file_path: string;
  };
  gallery?: {
    gallery: string;
  };
  category?: ProductCategory;
  quantity: number;
  discount?: number;
  discout_type?: string;
  unit?: {
    symbol: string;
    name: string;
  };
  SKU?: string;
  description?: string;
  details?: string;
  average_rating?: number;
  reviews_count?: number;
}

interface ProductData {
  id: number;
  product: ProductDetails;
  price: number;
  variations?: ProductVariation[];
  quantity: number;
  discount?: number;
  discout_type?: string;
}

interface ProductVariation {
  id: number;
  size: string;
  color: string;
  price: number;
}

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
  };
  price: number;
  quantity: number;
  image: string;
  variation?: {
    size: string;
    color: string;
  } | null;
}

const ZoomImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="w-full h-full">
    <Zoom>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain rounded-lg bg-gray-50/50 transition-transform duration-300"
      />
    </Zoom>
  </div>
);

export default function ProductPage() {
  const { slug } = useParams();
  const pathname = usePathname();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [active, setActive] = useState<number>(0);
  const [changeImage, setChangeImage] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = product?.quantity || 0;
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!slug) return;

    const getProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product-store/${slug}`
        );
        setProduct(response?.data ? response?.data?.data : null);
        setChangeImage(
          process.env.NEXT_PUBLIC_API_URL +
            "/storage/" +
            response?.data?.data?.product?.thumbnail?.file_path
        );
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [slug]);


  const handleQuantityChange = (value: number) => {
    if (value < 1) value = 1;
    if (value > maxQuantity) value = maxQuantity;
    setQuantity(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) return;
    handleQuantityChange(value);
  };

  const addTocartHandler = async () => {
    if (!product) return;
    
    if (!token) {
      toast.custom(<Toast message="Please login to add items to cart" status="error" />);
      return;
    }
    
    setCartLoading(true);
    
    try {
      await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/api/cart/items",
        { product_stores_id: product.id, quantity: 1 },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.custom(<Toast message="Product added to cart successfully" status="success" />);
    } catch (error) {
      toast.custom(<Toast message="Failed to add product to cart" status="error" />);
    } finally {
      setCartLoading(false);
    }
  };

  if (loading)
    return (
      <div className="animate-pulse">
        <section className="bg-gray-50 py-4">
          <Container>
            <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          </Container>
        </section>
        
        <section className="my-12">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-xl"></div>
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    );
  if (error) return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Product</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link href="/products" className="text-primary-600 hover:text-primary-700 font-medium">
          Return to Store
        </Link>
      </div>
    </Container>
  );
  if (!product) return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-600 mb-4">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/products" className="text-primary-600 hover:text-primary-700 font-medium">
          Return to Store
        </Link>
      </div>
    </Container>
  );

  return (
    <>
      <div className="fixed inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-20 z-0" />
      
      <section className="bg-gradient-to-b from-gray-50/50 to-white py-6">
        <Container>
          <Breadcrumb>
            <BreadcrumbList className="flex items-center gap-2 text-sm text-gray-600">
              <BreadcrumbItem>
                <Link href="/" className="hover:text-primary-600 transition-colors flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  Home
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-400" />
              <BreadcrumbItem>
                <Link href="/products" className="hover:text-primary-600 transition-colors">
                  Store
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-400" />
              <BreadcrumbItem>
                <Link
                  href={`/categories/${product?.product?.category?.name}/products`}
                  className="hover:text-primary-600 transition-colors"
                >
                  {product?.product?.category?.name}
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-400" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-primary-900">
                  {product?.product?.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Container>
      </section>

      {/* Main Product Section */}
      <section className="py-8">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Card - Product Images Only */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
              {/* Main Image */}
              <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-white p-4">
              {product?.product?.discount && product.product.discount > 0 && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm">
                    {product.product.discout_type === 'percent' 
                      ? `${product.product.discount}% OFF` 
                      : `${product.product.discount} OFF`}
                  </span>
                </div>
              )}
                <ZoomImage src={changeImage} alt={product?.product?.name || ''} />
              </div>
              
              {/* Gallery */}
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="grid grid-cols-5 gap-3">
                  {product?.product?.gallery?.gallery &&
                    JSON.parse(product?.product?.gallery?.gallery).map(
                      (item: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() =>
                            setChangeImage(
                              `${process.env.NEXT_PUBLIC_API_URL}/storage/${item}`
                            )
                          }
                          className={`relative aspect-square rounded-lg overflow-hidden group
                            ${
                              changeImage.includes(item)
                                ? "ring-2 ring-primary-500"
                                : "hover:ring-2 hover:ring-primary-300"
                            }`}
                        >
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${item}`}
                            alt={`Product view ${idx + 1}`}
                            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                          />
                        </button>
                      )
                    )}
                </div>
              </div>
            </div>

            {/* Right Card - All Product Details */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
              <div className="p-6 space-y-6">
                {/* Product Name and Status */}
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                    {product?.product?.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    {product?.quantity > 0 ? (
                      <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1 rounded-full">
                        <Check className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          In Stock ({product.quantity} units available)
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-700 bg-red-50 px-3 py-1 rounded-full">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Currently Out of Stock</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price and Rating */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b border-gray-100">
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary-600">
                        {formatPrice(Number(product?.price))}
                      </span>
                      {product?.product?.discount && product.product.discount > 0 && (
                        <span className="text-base text-gray-400 line-through">
                          {formatPrice(Number(product?.price) + Number(product?.product?.discount))}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Price per {product?.product?.unit?.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Rating
                      value={parseFloat(
                        `${Number(product?.product?.average_rating)?.toFixed(2)}`
                      )}
                      precision={0.5}
                      readOnly
                      size="medium"
                    />
                    <span className="text-sm text-gray-500">
                      ({product?.product?.reviews_count} reviews)
                    </span>
                  </div>
                </div>

                {/* Product Meta Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <Package className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">Category</p>
                      <p className="text-sm font-medium text-gray-900">{product?.product?.category?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <Info className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">SKU</p>
                      <p className="text-sm font-medium text-gray-900">{product?.product?.SKU}</p>
                    </div>
                  </div>
                </div>

                {/* Product Description */}
                {product?.product?.description && (
                  <div className="prose prose-sm max-w-none pt-4 border-t border-gray-100">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">About This Product</h3>
                    <div className="text-sm text-gray-600 leading-relaxed" 
                         dangerouslySetInnerHTML={{ __html: product?.product?.description }} 
                    />
                  </div>
                )}

                {/* Product Details */}
                {product?.product?.details && (
                  <div className="prose prose-sm max-w-none pt-4 border-t border-gray-100">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Specifications</h3>
                    <div className="text-sm text-gray-600 leading-relaxed"
                         dangerouslySetInnerHTML={{ __html: product?.product?.details }}
                    />
                  </div>
                )}

                {/* Variations */}
                {product?.variations && (product.variations as ProductVariation[]).length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-semibold text-gray-900">Select Variation</h3>
                      <span className="text-xs px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full">
                        {(product.variations as ProductVariation[]).length} options available
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(product.variations as ProductVariation[]).map((variation) => (
                        <button
                          key={variation.id}
                          onClick={() => setSelectedId(variation.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm
                            ${
                              selectedId === variation.id
                                ? "bg-primary-50 ring-1 ring-primary-500 text-primary-700 font-medium"
                                : "bg-gray-50 hover:bg-primary-50/50 text-gray-700 hover:text-primary-600"
                            }`}
                        >
                          <div
                            className="w-4 h-4 rounded-full border shadow-sm"
                            style={{ backgroundColor: variation.color }}
                          ></div>
                          <span>
                            {variation.size} - {product?.product?.unit?.symbol}
                            {variation.price}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add to Cart Section */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    {/* Quantity Control */}
                    <div className="flex items-center bg-white rounded-lg border border-gray-200">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className={`flex-none w-10 h-10 flex items-center justify-center border-r border-gray-200
                          ${quantity <= 1 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      
                      <input
                        type="number"
                        value={quantity}
                        onChange={handleInputChange}
                        min="1"
                        max={maxQuantity}
                        className="w-16 h-10 text-center border-0 text-gray-900 text-sm focus:ring-0"
                      />
                      
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= maxQuantity}
                        className={`flex-none w-10 h-10 flex items-center justify-center border-l border-gray-200
                          ${quantity >= maxQuantity 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={addTocartHandler}
                      disabled={cartLoading || product?.quantity <= 0}
                      className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-white h-10 px-6 rounded-lg hover:shadow-lg hover:shadow-primary-500/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cartLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Adding...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 transition-transform duration-200 group-hover/btn:scale-110" />
                          <span className="transition-transform duration-200 group-hover/btn:scale-105">Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Related Products Section */}
      <section className="py-12 bg-gradient-to-b from-gray-50/50 to-white">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
            <Link 
              href="/products" 
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <FeaturesProducts />
        </Container>
      </section>
    </>
  );
}

function SpecItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-base font-medium text-gray-900">{value}</dd>
    </div>
  );
}
