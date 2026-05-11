import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useAuthStore } from "../../store/authStore";
import LoadingSpinner from "../../components/LoadingSpinner";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getAuthHeader } = useAuthStore();

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/orders/user/my-orders",
        {
          headers: getAuthHeader(),
        },
      );
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    Swal.fire({
      title: "Cancel Order?",
      text: "Are you sure you want to cancel this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#dc2626",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(
            `http://localhost:5000/api/orders/${orderId}/cancel`,
            {},
            { headers: getAuthHeader() },
          );
          fetchOrders();
          toast.success("Order cancelled successfully");
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Failed to cancel order",
          );
        }
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Confirmed":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return "⏳";
      case "Confirmed":
        return "✅";
      case "Shipped":
        return "🚚";
      case "Delivered":
        return "📦";
      case "Cancelled":
        return "❌";
      default:
        return "•";
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-500 mb-8">
          {orders.length} order{orders.length !== 1 ? "s" : ""} placed
        </p>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-600">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Order ID
                      </p>
                      <p className="font-mono font-semibold text-black text-sm">
                        {order._id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Date
                      </p>
                      <p className="font-semibold text-black">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Total
                      </p>
                      <p className="font-bold text-black text-lg">
                        ₹{order.totalAmount}
                      </p>
                    </div>
                    {/* Order Status */}
                    <div className="flex flex-col gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)} {order.status}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold text-center ${getPaymentStatusColor(order.paymentStatus)}`}
                      >
                        💳 {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="px-6 py-6">
                  <h3 className="font-semibold text-black mb-4">
                    Items Ordered
                  </h3>
                  <div className="space-y-3 mb-4">
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center border-b pb-3"
                      >
                        <div>
                          <p className="font-medium text-black">
                            {item.cracker?.name || "Product"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <p className="font-semibold text-black">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Payment Method</p>
                      <p className="text-black">{order.paymentMethod}</p>
                      {order.razorpayPaymentId && (
                        <p className="text-xs text-gray-400 mt-1 font-mono">
                          TXN: {order.razorpayPaymentId}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Payment Status</p>
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-bold ${getPaymentStatusColor(order.paymentStatus)}`}
                      >
                        {order.paymentStatus === "Completed"
                          ? "✅ Paid"
                          : order.paymentStatus === "Failed"
                            ? "❌ Failed"
                            : "⏳ Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wide">
                      Order Progress
                    </p>
                    <div className="flex items-center gap-1">
                      {["Pending", "Confirmed", "Shipped", "Delivered"].map(
                        (step, i) => {
                          const statusOrder = [
                            "Pending",
                            "Confirmed",
                            "Shipped",
                            "Delivered",
                          ];
                          const currentIndex = statusOrder.indexOf(
                            order.status,
                          );
                          const stepIndex = statusOrder.indexOf(step);
                          const isDone =
                            order.status !== "Cancelled" &&
                            stepIndex <= currentIndex;
                          const isCurrent =
                            stepIndex === currentIndex &&
                            order.status !== "Cancelled";

                          return (
                            <React.Fragment key={step}>
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                                    isDone
                                      ? "bg-black border-black text-white"
                                      : "bg-white border-gray-300 text-gray-400"
                                  } ${isCurrent ? "ring-2 ring-offset-1 ring-black" : ""}`}
                                >
                                  {isDone ? "✓" : i + 1}
                                </div>
                                <span
                                  className={`text-xs mt-1 hidden sm:block ${isDone ? "text-black font-semibold" : "text-gray-400"}`}
                                >
                                  {step}
                                </span>
                              </div>
                              {i < 3 && (
                                <div
                                  className={`flex-1 h-0.5 mb-4 ${
                                    order.status !== "Cancelled" &&
                                    currentIndex > i
                                      ? "bg-black"
                                      : "bg-gray-200"
                                  }`}
                                />
                              )}
                            </React.Fragment>
                          );
                        },
                      )}
                      {order.status === "Cancelled" && (
                        <span className="ml-4 text-xs text-red-600 font-semibold">
                          ❌ Cancelled
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cancel button — only for Pending or Confirmed, not Razorpay paid */}
                  {["Pending", "Confirmed"].includes(order.status) &&
                    order.paymentMethod === "Cash on Delivery" && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="mt-6 px-6 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 transition font-semibold text-sm"
                      >
                        Cancel Order
                      </button>
                    )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
