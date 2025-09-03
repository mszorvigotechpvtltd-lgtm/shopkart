"use client";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";

const SearchInput = ({
  mobile = false, // If true, use mobile styles
  onAfterSearch, // Optional callback (close mobile overlay)
}) => {
  const router = useRouter();
  const input = useRef(null);

  const searchProducts = (e) => {
    e.preventDefault();
    const searchValue = input?.current?.value?.trim();
    if (searchValue) {
      router.push(`/search?search=${searchValue}`);
    }
    // Clear input
    input.current.value = "";
    if (onAfterSearch) onAfterSearch();
  };

  return (
    <form
      onSubmit={searchProducts}
      className={
        mobile
          ? "w-full flex items-center gap-2"
          : "flex-1 mx-4 max-w-2xl hidden md:block"
      }
    >
      <input
        type="text"
        placeholder="Search for products..."
        className={
          mobile
            ? "w-full border border-gray-300 bg-white text-black placeholder-gray-400 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-bg)] text-base"
            : "w-full border border-white/40 bg-white/10 text-white placeholder-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
        }
        ref={input}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            searchProducts(e);
          }
        }}
        autoFocus={mobile}
      />
      {/* Show button only on mobile for big touch target */}
      {mobile && (
        <button
          type="submit"
          className="ml-2 px-4 py-3 rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] font-semibold"
        >
          Search
        </button>
      )}
    </form>
  );
};

export default SearchInput;
