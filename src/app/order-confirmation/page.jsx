"use client";
import React from "react";
import { CheckCircle, PackageCheck } from "lucide-react";
import Link from "next/link";
import { OrderConfirmation } from "@/components";
import { useSearchParams } from "next/navigation";

const OrderConfirmationPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  return <OrderConfirmation orderId={orderId} />;
};

export default OrderConfirmationPage;
