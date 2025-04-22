import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Toast from "./Toast";
import { useCart } from "@/contexts/CartContext";
import CartService, { CartItem } from "@/components/service/CartService";
import { formatPrice } from '@/lib/utils';

export default function QuantityCart({ item }: { item: CartItem }) {
  const { setCart } = useCart();
  const [quantity, setQuantity] = useState(Number(item?.quantity) || 1);
  const [loading, setLoading] = useState(false);

  const MIN_QUANTITY = 1;
  const MAX_QUANTITY = 10;

  const updateQuantity = async (action: 'increment' | 'decrement') => {
    const newQuantity = Number(action === 'increment' ? quantity + 1 : quantity - 1);

    // Validate quantity limits
    if (newQuantity < MIN_QUANTITY) {
      toast.custom(<Toast message="Minimum quantity reached" status="error" />);
      return;
    }

    if (newQuantity > MAX_QUANTITY) {
      toast.custom(<Toast message="Maximum quantity reached" status="error" />);
      return;
    }

    try {
      setLoading(true);
      
      // Update quantity in the backend
      const response = await CartService.updateItem(Number(item.id), newQuantity);
      
      if (response.cart) {
        setCart(response.cart);
        setQuantity(newQuantity);
        
        toast.custom(
          <Toast message="Cart updated successfully" status="success" />
        );
      } else {
        toast.custom(
          <Toast message={response.message || "Error updating cart"} status="error" />
        );
        // Revert quantity on error
        setQuantity(quantity);
      }
    } catch (error: any) {
      toast.custom(
        <Toast 
          message={error?.response?.data?.message || "Error updating cart"} 
          status="error" 
        />
      );
      // Revert quantity on error
      setQuantity(quantity);
    } finally {
      setLoading(false);
    }
  };

  // Update local quantity when item changes
  useEffect(() => {
    setQuantity(Number(item?.quantity) || 1);
  }, [item?.quantity]);

  return (
    <div className="inline-flex gap-4 items-center">
      <div className="w-10 group bg-neutral-100 rounded-md p-1 grid place-content-center">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => updateQuantity('decrement')}
          disabled={loading || quantity <= MIN_QUANTITY}
          className="hover:bg-red-50"
        >
          <MinusIcon className="w-4 h-4" />
        </Button>
      </div>
      
      <span className="text-xl font-bold text-black text-center w-8">
        {quantity}
      </span>
      
      <div className="w-10 group bg-neutral-100 rounded-md p-1 grid place-content-center">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => updateQuantity('increment')}
          disabled={loading || quantity >= MAX_QUANTITY}
          className="hover:bg-green-50"
        >
          <PlusIcon className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-sm font-medium text-gray-900">
        {formatPrice(Number(quantity) * Number(item?.price))}
      </p>
    </div>
  );
}
