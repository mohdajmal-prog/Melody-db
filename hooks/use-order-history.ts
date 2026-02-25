"use client";

import { useState, useEffect } from "react";

export interface Order {
  id: string;
  date: string;
  items: Array<{
    farmerId: string;
    farmerName: string;
    productType: string;
    breed: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
}

export function useOrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("melody_orders");
    if (saved) {
      setOrders(JSON.parse(saved));
    }
  }, []);

  const addOrder = (order: Order) => {
    const newOrders = [order, ...orders];
    setOrders(newOrders);
    localStorage.setItem("melody_orders", JSON.stringify(newOrders));
  };

  return { orders, addOrder };
}
