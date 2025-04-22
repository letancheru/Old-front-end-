'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from "@/components/modules/custom/Container";
import { toast } from "react-hot-toast";
import { useUser } from "@/contexts/UserContext";
import { useCart } from "@/contexts/CartContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CreditCard, Package, CheckCircle, Loader2 } from 'lucide-react';
import axiosInstance from '@/components/axiosInstance/AxiosInstance';
import { Cart, CartItem } from '@/components/service/CartService';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const [clearingCart, setClearingCart] = useState(false);
  const [localCart, setLocalCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useUser();
  const { 
    cart, 
    isLoading, 
    isUpdating,
    updateItemQuantity,
    removeItem,
    clearCart 
  } = useCart();

  // Initialize local cart from context
  useEffect(() => {
    if (cart) {
      setLocalCart(cart);
    }
  }, [cart]);

  // Fetch cart data directly
  const fetchCart = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await axiosInstance.get('/api/cart');
      const cartData = response.data as Cart;
      setLocalCart(cartData);
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      setError(error.response?.data?.message || 'Failed to load your cart');
      toast.error('Failed to load your cart');
    } finally {
      setLoading(false);
    } 
  };

  // Initial cart fetch
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Set loading to false when cart data is available
  useEffect(() => {
    if (localCart) {
      setLoading(false);
    }
  }, [localCart]);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    // Optimistic update - update UI immediately
    if (localCart) {
      const updatedItems = localCart.items.map(item => {
        if (item.id === itemId) {
          return { 
            ...item, 
            quantity: newQuantity
          };
        }
        return item;
      });
      
      setLocalCart({
        ...localCart,
        items: updatedItems as CartItem[]
      });
    }

    try {
      await axiosInstance.put(`/api/cart/items/${itemId}`, { 
        quantity: newQuantity
      });
      
      // Fetch fresh cart data after update
      await fetchCart();
      toast.success('Cart updated successfully');
    } catch (error: any) {
      console.error('Error updating cart:', error);
      toast.error(error.response?.data?.message || 'Failed to update cart');
      
      // Revert optimistic update on error
      if (cart) {
        setLocalCart(cart);
      }
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    // Optimistic update - update UI immediately
    if (localCart) {
      const updatedItems = localCart.items.filter(item => item.id !== itemId);
      
      // Recalculate totals
      const total_amount = updatedItems.reduce((sum, item) => sum + Number(item.total), 0);
      const tax_amount = total_amount * 0.1; // Assuming 10% tax
      const grand_total = total_amount + tax_amount - (Number(localCart.discount_amount) || 0);
      
      setLocalCart({
        ...localCart,
        items: updatedItems as CartItem[],
        total_amount: total_amount.toString(),
        tax_amount: tax_amount.toString(),
        grand_total: grand_total.toString()
      });
    }

    try {
      await axiosInstance.delete(`/api/cart/items/${itemId}`);
      
      // Fetch fresh cart data after update
      await fetchCart();
      toast.success('Item removed from cart');
    } catch (error: any) {
      console.error('Error removing item:', error);
      toast.error(error.response?.data?.message || 'Failed to remove item');
      
      // Revert optimistic update on error
      if (cart) {
        setLocalCart(cart);
      }
    }
  };

  const handleClearCart = async () => {
    if (clearingCart) return;

    try {
      setClearingCart(true);
      await axiosInstance.delete('/api/cart');
      setLocalCart(null);
      toast.success('Cart cleared successfully');
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    } finally {
      setClearingCart(false);
    }
  };

  const handleCheckout = () => {
    if (!localCart || localCart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    router.push('/checkout');
  };

  if (loading || isLoading) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-[#1B4486] border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </Container>
    );
  }

  if (!loading && !isLoading && (!localCart || localCart.items.length === 0)) {
    return (
      <Container>
        <div className="py-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Your Shopping Cart</h1>
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <ShoppingBag className="h-full w-full" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <button
              onClick={() => router.push("/products")}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#1B4486] hover:bg-[#153567] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold flex items-center">
                  <Package className="mr-2 text-[#1B4486]" />
                  Cart Items
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {localCart?.items.map((item) => (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-gray-50 transition-colors`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${item.product_store.product.thumbnail.file_path}`}
                                alt={item.product_store.product.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{item.product_store.product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                          {formatPrice(item.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={isUpdating}
                            >
                              <Minus className="h-4 w-4 text-gray-600" />
                            </button>
                            <span className="min-w-[2rem] text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={isUpdating}
                            >
                              <Plus className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex flex-col items-end">
                            <span className="font-medium text-gray-900">{formatPrice(item.subtotal)}</span>
                           
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors flex items-center justify-end disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isUpdating}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            <span>Remove</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Order Summary Card */}
          <div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold flex items-center">
                  <CreditCard className="mr-2 text-[#1B4486]" />
                  Order Summary
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatPrice(Number(localCart?.total_amount))}</span>
                  </div>
                  {Number(localCart?.discount_amount) > 0 && (
                    <div className="flex justify-between text-base text-green-600">
                      <span>Discount:</span>
                      <span>-{formatPrice(Number(localCart?.discount_amount))}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">{formatPrice(Number(localCart?.tax_amount))}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-3 mt-3">
                    <span>Total:</span>
                    <span className="text-[#1B4486]">{formatPrice(Number(localCart?.grand_total))}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    onClick={handleClearCart}
                    className="w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={clearingCart || isUpdating}
                  >
                    {clearingCart ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    <span>Clear Cart</span>
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="w-full px-6 py-4 bg-[#1B4486] text-white rounded-lg hover:bg-[#153567] transition-all font-medium flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={clearingCart || isUpdating}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Proceed to Checkout</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                  <div className="text-sm text-gray-500 mt-2">
                    Free shipping on orders over Br 50
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}