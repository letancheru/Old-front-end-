"use client";

import { useState } from 'react';
import DebugService from '@/components/service/DebugService';
import { Cart } from '@/components/service/CartService';

export default function ServiceTester() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const testServices = async () => {
    setLoading(true);
    try {
      // Test getCart
      const cartResponse = await DebugService.getCart();
      setResponse({ method: 'getCart', ...cartResponse });

      // Test getSessionCart
      const sessionCartResponse = await DebugService.getSessionCart();
      setResponse({ method: 'getSessionCart', ...sessionCartResponse });

      // Test addToCart
      const addToCartResponse = await DebugService.addToCart(1, 1);
      setResponse({ method: 'addToCart', ...addToCartResponse });

      // Test updateCartItem
      const updateCartResponse = await DebugService.updateCartItem(1, 2);
      setResponse({ method: 'updateCartItem', ...updateCartResponse });

      // Test applyCoupon
      const applyCouponResponse = await DebugService.applyCoupon('1', 'TEST10');
      setResponse({ method: 'applyCoupon', ...applyCouponResponse });

      // Test removeCoupon
      const removeCouponResponse = await DebugService.removeCoupon('1');
      setResponse({ method: 'removeCoupon', ...removeCouponResponse });

      // Test validateCart
      const validateCartResponse = await DebugService.validateCart();
      setResponse({ method: 'validateCart', ...validateCartResponse });

      // Test validateForCheckout
      const validateCheckoutResponse = await DebugService.validateForCheckout();
      setResponse({ method: 'validateForCheckout', ...validateCheckoutResponse });

      // Test removeCartItem
      const removeItemResponse = await DebugService.removeCartItem(1);
      setResponse({ method: 'removeCartItem', ...removeItemResponse });

    } catch (error: any) {
      setResponse({
        error: true,
        message: error.message,
        response: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Service Tester</h1>
      <button
        onClick={testServices}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {loading ? 'Testing Services...' : 'Test Services'}
      </button>

      {response && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Response:</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p className="font-bold">Method: {response.method}</p>
            <p className="font-bold">Status: {response.error ? 'Error' : 'Success'}</p>
            {response.message && (
              <p className="text-red-500">{response.message}</p>
            )}
            <pre className="mt-2 whitespace-pre-wrap">
              {JSON.stringify(response.response, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Expected Cart Response Structure:</h2>
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
{`{
  "message": "Product added to cart successfully",
  "cart": {
    "id": "string",
    "items": [
      {
        "id": number,
        "product": {
          "id": number,
          "name": "string",
          "thumbnail": {
            "id": number,
            "file_name": "string",
            "file_path": "string"
          }
        },
        "price": "string",
        "quantity": number,
        "subtotal": "string",
        "discount": "string",
        "tax_rate": number,
        "tax_amount": "string"
      }
    ],
    "total_amount": "string",
    "discount_amount": "string",
    "tax_amount": "string",
    "grand_total": "string"
  }
}`}
        </pre>
      </div>
    </div>
  );
} 