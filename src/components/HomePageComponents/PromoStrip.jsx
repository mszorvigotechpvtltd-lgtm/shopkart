"use client";
import { MdLocalShipping } from "react-icons/md";

const PromoStrip = () => (
  <div className="w-full bg-[#35530e] text-white py-2 px-4 flex items-center justify-center gap-3 text-base font-semibold shadow-md">
    <MdLocalShipping className="text-xl" />
    <span>Free Shipping on Orders Above ₹999!</span>
  </div>
);

export default PromoStrip;
