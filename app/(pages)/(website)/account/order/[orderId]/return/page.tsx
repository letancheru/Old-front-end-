"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send, Upload, X, Plus, Minus } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { OrderService, ReturnRequestData } from "@/components/service/OrderService";
import { toast } from "react-hot-toast";

interface OrderItem {
  id: number;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
}

interface ReturnItem {
  orderItemId: number;
  quantity: number;
  condition: string;
  reason: string;
  refundAmount: number;
}

interface ReturnRequest {
  orderId: number;
  items: OrderItem[];
  returnItems: ReturnItem[];
  description: string;
  images: File[];
  imagesPreview: string[];
}

export default function ReturnRequestPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = parseInt(params.orderId as string);
  
  const [request, setRequest] = useState<ReturnRequest>({
    orderId,
    items: [],
    returnItems: [],
    description: "",
    images: [],
    imagesPreview: [],
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await OrderService.getOrderById(orderId.toString());
        
        if (response.data && response.data.length > 0) {
          const order = response.data[0];
          
          // Transform order items to match our interface
          const orderItems: OrderItem[] = order.items.map(item => ({
            id: item.id,
            productName: item.product_store.product.name,
            productImage: "https://via.placeholder.com/150",
            unitPrice: parseFloat(item.unit_price),
            quantity: item.quantity,
          }));
          
          setRequest({
            orderId,
            items: orderItems,
            returnItems: orderItems.map(item => ({
              orderItemId: item.id,
              quantity: 0,
              condition: "",
              reason: "",
              refundAmount: 0
            })),
            description: "",
            images: [],
            imagesPreview: [],
          });
        } else {
          toast.error("Order not found");
          router.push('/account/order');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error("Failed to load order details");
        router.push('/account/order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, router]);

  const handleItemQuantityChange = (itemId: number, change: number) => {
    setRequest(prev => ({
      ...prev,
      returnItems: prev.returnItems.map(item => {
        if (item.orderItemId === itemId) {
          const newQuantity = Math.max(0, Math.min(
            prev.items.find(i => i.id === itemId)?.quantity || 0,
            item.quantity + change
          ));
          return {
            ...item,
            quantity: newQuantity,
            refundAmount: newQuantity * (prev.items.find(i => i.id === itemId)?.unitPrice || 0)
          };
        }
        return item;
      })
    }));
  };

  const handleItemConditionChange = (itemId: number, condition: string) => {
    setRequest(prev => ({
      ...prev,
      returnItems: prev.returnItems.map(item => {
        if (item.orderItemId === itemId) {
          return { ...item, condition };
        }
        return item;
      })
    }));
  };

  const handleItemReasonChange = (itemId: number, reason: string) => {
    setRequest(prev => ({
      ...prev,
      returnItems: prev.returnItems.map(item => {
        if (item.orderItemId === itemId) {
          return { ...item, reason };
        }
        return item;
      })
    }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRequest({ ...request, description: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      
      setRequest({
        ...request,
        images: [...request.images, ...newFiles],
        imagesPreview: [...request.imagesPreview, ...newPreviews],
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...request.images];
    const newPreviews = [...request.imagesPreview];
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setRequest({
      ...request,
      images: newImages,
      imagesPreview: newPreviews,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Filter out items with quantity > 0
      const validReturnItems = request.returnItems.filter(item => item.quantity > 0);
      
      if (validReturnItems.length === 0) {
        toast.error("Please select at least one item to return");
        setSubmitting(false);
        return;
      }
      
      // Prepare data for API
      const returnRequestData: ReturnRequestData = {
        order_id: request.orderId,
        reason: request.description,
        items: validReturnItems.map(item => ({
          order_item_id: item.orderItemId,
          quantity: item.quantity,
          condition: item.condition,
          reason: item.reason
        }))
      };
      
      // Submit return request
      await OrderService.requestReturn(returnRequestData);
      
      toast.success("Return request submitted successfully");
      
      // Redirect back to order history
      router.push('/account/order');
    } catch (error) {
      console.error('Error submitting return request:', error);
      toast.error("Failed to submit return request");
      setSubmitting(false);
    }
  };

  const hasValidItems = request.returnItems.some(item => 
    item.quantity > 0 && item.condition && item.reason
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Return Request</h1>
            <p className="text-sm text-gray-500 mt-1">Submit a request to return items from this order</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Order #{request.orderId}</h2>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Order Items */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-800">Select Items to Return</h3>
              {request.items.map((item, index) => {
                const returnItem = request.returnItems.find(ri => ri.orderItemId === item.id);
                if (!returnItem) return null;

                return (
                  <div key={item.id} className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <div className="flex gap-6">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={item.productImage} 
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.productName}</h4>
                        <p className="text-sm text-gray-500">Unit Price: {formatPrice(item.unitPrice)}</p>
                        <p className="text-sm text-gray-500">Original Quantity: {item.quantity}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Quantity Selector */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Return Quantity
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleItemQuantityChange(item.id, -1)}
                            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                            disabled={returnItem.quantity <= 0}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-medium">{returnItem.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleItemQuantityChange(item.id, 1)}
                            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                            disabled={returnItem.quantity >= item.quantity}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Condition Selector */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Item Condition
                        </label>
                        <select
                          value={returnItem.condition}
                          onChange={(e) => handleItemConditionChange(item.id, e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          required={returnItem.quantity > 0}
                        >
                          <option value="">Select condition</option>
                          <option value="new">New/Unused</option>
                          <option value="like_new">Like New</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="poor">Poor</option>
                        </select>
                      </div>

                      {/* Reason Selector */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Return Reason
                        </label>
                        <select
                          value={returnItem.reason}
                          onChange={(e) => handleItemReasonChange(item.id, e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          required={returnItem.quantity > 0}
                        >
                          <option value="">Select reason</option>
                          <option value="wrong_size">Wrong Size</option>
                          <option value="damaged">Product Damaged</option>
                          <option value="not_as_described">Not As Described</option>
                          <option value="changed_mind">Changed Mind</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    {returnItem.quantity > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-600">
                          Estimated Refund Amount: <span className="font-medium text-gray-900">{formatPrice(returnItem.refundAmount)}</span>
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-800">Additional Information</h3>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={request.description}
                  onChange={handleDescriptionChange}
                  placeholder="Please provide any additional details about your return request..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images (Optional)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                  {request.imagesPreview.map((preview, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={preview} 
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-white/80 text-gray-600 hover:bg-white hover:text-gray-900 transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {request.imagesPreview.length < 4 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-gray-50 transition-colors duration-200">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        multiple
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  You can upload up to 4 images. Supported formats: JPG, PNG. Max size: 5MB per image.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !hasValidItems}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all duration-200",
                  !hasValidItems || submitting
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90"
                )}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 