"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Toast from "../../custom/Toast";
import Link from "next/link";
import Image from "next/image";
import QuantityCart from "../../custom/QuantityCart";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import CartService, { CartItem as TCartItem } from "@/components/service/CartService";
import { formatPrice } from '@/lib/utils';

export default function CartItem({ item }: { item: TCartItem }) {
  const router = useRouter();
  const { setCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleRemoveCartItem = async () => {
    try {
      setLoading(true);
      const response = await CartService.removeItem(String(item.id));
      console.log(response);
      setCart(response);
      toast.custom(
        <Toast message="Item removed from cart" status="success" />
      );
    } catch (error: any) {
      toast.custom(
        <Toast 
          message={error?.response?.data?.message || "Error removing item from cart"} 
          status="error" 
        />
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group hover:bg-gray-50 transition-colors duration-150">
      <div className="flex items-center gap-4 p-4">
        {/* Product Image */}
        <Link
          className="shrink-0 aspect-square w-20 h-20 rounded-lg overflow-hidden bg-gray-50"
          href={`/products/${item?.product_store?.product?.id || ''}`}
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${item?.product_store?.product?.thumbnail?.file_path}`}
            alt={item?.product_store?.product?.name || "Product image"}
            width={80}
            height={80}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <Link href={`/products/${item?.product_store?.product?.id || ''}`}>
            <h3 className="text-sm font-medium text-gray-900 hover:text-primary-600 line-clamp-1">
              {item?.product_store?.product?.name}
            </h3>
          </Link>
          <p className="mt-1 text-sm text-gray-500">
            Unit Price: {formatPrice(item?.price)}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center">
          <QuantityCart item={item} />
        </div>

        {/* Price */}
        <div className="text-right min-w-[100px]">
          <p className="text-sm font-medium text-gray-900">
            {formatPrice(Number(item?.price) * Number(item?.quantity))}
          </p>
          {Number(item.discount) > 0 && (
            <p className="text-xs text-green-600">
              Save: {formatPrice(Number(item.discount))}
            </p>
          )}
        </div>

        {/* Remove Button */}
        <div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleRemoveCartItem}
            disabled={loading}
            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
            <span className="sr-only">{loading ? 'Removing...' : 'Remove'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
