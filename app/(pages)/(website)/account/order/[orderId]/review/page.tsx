"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, ArrowLeft, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductReview {
  orderId: string;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
}

export default function RateProductPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  
  const [review, setReview] = useState<ProductReview>({
    orderId,
    productName: "",
    productImage: "",
    rating: 0,
    comment: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data - in a real app, this would come from an API
        setReview({
          orderId,
          productName: "Nike Air Max 270",
          productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          rating: 0,
          comment: "",
        });
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleRatingChange = (rating: number) => {
    setReview({ ...review, rating });
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview({ ...review, comment: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would submit the review to an API
      console.log('Review submitted:', review);
      
      // Redirect back to order history
      router.push('/account/order');
    } catch (error) {
      console.error('Error submitting review:', error);
      setSubmitting(false);
    }
  };

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
            <h1 className="text-2xl font-semibold text-gray-800">Rate Product</h1>
            <p className="text-sm text-gray-500 mt-1">Share your experience with this product</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Order #{review.orderId}</h2>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img 
                  src={review.productImage} 
                  alt={review.productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-800">{review.productName}</h3>
            </div>
            
            <div className="w-full md:w-2/3">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none"
                      >
                        <Star 
                          className={cn(
                            "w-8 h-8 transition-colors duration-200",
                            (hoverRating || review.rating) >= star 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300"
                          )} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    rows={5}
                    value={review.comment}
                    onChange={handleCommentChange}
                    placeholder="Share your experience with this product..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting || review.rating === 0}
                    className={cn(
                      "inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all duration-200",
                      review.rating === 0 || submitting
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
                        <span>Submit Review</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 