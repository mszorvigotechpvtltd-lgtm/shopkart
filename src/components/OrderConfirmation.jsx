"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle, PackageCheck } from "lucide-react";
import Link from "next/link";

function shortOrderId(id) {
  return id ? id.slice(0, 8).toUpperCase() : "";
}

const OrderConfirmation = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`/api/orders?orderId=${orderId}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      }
    } catch (err) {
      console.error("Failed to fetch order", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (!order)
    return <div className="py-20 text-center text-2xl">Order not found.</div>;
  return (
    <div className="min-h-screen flex justify-center items-center bg-[var(--color-inverted-bg)] px-2 py-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl px-5 sm:px-10 py-10 flex flex-col gap-6 items-center">
        <CheckCircle className="text-green-500 mb-1" size={54} />
        <h1 className="text-3xl font-bold text-[var(--color-bg)] text-center">
          Thank you for your order!
        </h1>
        <p className="text-base text-center text-gray-700 mb-3">
          Your order{" "}
          <span className="font-bold text-[var(--color-bg)]">
            #{shortOrderId(order.id)}
          </span>{" "}
          has been placed successfully.
          <br />
          <span className="text-gray-500">
            A confirmation email has been sent to
          </span>{" "}
          <span className="font-bold text-[var(--color-bg)]">
            {order.email}
          </span>
        </p>

        {/* Order summary card */}
        <section className="w-full bg-[var(--color-bg)]/95 text-[var(--color-text)] rounded-xl shadow-md p-6 mb-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <PackageCheck size={22} />
            <h2 className="text-lg font-semibold">Order Summary</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <div>
              <span className="font-semibold">Name:</span> {order.name}{" "}
              {order.lastname}
            </div>
            <div>
              <span className="font-semibold">Order Date:</span>{" "}
              {new Date(order.dateTime).toLocaleString()}
            </div>
            <div>
              <span className="font-semibold">Status:</span>{" "}
              <span className="capitalize">{order.status}</span>
            </div>
            <div>
              <span className="font-semibold">Phone:</span> {order.phone}
            </div>
            <div className="md:col-span-2">
              <span className="font-semibold">Address:</span> {order.address}
              {order.apartment && `, ${order.apartment}`}, {order.city},{" "}
              {order.country} - {order.postalCode}
            </div>
            {order.company && (
              <div className="md:col-span-2">
                <span className="font-semibold">Company:</span> {order.company}
              </div>
            )}
            {order.orderNotice && (
              <div className="md:col-span-2">
                <span className="font-semibold">Order Note:</span>{" "}
                {order.orderNotice}
              </div>
            )}
          </div>
          <div className="text-right text-xl font-bold mt-2">
            Total: ₹{order.total}
          </div>
        </section>

        {/* Products List */}
        <section className="w-full">
          <h3 className="text-lg font-bold text-[var(--color-bg)] mb-2">
            Products
          </h3>
          <div className="flex flex-col gap-2">
            {order.products?.map((product, idx) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-lg bg-gray-100 px-5 py-3 shadow-sm"
              >
                <div className="font-medium text-gray-800">
                  Product ID:{" "}
                  <span className="text-[var(--color-bg)]">
                    {product.productId}
                  </span>
                </div>
                <div className="text-base text-gray-600">
                  Qty: <span className="font-semibold">{product.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Link
          href="/shop"
          className="mt-6 inline-block bg-[var(--color-bg)] text-[var(--color-text)] px-7 py-3 rounded-xl font-semibold text-lg hover:bg-[var(--color-inverted-bg)] hover:text-[var(--color-inverted-text)] border border-[var(--color-bg)] transition shadow"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
