import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";

const checkoutSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
});

// ── Mock Razorpay Popup ────────────────────────────────────
const MockRazorpayPopup = ({ amount, onSuccess, onClose }) => {
  const [step, setStep] = useState("form"); // form | processing | success
  const [payTab, setPayTab] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upi, setUpi] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

  const formatCard = (val) =>
    val
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .slice(0, 19);

  const formatExpiry = (val) => {
    let v = val.replace(/\D/g, "");
    if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2, 4);
    return v;
  };

  const handlePay = () => {
    if (payTab === "card") {
      if (cardNumber.replace(/\s/g, "").length < 16) {
        toast.error("Enter a valid 16-digit card number");
        return;
      }
      if (expiry.length < 5) {
        toast.error("Enter a valid expiry (MM/YY)");
        return;
      }
      if (cvv.length < 3) {
        toast.error("Enter a valid CVV");
        return;
      }
    } else if (payTab === "upi") {
      if (!upi.includes("@")) {
        toast.error("Enter a valid UPI ID like success@razorpay");
        return;
      }
    } else {
      if (!selectedBank) {
        toast.error("Please select a bank");
        return;
      }
    }

    setStep("processing");
    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        const fakePaymentId =
          "pay_" + Math.random().toString(36).substr(2, 14).toUpperCase();
        const fakeOrderId =
          "order_" + Math.random().toString(36).substr(2, 14).toUpperCase();
        const fakeSig = Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16),
        ).join("");
        onSuccess({ fakePaymentId, fakeOrderId, fakeSig });
      }, 1500);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#072654] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full w-9 h-9 flex items-center justify-center shadow">
              <span className="text-[#072654] font-black text-sm">R✦</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">
                Crackers Store
              </p>
              <p className="text-blue-200 text-xs">
                Secured Payment · Test Mode
              </p>
            </div>
          </div>
          {step === "form" && (
            <button
              onClick={onClose}
              className="text-blue-300 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-900 transition"
            >
              ✕
            </button>
          )}
        </div>

        {/* Amount bar */}
        {step === "form" && (
          <div className="bg-blue-900 px-5 py-2 flex items-center justify-between">
            <span className="text-blue-200 text-xs">Amount to pay</span>
            <span className="text-white font-bold text-lg">₹{amount}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Processing */}
          {step === "processing" && (
            <motion.div
              key="proc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-6 py-14 flex flex-col items-center gap-4"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 rounded-full" />
                <div className="w-16 h-16 border-4 border-[#072654] border-t-transparent rounded-full animate-spin absolute inset-0" />
              </div>
              <p className="text-gray-800 font-semibold text-sm">
                Processing your payment...
              </p>
              <p className="text-gray-400 text-xs text-center">
                Communicating with bank. Please wait.
              </p>
            </motion.div>
          )}

          {/* Success */}
          {step === "success" && (
            <motion.div
              key="succ"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-6 py-12 flex flex-col items-center gap-3"
            >
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl shadow-lg"
              >
                ✓
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-bold text-gray-800"
              >
                Payment Successful!
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-500 text-sm"
              >
                ₹{amount} debited successfully
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-xs text-gray-400"
              >
                Redirecting to order confirmation...
              </motion.p>
            </motion.div>
          )}

          {/* Payment Form */}
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Tabs */}
              <div className="flex border-b border-gray-100">
                {[
                  { id: "card", label: "💳 Card" },
                  { id: "upi", label: "📱 UPI" },
                  { id: "netbanking", label: "🏦 Net Banking" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setPayTab(tab.id)}
                    className={`flex-1 py-3 text-xs font-semibold transition border-b-2 ${
                      payTab === tab.id
                        ? "border-[#072654] text-[#072654] bg-blue-50"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="px-5 py-5 space-y-4">
                {/* Card */}
                {payTab === "card" && (
                  <>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                      <p className="font-bold mb-1">
                        🧪 Test Card (copy & paste)
                      </p>
                      <p>
                        No:{" "}
                        <b className="font-mono select-all">
                          4111 1111 1111 1111
                        </b>
                      </p>
                      <p>
                        Expiry: <b>12/26</b> &nbsp; CVV: <b>123</b>
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-1">
                        Card Number
                      </label>
                      <input
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(formatCard(e.target.value))
                        }
                        placeholder="4111 1111 1111 1111"
                        maxLength={19}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#072654] focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 font-medium block mb-1">
                          Expiry (MM/YY)
                        </label>
                        <input
                          value={expiry}
                          onChange={(e) =>
                            setExpiry(formatExpiry(e.target.value))
                          }
                          placeholder="12/26"
                          maxLength={5}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#072654] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 font-medium block mb-1">
                          CVV
                        </label>
                        <input
                          value={cvv}
                          onChange={(e) =>
                            setCvv(
                              e.target.value.replace(/\D/g, "").slice(0, 3),
                            )
                          }
                          placeholder="123"
                          maxLength={3}
                          type="password"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#072654] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* UPI */}
                {payTab === "upi" && (
                  <>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                      <p className="font-bold mb-1">🧪 Test UPI ID</p>
                      <p>
                        <b className="font-mono select-all">success@razorpay</b>
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-1">
                        UPI ID
                      </label>
                      <input
                        value={upi}
                        onChange={(e) => setUpi(e.target.value)}
                        placeholder="yourname@upi"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#072654] focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        "GPay",
                        "PhonePe",
                        "Paytm",
                        "BHIM",
                        "Amazon",
                        "Other",
                      ].map((app) => (
                        <button
                          key={app}
                          onClick={() =>
                            setUpi(
                              app === "Other"
                                ? ""
                                : `user@${app.toLowerCase()}`,
                            )
                          }
                          className="border border-gray-200 rounded-lg py-2 text-xs text-gray-600 hover:border-[#072654] hover:text-[#072654] transition"
                        >
                          {app}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Net Banking */}
                {payTab === "netbanking" && (
                  <>
                    <p className="text-xs text-gray-400">
                      Select your bank — all succeed in test mode
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        "SBI",
                        "HDFC",
                        "ICICI",
                        "Axis",
                        "Kotak",
                        "Yes Bank",
                        "PNB",
                        "BOB",
                        "Other",
                      ].map((bank) => (
                        <button
                          key={bank}
                          onClick={() => setSelectedBank(bank)}
                          className={`border rounded-lg py-2.5 text-xs font-medium transition ${
                            selectedBank === bank
                              ? "border-[#072654] bg-blue-50 text-[#072654] font-bold"
                              : "border-gray-200 text-gray-600 hover:border-gray-400"
                          }`}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <button
                  onClick={handlePay}
                  className="w-full bg-[#072654] text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-900 active:scale-95 transition-all shadow-md"
                >
                  Pay ₹{amount} →
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Secured by <b className="text-[#072654]">Razorpay</b> · Test
                    Mode
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// ── Main Checkout Page ─────────────────────────────────────
const Checkout = () => {
  const { cart, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      zipCode: user?.zipCode || "",
    },
  });

  const tax = Math.round(getTotal() * 0.18);
  const totalAmount = getTotal() + tax;

  const onSubmit = async (data) => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    if (data.paymentMethod === "Cash on Delivery") {
      await placeCODOrder(data);
    } else {
      setPendingFormData(data);
      setShowPaymentPopup(true);
    }
  };

  const placeCODOrder = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/orders",
        {
          items: cart.map((i) => ({ crackerId: i._id, quantity: i.quantity })),
          shippingAddress: {
            fullName: data.fullName,
            phone: data.phone,
            address: data.address,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
          },
          paymentMethod: "Cash on Delivery",
        },
        { headers: useAuthStore.getState().getAuthHeader() },
      );
      clearCart();
      Swal.fire({
        icon: "success",
        title: "Order Placed!",
        html: `<b>Order ID:</b> ${response.data.order._id}<br/><b>Payment:</b> Cash on Delivery`,
        confirmButtonText: "View Orders",
        confirmButtonColor: "#000",
      }).then(() => navigate("/orders"));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async ({
    fakePaymentId,
    fakeOrderId,
    fakeSig,
  }) => {
    setShowPaymentPopup(false);
    setIsLoading(true);
    const data = pendingFormData;
    try {
      const response = await axios.post(
        "http://localhost:5000/api/orders/verify-payment",
        {
          razorpayOrderId: fakeOrderId,
          razorpayPaymentId: fakePaymentId,
          razorpaySignature: fakeSig,
          items: cart.map((i) => ({ crackerId: i._id, quantity: i.quantity })),
          shippingAddress: {
            fullName: data.fullName,
            phone: data.phone,
            address: data.address,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
          },
          totalAmount,
          paymentMethod: data.paymentMethod,
        },
        { headers: useAuthStore.getState().getAuthHeader() },
      );
      clearCart();
      Swal.fire({
        icon: "success",
        title: "🎉 Payment Successful!",
        html: `<div style="text-align:left;margin-top:8px;font-size:14px">
          <p><b>Order ID:</b> ${response.data.order._id}</p>
          <p><b>Payment ID:</b> ${fakePaymentId}</p>
          <p><b>Status:</b> <span style="color:green;font-weight:bold">Confirmed ✓</span></p>
          <p><b>Amount Paid:</b> ₹${totalAmount}</p>
        </div>`,
        confirmButtonText: "View My Orders",
        confirmButtonColor: "#000",
      }).then(() => navigate("/orders"));
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed after payment");
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-600 mb-8">Your cart is empty</p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-black text-white px-8 py-3 rounded font-semibold hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showPaymentPopup && (
          <MockRazorpayPopup
            amount={totalAmount}
            onSuccess={handlePaymentSuccess}
            onClose={() => {
              setShowPaymentPopup(false);
              toast("Payment cancelled", { icon: "🚫" });
            }}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Checkout</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Shipping */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-black mb-6">
                    Shipping Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        name: "fullName",
                        label: "Full Name",
                        placeholder: "John Doe",
                        colSpan: false,
                      },
                      {
                        name: "phone",
                        label: "Phone Number",
                        placeholder: "9876543210",
                        colSpan: false,
                      },
                      {
                        name: "address",
                        label: "Address",
                        placeholder: "123 Main Street",
                        colSpan: true,
                      },
                      {
                        name: "city",
                        label: "City",
                        placeholder: "Chennai",
                        colSpan: false,
                      },
                      {
                        name: "state",
                        label: "State",
                        placeholder: "Tamil Nadu",
                        colSpan: false,
                      },
                      {
                        name: "zipCode",
                        label: "Zip Code",
                        placeholder: "600001",
                        colSpan: false,
                      },
                    ].map(({ name, label, placeholder, colSpan }) => (
                      <div
                        key={name}
                        className={colSpan ? "md:col-span-2" : ""}
                      >
                        <label className="block text-sm font-medium text-black mb-2">
                          {label}
                        </label>
                        <input
                          {...register(name)}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                          placeholder={placeholder}
                        />
                        {errors[name] && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors[name].message}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-black mb-6">
                    Payment Method
                  </h2>
                  <div className="space-y-3">
                    {[
                      "Credit Card",
                      "Debit Card",
                      "UPI",
                      "Net Banking",
                      "Cash on Delivery",
                    ].map((method) => (
                      <label
                        key={method}
                        className="flex items-center space-x-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          value={method}
                          {...register("paymentMethod")}
                          className="w-4 h-4"
                        />
                        <span className="text-gray-700">{method}</span>
                        {method !== "Cash on Delivery" && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                            Razorpay Secured
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                  {errors.paymentMethod && (
                    <p className="text-red-600 text-sm mt-3">
                      {errors.paymentMethod.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-4 rounded font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? "Processing..."
                    : `Proceed to Pay ₹${totalAmount}`}
                </button>
              </motion.form>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-20"
              >
                <h2 className="text-2xl font-bold text-black mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center border-b pb-4"
                    >
                      <div>
                        <p className="font-semibold text-black">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-black">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 border-t border-gray-200 pt-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{getTotal()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (18% GST)</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-black pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <span>🔒 Secured by</span>
                  <span className="font-bold text-[#072654]">Razorpay</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
