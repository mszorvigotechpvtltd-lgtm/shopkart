import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useProductStore = create()(
  persist(
    (set, get) => ({
      products: [],
      allQuantity: 0,
      total: 0,

      // Add to cart
      addToCart: async (newProduct) => {
        // Optimistic update local
        set((state) => {
          const exists = state.products.find(
            (item) => item.id === newProduct.id
          );
          let updatedProducts;
          if (!exists) {
            updatedProducts = [...state.products, newProduct];
          } else {
            updatedProducts = state.products.map((product) =>
              product.id === newProduct.id
                ? { ...product, amount: product.amount + newProduct.amount }
                : product
            );
          }
          return { products: updatedProducts };
        });
        // Update DB
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            productId: newProduct.id,
            quantity: newProduct.amount,
          }),
        });
        get().calculateTotals();
      },

      // Remove from cart
      removeFromCart: async (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        }));
        // Update DB
        await fetch(`/api/cart`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ productId: id }),
        });
        get().calculateTotals();
      },

      // Clear all cart
      clearCart: async () => {
        set({
          products: [],
          allQuantity: 0,
          total: 0,
        });
        await fetch(`/api/cart/clear`, {
          method: "POST",
          credentials: "include",
        });
      },

      // Update cart item quantity
      updateCartAmount: async (id, amount) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, amount } : product
          ),
        }));
        await fetch(`/api/cart`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ productId: id, quantity: amount }),
        });
        get().calculateTotals();
      },

      // Calculate totals
      calculateTotals: () => {
        set((state) => {
          let amount = 0;
          let total = 0;
          state.products.forEach((item) => {
            amount += item.amount;
            total += item.amount * item.price;
          });
          return {
            allQuantity: amount,
            total: total,
          };
        });
      },

      // Hydrate local Zustand from DB
      hydrateCartFromDb: async () => {
        const res = await fetch("/api/cart", { credentials: "include" });
        if (!res.ok) return;
        const cart = await res.json();
        const updatedProducts = (cart.items || []).map((item) => ({
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          mrp: item.product.mrp,
          discount: item.product.discount,
          inStock: item.product.inStock,
          image: item.product.mainImage,
          amount: item.quantity,
          rating: item.product.rating,
          slug: item.product.slug,
        }));
        set({ products: updatedProducts });
        get().calculateTotals();
      },

      // Sync prices/stock for local cart products with server (identical to hydrate here)
      syncCartWithServer: async () => {
        await get().hydrateCartFromDb();
      },
    }),
    {
      name: "products-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
