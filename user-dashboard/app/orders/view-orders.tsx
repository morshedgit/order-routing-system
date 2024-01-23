// pages/admin/view-orders.tsx
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { API_AUTH_URL, API_ORDER_URL } from "@/common/constants";
import { OrderSpecification } from "./order-specifications/page";
import { File } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SideNav } from "@/components/side-nav";
import { httpService } from "@/common/services/http";

export interface Order {
  orderId: string;
  customerId: string;
  specificationsId: string;
  specifications: OrderSpecification;
}

const fetchOrders = async (): Promise<Order[]> => {
  const response = await httpService(`${API_ORDER_URL}/orders`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const ViewOrders = () => {
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    retry: false,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error)
    return <div>An error has occurred: {error.message}</div>;

  return (
    <TooltipProvider delayDuration={0}>
      <h2 className="text-3xl p-2">Orders</h2>
      <SideNav
        isCollapsed={false}
        links={
          orders?.map((order) => ({
            title: order.specifications.paperType,
            label: order.specifications.size,
            icon: File,
            variant: "default",
            href: `/orders/${order.orderId}`,
          })) || []
        }
      />
    </TooltipProvider>
  );
};

export default ViewOrders;
