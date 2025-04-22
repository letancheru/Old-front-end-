"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import CartService from '@/components/service/CartService';
import { useUser } from './UserContext';
import { toast } from 'react-hot-toast';

const CartContext = createContext(undefined);

// Constants for localStorage keys
const CART_STORAGE_KEY = 'elelan_cart_items';
const CART_EXPIRY_KEY = 'elelan_cart_expiry';
const CART_EXPIRY_DAYS = 7; // Cart data expires after 7 days

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useUser();

  // Calculate cart count as the sum of all item quantities
  const cartCount = cart?.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0;

  // Calculate cart subtotal
  const subtotal = cart?.items?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;

  // Check if cart is expired
  const isCartExpired = () => {
    const expiryDate = localStorage.getItem(CART_EXPIRY_KEY);
    if (!expiryDate) return true;
    
    const expiry = new Date(expiryDate);
    return new Date() > expiry;
  };

  // Set cart expiry date
  const setCartExpiry = () => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + CART_EXPIRY_DAYS);
    localStorage.setItem(CART_EXPIRY_KEY, expiryDate.toISOString());
  };

  // Refresh cart data from server or localStorage
  const refreshCart = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (user) {
        // Fetch server cart for logged-in users
        const response = await CartService.getCart();
        setCart(response);
        
        // Clear local storage cart when user is logged in
        localStorage.removeItem(CART_STORAGE_KEY);
        localStorage.removeItem(CART_EXPIRY_KEY);
      } else {
        // Get cart from localStorage for guest users
        const localCart = localStorage.getItem(CART_STORAGE_KEY);
        
        if (localCart && !isCartExpired()) {
          const parsedCart = JSON.parse(localCart);
          setCart(parsedCart.cart || parsedCart);
        } else {
          // Cart is expired or doesn't exist, create a new one
          setCart(null);
          localStorage.removeItem(CART_STORAGE_KEY);
          localStorage.removeItem(CART_EXPIRY_KEY);
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load your cart');
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Add item to cart
  const addItem = useCallback(async (productStoreId, quantity = 1) => {
    if (!productStoreId || quantity <= 0) {
      toast.error('Invalid product or quantity');
      return false;
    }

    try {
      setIsUpdating(true);
      
      if (user) {
        // Add to server cart for logged-in users
        const response = await CartService.addItem(productStoreId, quantity);
        setCart(response);
        toast.success('Item added to cart');
        return true;
      } else {
        // Add to local cart for guest users
        let updatedCart = cart;
        
        if (!updatedCart) {
          // Create new cart if it doesn't exist
          updatedCart = {
            id: 'local-' + Date.now(),
            items: [],
            total_amount: 0,
            discount_amount: 0,
            tax_amount: 0,
            grand_total: 0
          };
        }
        
        // Check if item already exists in cart
        const existingItemIndex = updatedCart.items.findIndex(
          item => item.product_stores_id === productStoreId
        );
        
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          updatedCart.items[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          // Note: In a real implementation, you would fetch product details here
          // For now, we'll use a placeholder
          updatedCart.items.push({
            id: 'item-' + Date.now(),
            product_stores_id: productStoreId,
            quantity: quantity,
            price: 0, // This would be fetched from the product
            discount_amount: 0,
            total: 0, // This would be calculated
            product_store: {
              product: {
                name: 'Loading...',
                thumbnail: null
              }
            }
          });
        }
        
        // Recalculate totals
        updatedCart.total_amount = updatedCart.items.reduce(
          (total, item) => total + (item.price * item.quantity), 
          0
        );
        updatedCart.grand_total = updatedCart.total_amount - 
          updatedCart.discount_amount + 
          updatedCart.tax_amount;
        
        setCart(updatedCart);
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ cart: updatedCart }));
        setCartExpiry();
        toast.success('Item added to cart');
        return true;
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Failed to add item to cart');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [cart, user]);

  // Update item quantity
  const updateItemQuantity = useCallback(async (itemId, quantity) => {
    if (!itemId || quantity <= 0) {
      toast.error('Invalid item or quantity');
      return false;
    }

    try {
      setIsUpdating(true);
      
      if (user) {
        // Update server cart for logged-in users
        const response = await CartService.updateItem(itemId, quantity);
        setCart(response);
        toast.success('Cart updated');
        return true;
      } else {
        // Update local cart for guest users
        if (!cart) {
          toast.error('Cart is empty');
          return false;
        }
        
        const updatedCart = { ...cart };
        const itemIndex = updatedCart.items.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) {
          toast.error('Item not found in cart');
          return false;
        }
        
        updatedCart.items[itemIndex].quantity = quantity;
        
        // Recalculate totals
        updatedCart.total_amount = updatedCart.items.reduce(
          (total, item) => total + (item.price * item.quantity), 
          0
        );
        updatedCart.grand_total = updatedCart.total_amount - 
          updatedCart.discount_amount + 
          updatedCart.tax_amount;
        
        setCart(updatedCart);
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ cart: updatedCart }));
        setCartExpiry();
        toast.success('Cart updated');
        return true;
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast.error('Failed to update cart');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [cart, user]);

  // Remove item from cart
  const removeItem = useCallback(async (itemId) => {
    if (!itemId) {
      toast.error('Invalid item ID');
      return false;
    }

    try {
      setIsUpdating(true);
      
      if (user) {
        // Remove from server cart for logged-in users
        const response = await CartService.removeItem(itemId);
        setCart(response);
        toast.success('Item removed from cart');
        return true;
      } else {
        // Remove from local cart for guest users
        if (!cart) {
          toast.error('Cart is empty');
          return false;
        }
        
        const updatedCart = { ...cart };
        updatedCart.items = updatedCart.items.filter(item => item.id !== itemId);
        
        // Recalculate totals
        updatedCart.total_amount = updatedCart.items.reduce(
          (total, item) => total + (item.price * item.quantity), 
          0
        );
        updatedCart.grand_total = updatedCart.total_amount - 
          updatedCart.discount_amount + 
          updatedCart.tax_amount;
        
        setCart(updatedCart);
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ cart: updatedCart }));
        setCartExpiry();
        toast.success('Item removed from cart');
        return true;
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
      toast.error('Failed to remove item from cart');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [cart, user]);

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      setIsUpdating(true);
      
      if (user) {
        // Clear server cart for logged-in users
        await CartService.clearCart();
        setCart(null);
        toast.success('Cart cleared');
        return true;
      } else {
        // Clear local cart for guest users
        setCart(null);
        localStorage.removeItem(CART_STORAGE_KEY);
        localStorage.removeItem(CART_EXPIRY_KEY);
        toast.success('Cart cleared');
        return true;
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [user]);

  // Apply coupon to cart
  const applyCoupon = useCallback(async (couponCode) => {
    if (!couponCode || !cart) {
      toast.error('Invalid coupon code or empty cart');
      return false;
    }

    try {
      setIsUpdating(true);
      
      if (user) {
        // Apply coupon to server cart for logged-in users
        const response = await CartService.applyCoupon(cart.id, couponCode);
        setCart(response);
        toast.success('Coupon applied successfully');
        return true;
      } else {
        // For guest users, we would need to validate the coupon with the server
        // and then apply it to the local cart
        // This is a simplified implementation
        toast.error('Please login to apply coupons');
        return false;
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error('Failed to apply coupon');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [cart, user]);

  // Remove coupon from cart
  const removeCoupon = useCallback(async () => {
    if (!cart) {
      toast.error('Cart is empty');
      return false;
    }

    try {
      setIsUpdating(true);
      
      if (user) {
        // Remove coupon from server cart for logged-in users
        const response = await CartService.removeCoupon(cart.id);
        setCart(response);
        toast.success('Coupon removed');
        return true;
      } else {
        // For guest users, we would need to update the local cart
        // This is a simplified implementation
        toast.error('Please login to manage coupons');
        return false;
      }
    } catch (error) {
      console.error('Error removing coupon:', error);
      toast.error('Failed to remove coupon');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [cart, user]);

  // Initial cart fetch
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Sync cart with localStorage for guest users
  useEffect(() => {
    if (!user && cart) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ cart }));
      setCartExpiry();
    }
  }, [cart, user]);

  const value = {
    cart,
    setCart,
    cartCount,
    subtotal,
    isLoading,
    isUpdating,
    refreshCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
