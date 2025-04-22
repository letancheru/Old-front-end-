'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import CartService, { Cart as CartServiceCart, CartItem as CartServiceCartItem } from '@/components/service/CartService';
import { useUser } from './UserContext';
import { toast } from 'react-hot-toast';

interface CartContextValue {
  cart: CartServiceCart | null;
  cartCount: number;
  isLoading: boolean;
  isUpdating: boolean;
  setCart: (cart: CartServiceCart | null) => void;
  addItem: (productStoreId: string, quantity?: number) => Promise<boolean>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<boolean>;
  removeItem: (itemId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartServiceCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useUser();

  const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const addItem = useCallback(async (productStoreId: string, quantity = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return false;
    }

    try {
      setIsUpdating(true);
      const response = await CartService.addItem(productStoreId, quantity);
      setCart(response);
      toast.success('Item added to cart');
      return true;
    } catch (error: any) {
      console.error('Error adding item to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [user]);

  const updateItemQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (!user) {
      toast.error('Please login to update cart');
      return false;
    }

    if (quantity < 1) {
      toast.error('Quantity must be at least 1');
      return false;
    }

    try {
      setIsUpdating(true);
      const response = await CartService.updateItem(itemId, quantity);
      setCart(response);
      return true;
    } catch (error: any) {
      console.error('Error updating cart item:', error);
      toast.error(error.response?.data?.message || 'Failed to update cart');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [user]);

  const removeItem = useCallback(async (itemId: string) => {
    if (!user) {
      toast.error('Please login to modify cart');
      return false;
    }

    try {
      setIsUpdating(true);
      const response = await CartService.removeItem(itemId);
      setCart(response);
      toast.success('Item removed from cart');
      return true;
    } catch (error: any) {
      console.error('Error removing cart item:', error);
      toast.error(error.response?.data?.message || 'Failed to remove item');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [user]);

  const clearCart = useCallback(async () => {
    if (!user) {
      toast.error('Please login to clear cart');
      return false;
    }

    try {
      setIsUpdating(true);
      await CartService.clearCart();
      setCart(null);
      toast.success('Cart cleared');
      return true;
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      toast.error(error.response?.data?.message || 'Failed to clear cart');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [user]);

  const value = {
    cart,
    cartCount,
    isLoading,
    isUpdating,
    setCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};