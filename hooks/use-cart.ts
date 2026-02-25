"use client";

import { useState, useEffect, useCallback } from "react";

interface CartItem {
  id: string;
  customer_id: string;
  farmer_id: string;
  product_type: string;
  breed: string;
  quantity: number;
  price_per_unit: number;
  weight: string | null;
  minimum_guaranteed_weight: number | null;
  farmer: {
    name: string;
    village: string;
    phone: string;
    is_verified: boolean;
  };
  farmerName?: string;
  farmerVillage?: string;
  available?: number;
}

interface CartSummary {
  subtotal: number;
  itemCount: number;
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState<string | null>(null);

  // Get customer ID from localStorage (demo auth)
  useEffect(() => {
    const currentUser = localStorage.getItem("melody_current_user");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      setCustomerId(user.phone);
    }
  }, []);

  // Fetch cart items from database
  const fetchCart = useCallback(async () => {
    if (!customerId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/cart?customerId=${customerId}`);
      if (response.ok) {
        const data = await response.json();
        const items = data.cart.map((item: any) => ({
          ...item,
          id: item.id,
          customer_id: item.customerId,
          farmer_id: item.farmerId,
          product_type: item.productType,
          breed: item.breed,
          quantity: item.quantity,
          price_per_unit: item.pricePerUnit,
          weight: item.weight,
          minimum_guaranteed_weight: item.minimumGuaranteedWeight,
          farmer: {
            name: "Farmer",
            village: "Village", 
            phone: "",
            is_verified: true
          },
          farmerName: "Farmer",
          farmerVillage: "Village",
          available: 10,
        }));
        setCartItems(items);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  // Load cart on mount and when customerId changes
  useEffect(() => {
    if (customerId) {
      console.log("Loading cart for customer:", customerId);
      fetchCart();
    }
  }, [customerId, fetchCart]);

  // Add item to cart
  const addToCart = useCallback(
    async (item: {
      farmerId: string;
      productType: string;
      breed?: string;
      quantity?: number;
      price: number;
      weight?: string;
      minimumGuaranteedWeight?: number;
    }) => {
      if (!customerId) {
        console.warn("No customer ID available for cart operation");
        return false;
      }

      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId,
            farmerId: item.farmerId,
            productType: item.productType,
            breed: item.breed || "Standard",
            quantity: item.quantity || 1,
            price: item.price,
            weight: item.weight,
            minimumGuaranteedWeight: item.minimumGuaranteedWeight,
          }),
        });

        if (response.ok) {
          await fetchCart();
          return true;
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error("Cart add failed:", errorData);
          return false;
        }
      } catch (error) {
        console.error("Failed to add to cart:", error);
        return false;
      }
    },
    [customerId, fetchCart]
  );

  // Remove item from cart
  const removeFromCart = useCallback(
    async (itemId: string) => {
      if (!customerId) return;

      try {
        const response = await fetch(
          `/api/cart?customerId=${customerId}&itemId=${itemId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          await fetchCart(); // Refresh cart
        }
      } catch (error) {
        console.error("Failed to remove from cart:", error);
      }
    },
    [customerId, fetchCart]
  );

  // Update item quantity
  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (!customerId || quantity < 1) return;

      try {
        const response = await fetch("/api/cart", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId,
            itemId,
            quantity,
          }),
        });

        if (response.ok) {
          await fetchCart(); // Refresh cart
        }
      } catch (error) {
        console.error("Failed to update cart quantity:", error);
      }
    },
    [customerId, fetchCart]
  );

  // Increase quantity
  const increaseQuantity = useCallback(
    (itemId: string) => {
      const item = cartItems.find((item) => item.id === itemId);
      if (item) {
        updateQuantity(itemId, item.quantity + 1);
      }
    },
    [cartItems, updateQuantity]
  );

  // Decrease quantity
  const decreaseQuantity = useCallback(
    (itemId: string) => {
      const item = cartItems.find((item) => item.id === itemId);
      if (item && item.quantity > 1) {
        updateQuantity(itemId, item.quantity - 1);
      }
    },
    [cartItems, updateQuantity]
  );

  // Get cart item by product details (for customer page)
  const getCartItemByProduct = useCallback(
    (farmerId: string, productType: string, breed: string) => {
      return cartItems.find(
        (item) =>
          item.farmer_id === farmerId &&
          item.product_type === productType &&
          item.breed === breed
      );
    },
    [cartItems]
  );

  // Increase quantity by product details
  const increaseQuantityByProduct = useCallback(
    (farmerId: string, productType: string, breed: string) => {
      const item = getCartItemByProduct(farmerId, productType, breed);
      if (item) {
        updateQuantity(item.id, item.quantity + 1);
      }
    },
    [getCartItemByProduct, updateQuantity]
  );

  // Decrease quantity by product details
  const decreaseQuantityByProduct = useCallback(
    (farmerId: string, productType: string, breed: string) => {
      const item = getCartItemByProduct(farmerId, productType, breed);
      if (item && item.quantity > 1) {
        updateQuantity(item.id, item.quantity - 1);
      }
    },
    [getCartItemByProduct, updateQuantity]
  );

  // Clear cart
  const clearCart = useCallback(async () => {
    if (!customerId) return;

    try {
      // Delete all items for this customer
      const deletePromises = cartItems.map((item) =>
        fetch(`/api/cart?customerId=${customerId}&itemId=${item.id}`, {
          method: "DELETE",
        })
      );

      await Promise.all(deletePromises);
      setCartItems([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  }, [customerId, cartItems]);

  // Get item quantity in cart
  const getItemQuantity = useCallback(
    (farmerId: string, productType: string, breed: string) => {
      const item = cartItems.find(
        (item) =>
          item.farmer_id === farmerId &&
          item.product_type === productType &&
          item.breed === breed
      );
      return item?.quantity || 0;
    },
    [cartItems]
  );

  // Check if item can be added to cart
  const canAddItem = useCallback(
    (
      farmerId: string,
      productType: string,
      breed: string,
      available: number
    ) => {
      const currentQuantity = getItemQuantity(farmerId, productType, breed);
      return currentQuantity < available;
    },
    [getItemQuantity]
  );

  // Calculate cart summary
  const cartSummary: CartSummary = {
    subtotal: cartItems.reduce(
      (sum, item) => sum + item.price_per_unit * item.quantity,
      0
    ),
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
  };

  return {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    increaseQuantityByProduct,
    decreaseQuantityByProduct,
    updateQuantity,
    clearCart,
    getItemQuantity,
    canAddItem,
    cartSummary,
  };
}
