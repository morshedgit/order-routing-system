// pages/admin/view-orders.tsx
"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ORDER_URL } from "@/common/constants";
import { OrderSpecification } from "./order-specifications/page";
import Link from "next/link";

interface Order {
  orderId: string;
  customerId: string;
  specificationsId: string;
  specifications: OrderSpecification;
}

const fetchOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${API_ORDER_URL}/orders`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const deleteOrder = async (id: string): Promise<void> => {
  const response = await fetch(`${API_ORDER_URL}/orders/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
};

const ViewOrders = () => {
  const queryClient = useQueryClient();
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      console.log("Order deleted successfully");
      // Refetch orders after a successful deletion
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error)
    return <div>An error has occurred: {error.message}</div>;

  return (
    <div>
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order Partners</h1>
      </header>
      <ul className="list-disc">
        {orders?.map((order) => (
          <li key={order.orderId} className="flex justify-between my-2">
            <Link href={`/orders/${order.orderId}`} className="flex-grow">
              <div className="font-semibold">
                {order.specifications.paperType}
              </div>
            </Link>
            <button
              onClick={() => deleteMutation.mutate(order.orderId)}
              className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewOrders;
