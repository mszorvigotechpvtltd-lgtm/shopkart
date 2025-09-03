"use client";
import { useState } from "react";
import {
  StockAvailabillity,
  SingleProductRating,
  SingleProductDynamicFields,
  AddToWishlistBtn,
  AddToCartSingleProductBtn,
  BuyNowSingleProductBtn,
} from "@/components";

const ProductDetails = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const maxQty = product.inStock > 10 ? 10 : product.inStock;

  const incrementQty = () => {
    if (quantity < maxQty) setQuantity(quantity + 1);
  };
  const decrementQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className="flex flex-col gap-5 max-[500px]:items-center">
      {/* <SingleProductRating rating={product.rating} /> */}
      <h1 className="text-3xl font-semibold">{product.title}</h1>
      <p className="text-2xl font-semibold text-[var(--color-bg)]">
        ₹{product.price}
      </p>

      <StockAvailabillity stock={product.inStock} />

      {/* Key Features */}
      {product.keyFeatures && product.keyFeatures.length > 0 && (
        <div className="bg-[var(--color-inverted-bg)] text-[var(--color-inverted-text)] p-4 rounded-lg shadow-md">
          <h2 className="font-semibold text-lg mb-2">Key Features:</h2>
          <ul className="list-disc list-inside space-y-1">
            {product.keyFeatures.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Dynamic Fields */}
      <SingleProductDynamicFields product={product} />

      {/* Wishlist */}
      <AddToWishlistBtn product={product} />
    </div>
  );
};

export default ProductDetails;
