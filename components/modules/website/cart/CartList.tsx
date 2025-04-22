import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Toast from "../../custom/Toast";
import CartItem from "./CartItem";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import CartService, { CartItem as TCartItem } from "@/components/service/CartService";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export function CartList({ showCart = true }: { showCart?: boolean }) {
  const { cart, setCart } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const proceedCheckout = async () => {
    if (!cart?.items?.length) {
      toast.custom(
        <Toast
          message="Your cart is empty. Please add items to your cart."
          status="error"
          link="/products"
        />
      );
      return;
    }

    // Redirect to login if user is not authenticated
    if (!user) {
      router.push("/signin?redirect=/checkout");
      return;
    }

    try {
      setLoading(true);
      
      // Update all cart items with latest quantities
      await Promise.all(cart.items.map(async (item: TCartItem) => {
        const response = await CartService.updateItem(item.id, item.quantity);
        if (response.data) {
          setCart(response.data);
        }
      }));

      // Validate cart before checkout
      const response = await CartService.validateForCheckout();
      if (response.data) {
        router.push("/checkout");
      } else {
        toast.custom(
          <Toast 
            message={response.message || "Unable to proceed to checkout"} 
            status="error" 
          />
        );
      }
    } catch (error: any) {
      toast.custom(
        <Toast 
          message={error?.response?.data?.message || "Error proceeding to checkout"} 
          status="error" 
        />
      );
    } finally {
      setLoading(false);
    }
  };

  const hasItems = cart?.items && cart.items.length > 0;

  return (
    <div className="divide-y divide-gray-200">
      {/* Cart Items */}
      <div className="space-y-px">
        {cart?.items?.map((item: TCartItem) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      {/* Checkout Button */}
      {showCart && (
        <div className="pt-6 px-4">
          <Button
            onClick={proceedCheckout}
            disabled={loading || !hasItems}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-6 rounded-lg shadow-lg shadow-primary-100 hover:shadow-primary-200 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 text-base font-medium"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                <span>{!user ? 'Sign in to Checkout' : 'Proceed to Checkout'}</span>
              </>
            )}
          </Button>
          {hasItems && (
            <p className="text-center text-sm text-gray-500 mt-4">
              By proceeding to checkout, you agree to our terms and conditions.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
