"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from "@/components/modules/custom/Container";
import CartService, { Cart, CartItem } from "@/components/service/CartService";
import PaymentMethodService, { PaymentMethod } from "@/components/service/PaymentMethodService";
import { toast } from "react-hot-toast";
import { useUser } from "@/contexts/UserContext";
import { useCart } from "@/contexts/CartContext";
import { CreditCard, ShoppingBag, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const router = useRouter();
  const { user } = useUser() as { user: any | null };
  const { cart } = useCart() as { cart: Cart | null };

  useEffect(() => {
    if (!user) {
      toast.error("Please login to checkout");
      router.push("/login");
      return;
    }
    
    // Validate cart and refresh data
    const initializeCheckout = async () => {
      try {
        setLoading(true);
        // Validate cart for checkout
        await CartService.validateForCheckout();
        // Fetch payment methods
        await fetchPaymentMethods();
      } catch (error: any) {
        console.error('Error initializing checkout:', error);
        setError(error.response?.data?.message || 'Failed to initialize checkout');
        toast.error(error.response?.data?.message || 'Failed to initialize checkout');
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [user, router]);

  useEffect(() => {
    // Check if cart is empty or invalid after it's loaded
    if (!loading && (!cart || !cart.items || cart.items.length === 0)) {
      toast.error("Your cart is empty");
      router.push('/cart');
      return;
    }
  }, [cart, loading, router]);

  const fetchPaymentMethods = async () => {
    try {
      const methods = await PaymentMethodService.getPaymentMethods();
      setPaymentMethods(Array.isArray(methods) ? methods : []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      setPaymentMethods([]);
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim() || !cart?.id) return;

    try {
      setLoading(true);
      // First validate the coupon
      const validation = await CartService.validateCoupon(couponCode);
      if (!validation.valid) {
        setCouponError(validation.message);
        setCouponSuccess('');
        toast.error(validation.message);
        return;
      }

      // Apply the coupon if valid
      await CartService.applyCoupon(String(cart.id), couponCode);
      setCouponCode('');
      setCouponSuccess('Coupon applied successfully');
      setCouponError('');
      toast.success('Coupon applied successfully');
    } catch (error: any) {
      console.error('Error applying coupon:', error);
      setCouponError(error.response?.data?.message || 'Failed to apply coupon');
      setCouponSuccess('');
      toast.error(error.response?.data?.message || 'Failed to apply coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    if (!cart?.id) return;
    try {
      setLoading(true);
      await CartService.removeCoupon(String(cart.id));
      setCouponSuccess('');
      toast.success('Coupon removed successfully');
    } catch (error: any) {
      console.error('Error removing coupon:', error);
      toast.error(error.response?.data?.message || 'Failed to remove coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart?.id || !selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    try {
      setProcessing(true);
      
      // Validate cart one final time before checkout
      await CartService.validateForCheckout();
      
      const checkoutData = {
        payment_method_id: selectedPaymentMethod,
        notes: notes,
        shipping_address: {
          address: "Default Address",
          city: "Default City",
          state: "Default State",
          postal_code: "Default Postal Code",
          country: "Default Country",
          phone: "Default Phone"
        },
        billing_address: {
          address: "Default Address",
          city: "Default City",
          state: "Default State",
          postal_code: "Default Postal Code",
          country: "Default Country",
          phone: "Default Phone"
        }
      };

      const response = await CartService.processCheckout(checkoutData);
      toast.success("Order placed successfully!");
      console.log("Checkout response:", response);

      if (
        response.payment &&
        response.payment.success &&
        response.payment.data &&
        response.payment.data.success
      ) {
        // Check if the payment type is telebirr
        if (response.payment.data.type === "telebirr") {
          const redirectUrl = response.payment.data.data.redirect_url;
          if (redirectUrl) {
            // Redirect to the payment gateway
            // window.location.href = redirectUrl;
              console.log("Redirecting to payment URL:", redirectUrl);
              useAnchorOpen(redirectUrl);
          } else {
            console.error("Redirect URL not found in the payment response.");
          }
        }
      } else {
        console.error("Payment was not successful or missing expected fields.");
      }

      // router.push(`/orders/${response.order.id}/confirmation`);
    } catch (error: any) {
      console.error('Error processing checkout:', error);
      const errorMessage = error.response?.data?.message || "Failed to process checkout";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };


  function useAnchorOpen(link:string) {
    const anchorEle = document.createElement("a");
    anchorEle.setAttribute("href", link);
    anchorEle.setAttribute("target", "_self"); // open on the tab
    anchorEle.setAttribute("rel", "external");
    // Append to body so that the click is properly recognized in some browsers
    document.body.appendChild(anchorEle);
    anchorEle.click();
    // Optionally, remove the element after clicking it
    document.body.removeChild(anchorEle);
  }
  if (loading) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-[#1B4486] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Loading checkout information...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="max-w-3xl mx-auto py-12 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 mr-2" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => router.push('/cart')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </Container>
    );
  }

  if (!cart) {
    return null;
  }

  return (
    <Container>
      <div className="py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <button 
            onClick={() => router.push('/cart')}
            className="flex items-center text-[#1B4486] hover:text-[#153567] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span>Back to Cart</span>
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
        
        <div className="grid grid-cols-12 gap-8">
          {/* Payment Method Selection - 4 columns */}
          <div className="col-span-4">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <CreditCard className="mr-2 text-[#1B4486]" />
                Payment Method
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                {paymentMethods && paymentMethods.length > 0 ? (
                  paymentMethods
                    .filter(method => method.name.toLowerCase() !== 'cash')
                    .map((method) => (
                    <div 
                      key={method.id} 
                      className={`aspect-square border rounded-xl p-4 transition-all cursor-pointer flex flex-col items-center justify-center ${
                        selectedPaymentMethod === String(method.id) 
                          ? 'border-[#1B4486] bg-blue-50 shadow-md ring-2 ring-[#1B4486] ring-opacity-30' 
                          : 'border-gray-200 hover:border-[#1B4486] hover:shadow-sm'
                      }`}
                      onClick={() => !processing && setSelectedPaymentMethod(String(method.id))}
                    >
                      <div className="relative w-full h-full flex flex-col items-center justify-center">
                        {method.logo?.file_path && (
                          <div className="mb-2 w-[85%] h-[85%] flex items-center justify-center">
                            <img 
                              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${method.logo?.file_path}`} 
                              alt={method.name} 
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        )}
                        {method.icon && (
                          <div className="mb-2 w-[85%] h-[85%] flex items-center justify-center">
                            <img 
                              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${method.icon}`} 
                              alt={method.name} 
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        )}
                        <span className="font-medium text-center text-sm">{method.name}</span>
                        
                        {/* Checkbox indicator */}
                        <div className={`absolute top-3 right-3 h-5 w-5 rounded-full border flex items-center justify-center ${
                          selectedPaymentMethod === String(method.id) 
                            ? 'border-[#1B4486] bg-[#1B4486]' 
                            : 'border-gray-400'
                        }`}>
                          {selectedPaymentMethod === String(method.id) && (
                            <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500 col-span-2">
                    No payment methods available
                  </div>
                )}
              </div>

              {/* Order Notes */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Order Notes</h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B4486] focus:border-[#1B4486] transition-all"
                  rows={4}
                  placeholder="Add any special instructions for your order (optional)"
                  disabled={processing}
                />
              </div>

              {/* Place Order Button */}
              <button
                onClick={handleCheckout}
                disabled={processing || !selectedPaymentMethod}
                className={`w-full mt-6 py-4 rounded-lg font-medium text-white transition-all ${
                  processing || !selectedPaymentMethod
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#1B4486] hover:bg-[#153567] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                {processing ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    <span>Processing Your Order...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>Place Order</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Order Summary - 8 columns */}
          <div className="col-span-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <ShoppingBag className="mr-2 text-[#1B4486]" />
                Order Summary
              </h2>

              {/* Order Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600">Product</th>
                      <th className="py-4 px-4 text-right text-sm font-semibold text-gray-600">Unit Price</th>
                      <th className="py-4 px-4 text-right text-sm font-semibold text-gray-600">Quantity</th>
                      <th className="py-4 px-4 text-right text-sm font-semibold text-gray-600">Discount</th>
                      <th className="py-4 px-4 text-right text-sm font-semibold text-gray-600">Tax</th>
                      <th className="py-4 px-4 text-right text-sm font-semibold text-gray-600">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart?.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${item.product_store.product.thumbnail.file_path}`}
                                alt={item.product_store.product.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="ml-4">
                              <h3 className="font-medium text-gray-900">{item.product_store.product.name}</h3>
                              <p className="text-sm text-gray-500">SKU: {item.product_store.product.SKU}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">{formatPrice(item.price)}</td>
                        <td className="py-4 px-4 text-right">{item.quantity}</td>
                        <td className="py-4 px-4 text-right text-green-600">-{formatPrice(item.discount)}</td>
                        <td className="py-4 px-4 text-right">{formatPrice(item.tax_amount)}</td>
                        <td className="py-4 px-4 text-right font-medium">{formatPrice(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Coupon Section */}
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-medium mb-3">Apply Coupon</h3>
                <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B4486] focus:border-[#1B4486] transition-all"
                    placeholder="Enter coupon code"
                    disabled={loading || processing}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                    disabled={loading || processing}
                  >
                    Apply
                  </button>
                </form>
                {couponError && (
                  <p className="text-red-500 text-sm">{couponError}</p>
                )}
                {couponSuccess && (
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-green-500 text-sm">{couponSuccess}</p>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-500 text-sm hover:text-red-600 transition-colors"
                      disabled={loading || processing}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Order Totals */}
              <div className="mt-6 border-t pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Items Subtotal:</span>
                    <span className="font-medium">{formatPrice(cart?.total_amount || 0)}</span>
                  </div>
                  {Number(cart?.discount_amount || 0) > 0 && (
                    <div className="flex justify-between text-base text-green-600">
                      <span>Product Discounts:</span>
                      <span>-{formatPrice(cart?.discount_amount || 0)}</span>
                    </div>
                  )}
                  {Number(cart?.coupon_discount_amount || 0) > 0 && (
                    <div className="flex justify-between text-base text-green-600">
                      <span>Coupon Discount:</span>
                      <span>-{formatPrice(cart?.coupon_discount_amount || 0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Tax Amount:</span>
                    <span className="font-medium">{formatPrice(cart?.tax_amount || 0)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-3 mt-3">
                    <span>Total Amount:</span>
                    <span className="text-[#1B4486]">{formatPrice(cart?.grand_total || 0)}</span>
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