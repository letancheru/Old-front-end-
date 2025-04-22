"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, Star, ArrowLeft, ArrowRight, Package, Clock, CheckCircle, PackageCheck, Truck, Download } from "lucide-react";
import { OrderService, OrderResponse } from "@/components/service/OrderService";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface Order {
  id: number;
  orderNumber: string;
  totalAmount: string;
  status: string;
  orderDate: string;
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: string;
  subtotal: string;
}

export default function OrderHistory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "";
  const page = parseInt(searchParams.get("page") || "1");
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string>(status);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        per_page: 10,
        status: selectedStatus || undefined
      };
      const response = await OrderService.getAllOrders(params);
      
      const transformedOrders = response.data.map(order => ({
        id: order.id,
        orderNumber: order.order_number,
        totalAmount: order.grand_total,
        status: order.order_status,
        orderDate: order.created_at,
        items: order.items.map(item => ({
          id: item.id,
          productName: item.product_store.product.name,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          subtotal: item.subtotal
        }))
      }));

      setOrders(transformedOrders);
      setTotalPages(response.last_page);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      picked_up: 'bg-purple-100 text-purple-800'
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'processing':
        return Truck;
      case 'completed':
        return CheckCircle;
      case 'picked_up':
        return PackageCheck;
      default:
        return Package;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
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
          <Link 
            href="/account/dashboard"
            className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Order History</h1>
            <p className="text-sm text-gray-500 mt-1">View and manage your orders</p>
          </div>
        </div>
      </div>

      {/* Status Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 flex flex-wrap gap-2">
          <button
            onClick={() => handleStatusFilter('')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
              !selectedStatus 
                ? "bg-primary text-white" 
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            )}
          >
            All Orders
          </button>
          {['pending', 'processing', 'completed', 'cancelled', 'picked_up'].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                selectedStatus === status
                  ? "bg-gray-900 text-white"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      getStatusColor(order.status).split(' ')[1]
                    )}>
                      <StatusIcon className={cn(
                        "w-5 h-5",
                        getStatusColor(order.status).split(' ')[0]
                      )} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Order #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      getStatusColor(order.status)
                    )}>
                      {order.status.replace('_', ' ').charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="font-medium text-gray-800">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-3 p-3 rounded-lg bg-gray-50">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                          <img 
                            src={item.productImage} 
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{item.productName}</h4>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          <p className="text-sm font-medium text-gray-800">{formatCurrency(item.unitPrice)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
                  <Link
                    href={`/account/order/${order.id}`}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </Link>
                  {order.status === 'completed' && (
                    <Link
                      href={`/account/order/${order.id}/review`}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-yellow-600 bg-yellow-50 hover:bg-yellow-100 transition-colors duration-200"
                    >
                      <Star className="w-4 h-4" />
                      <span>Rate Product</span>
                    </Link>
                  )}
                  <button
                    onClick={() => OrderService.downloadInvoice(order.id)}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Invoice</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-1">No Orders Found</h3>
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors duration-200"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {orders.length > 0 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalPages * 10)} of {totalPages * 10} orders
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={cn(
                "p-2 rounded-lg transition-colors duration-200",
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-sm font-medium transition-colors duration-200",
                    pageNum === currentPage
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={cn(
                "p-2 rounded-lg transition-colors duration-200",
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// export const metadata: Metadata = {
//   title: "Profil - Account",
//   description: "Become a full stack Nextjs with this project",
//   icons: {
//     icon: "/assets/images/logo.svg",
//   },
// };
