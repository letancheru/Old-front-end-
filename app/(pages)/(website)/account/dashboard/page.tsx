"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Truck, ShoppingBag, Heart, Package, Clock, CheckCircle, PackageCheck, LayoutDashboard, Eye, Star } from "lucide-react";
import { OrderResponse } from "@/components/service/OrderService";
import axios from "axios";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  pickedUpOrders: number;
  totalWishlist: number;
  totalCart: number;
}

interface RecentOrder {
  id: number;
  orderNumber: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  status: string;
  orderDate: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    pickedUpOrders: 0,
    totalWishlist: 0,
    totalCart: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log("Starting to fetch dashboard data...");
        
        // Direct API call instead of using OrderService
        console.log("Making direct API call to fetch orders...");
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error("No authentication token found");
          toast.error("Authentication required");
          setLoading(false);
          return;
        }
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/orders`, {
          params: { page: 1, per_page: 10 },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        console.log("API Response:", response.data);
        
        // Process orders to get stats
        const orders = response.data.data;
        console.log("Orders Data:", JSON.stringify(orders, null, 2));
        
        if (!orders || orders.length === 0) {
          console.log("No orders found in the response");
          setStats({
            totalOrders: 0,
            pendingOrders: 0,
            processingOrders: 0,
            completedOrders: 0,
            pickedUpOrders: 0,
            totalWishlist: 0,
            totalCart: 0,
          });
          setRecentOrders([]);
          setLoading(false);
          return;
        }
        
        console.log(`Found ${orders.length} orders`);
        
        const pendingOrders = orders.filter((order: any) => order.order_status === 'pending').length;
        const processingOrders = orders.filter((order: any) => order.order_status === 'processing').length;
        const completedOrders = orders.filter((order: any) => order.order_status === 'completed').length;
        const pickedUpOrders = orders.filter((order: any) => order.order_status === 'picked_up').length;
        
        console.log("Order counts:", {
          pending: pendingOrders,
          processing: processingOrders,
          completed: completedOrders,
          pickedUp: pickedUpOrders
        });
        
        // Transform orders to recent orders format
        console.log("Transforming orders to recent orders format...");
        const recentOrdersData: RecentOrder[] = orders.map((order: any) => {
          console.log(`Processing order ${order.id}:`, order);
          
          // Get the first item for display
          const firstItem = order.items && order.items.length > 0 ? order.items[0] : { 
            product_store: { product: { name: 'Multiple Items' } },
            unit_price: '0',
            quantity: 0
          };
          
          console.log(`First item for order ${order.id}:`, firstItem);
          
          const transformedOrder = {
            id: order.id,
            orderNumber: order.order_number,
            productName: firstItem.product_store?.product?.name || 'Unknown Product',
            unitPrice: parseFloat(firstItem.unit_price || '0'),
            quantity: firstItem.quantity || 0,
            status: order.order_status,
            orderDate: order.created_at
          };
          
          console.log(`Transformed order ${order.id}:`, transformedOrder);
          return transformedOrder;
        });
        
        console.log("Recent Orders Data:", JSON.stringify(recentOrdersData, null, 2));
        
        // Set stats
        const newStats = {
          totalOrders: response.data.total || 0,
          pendingOrders,
          processingOrders,
          completedOrders,
          pickedUpOrders,
          totalWishlist: 0, // These would come from different services
          totalCart: 0,
        };
        
        console.log("Setting stats:", newStats);
        setStats(newStats);
        
        // Set recent orders
        console.log("Setting recent orders:", recentOrdersData);
        setRecentOrders(recentOrdersData);
        
        console.log("Dashboard data fetching completed successfully");
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'picked_up':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: Package,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      gradientFrom: "from-blue-50",
      gradientTo: "to-blue-100/30",
      link: "/account/order",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
      gradientFrom: "from-yellow-50",
      gradientTo: "to-yellow-100/30",
      link: "/account/order?status=pending",
    },
    {
      title: "Processing Orders",
      value: stats.processingOrders,
      icon: Truck,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      gradientFrom: "from-emerald-50",
      gradientTo: "to-emerald-100/30",
      link: "/account/order?status=processing",
    },
    {
      title: "Completed Orders",
      value: stats.completedOrders,
      icon: CheckCircle,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
      gradientFrom: "from-green-50",
      gradientTo: "to-green-100/30",
      link: "/account/order?status=completed",
    },
    {
      title: "Picked Up Orders",
      value: stats.pickedUpOrders,
      icon: PackageCheck,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
      gradientFrom: "from-purple-50",
      gradientTo: "to-purple-100/30",
      link: "/account/order?status=picked_up",
    },
    {
      title: "Total Wishlist",
      value: stats.totalWishlist,
      icon: Heart,
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
      gradientFrom: "from-red-50",
      gradientTo: "to-red-100/30",
      link: "/account/wishlist",
    },
    {
      title: "Total Cart",
      value: stats.totalCart,
      icon: ShoppingBag,
      iconColor: "text-[#F1356D]",
      bgColor: "bg-pink-50",
      gradientFrom: "from-pink-50",
      gradientTo: "to-pink-100/30",
      link: "/cart",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Welcome to your account dashboard</p>
        </div>
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gray-50 flex items-center justify-center">
          <LayoutDashboard className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {statCards.map((card, index) => (
          <Link
            href={card.link}
            key={index}
            className="group bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg overflow-hidden"
          >
            <div className="p-3 md:p-6">
              <div className="flex items-center gap-2 md:gap-4">
                <div className={cn(
                  "p-2 md:p-3 rounded-lg transition-all duration-300",
                  card.bgColor
                )}>
                  <card.icon className={cn("w-4 h-4 md:w-6 md:h-6", card.iconColor)} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-2xl font-semibold text-gray-800">{card.value}</h3>
                  <p className="text-xs md:text-sm text-gray-500">{card.title}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100">
          <h2 className="text-base md:text-lg font-semibold text-gray-800">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-gray-500">Order ID</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-gray-500 hidden sm:table-cell">Product Name</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-gray-500 hidden md:table-cell">Unit Price</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-gray-500">Quantity</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-gray-500">Status</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-gray-500 hidden sm:table-cell">Date</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-right text-xs md:text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900">#{order.orderNumber}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900 hidden sm:table-cell">{order.productName}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900 hidden md:table-cell">{formatPrice(order.unitPrice)}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900">{order.quantity}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                      getStatusColor(order.status)
                    )}>
                      {order.status.replace('_', ' ').charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900 hidden sm:table-cell">{formatDate(order.orderDate)}</td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-right space-x-2">
                    <Link
                      href={`/account/order/${order.id}`}
                      className="inline-flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    {order.status === 'completed' && (
                      <Link
                        href={`/account/order/${order.id}/review`}
                        className="inline-flex items-center text-gray-400 hover:text-yellow-500 transition-colors duration-200"
                      >
                        <Star className="w-4 h-4" />
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 md:px-6 py-6 md:py-8 text-center text-xs md:text-sm text-gray-500">
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
