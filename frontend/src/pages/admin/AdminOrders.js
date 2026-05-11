import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const { getAuthHeader } = useAuthStore();

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, statusFilter, paymentFilter]);

  const filterOrders = () => {
    let filtered = orders;
    if (statusFilter !== "All") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }
    if (paymentFilter !== "All") {
      filtered = filtered.filter((o) => o.paymentStatus === paymentFilter);
    }
    setFilteredOrders(filtered);
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders", {
        headers: getAuthHeader(),
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status, paymentStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}`,
        { status, paymentStatus },
        { headers: getAuthHeader() },
      );
      toast.success("Order updated successfully");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update order");
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      Pending: "bg-yellow-100 text-yellow-800",
      Confirmed: "bg-blue-100 text-blue-800",
      Shipped: "bg-purple-100 text-purple-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return map[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentBadge = (status) => {
    const map = {
      Completed: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Failed: "bg-red-100 text-red-800",
    };
    return map[status] || "bg-gray-100 text-gray-800";
  };

  // Summary counts
  const paidCount = orders.filter(
    (o) => o.paymentStatus === "Completed",
  ).length;
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const confirmedCount = orders.filter((o) => o.status === "Confirmed").length;
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Completed")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-8">Manage Orders</h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-yellow-400">
            <p className="text-xs text-gray-500 uppercase">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-400">
            <p className="text-xs text-gray-500 uppercase">Confirmed</p>
            <p className="text-2xl font-bold text-blue-600">{confirmedCount}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-400">
            <p className="text-xs text-gray-500 uppercase">Paid Orders</p>
            <p className="text-2xl font-bold text-green-600">{paidCount}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-black">
            <p className="text-xs text-gray-500 uppercase">Revenue Collected</p>
            <p className="text-2xl font-bold text-black">₹{totalRevenue}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Order Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Payment Status
              </label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              >
                <option value="All">All Payments</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center text-gray-500 shadow-md">
            No orders found for the selected filters.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                {/* Header row */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-start">
                    <div>
                      <p className="text-xs text-gray-500">Order ID</p>
                      <p className="font-mono font-semibold text-black text-xs break-all">
                        {order._id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Customer</p>
                      <p className="font-semibold text-black">
                        {order.user?.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.user?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="font-bold text-black text-lg">
                        ₹{order.totalAmount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="font-semibold text-black text-sm">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold text-center ${getStatusBadge(order.status)}`}
                      >
                        {order.status}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold text-center ${getPaymentBadge(order.paymentStatus)}`}
                      >
                        💳 {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Razorpay payment info */}
                {order.razorpayPaymentId && (
                  <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 text-xs">
                    <p className="font-semibold text-green-700 mb-1">
                      ✅ Razorpay Payment Verified
                    </p>
                    <p className="text-green-600">
                      <span className="font-medium">Payment ID:</span>{" "}
                      {order.razorpayPaymentId}
                    </p>
                    <p className="text-green-600">
                      <span className="font-medium">Order ID:</span>{" "}
                      {order.razorpayOrderId}
                    </p>
                  </div>
                )}

                {/* Items */}
                <div className="mb-4">
                  <h3 className="font-semibold text-black mb-2 text-sm">
                    Items
                  </h3>
                  <div className="space-y-1">
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between text-gray-600 text-sm"
                      >
                        <span>
                          {item.cracker?.name} × {item.quantity}
                        </span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Admin Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Update Order Status
                    </label>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(
                          order._id,
                          e.target.value,
                          order.paymentStatus,
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Update Payment Status
                    </label>
                    <select
                      value={order.paymentStatus}
                      onChange={(e) =>
                        updateOrderStatus(
                          order._id,
                          order.status,
                          e.target.value,
                        )
                      }
                      className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-black ${
                        order.paymentStatus === "Completed"
                          ? "border-green-400 bg-green-50"
                          : "border-gray-300"
                      }`}
                      disabled={
                        order.paymentMethod === "Razorpay" &&
                        order.paymentStatus === "Completed"
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Failed">Failed</option>
                    </select>
                    {order.paymentMethod === "Razorpay" &&
                      order.paymentStatus === "Completed" && (
                        <p className="text-xs text-green-600 mt-1">
                          🔒 Auto-verified by Razorpay
                        </p>
                      )}
                  </div>
                </div>

                {/* Shipping & Payment */}
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Shipping Address</p>
                    <p className="text-black">
                      {order.shippingAddress?.fullName}
                      <br />
                      {order.shippingAddress?.address},{" "}
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state} -{" "}
                      {order.shippingAddress?.zipCode}
                    </p>
                    <p className="text-gray-500 mt-1">
                      📞 {order.shippingAddress?.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Payment Method</p>
                    <p className="text-black font-medium">
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
