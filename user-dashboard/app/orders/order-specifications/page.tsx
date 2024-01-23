// pages/customer/view-order-specifications.tsx
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ORDER_URL } from "@/common/constants";
import { httpService } from "@/common/services/http";

export interface OrderSpecification {
  specificationsId: string;
  size: string;
  paperType: string;
  quantity: number;
}

const fetchSpecifications = async (): Promise<OrderSpecification[]> => {
  const response = await httpService(`${API_ORDER_URL}/order-specifications`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const ViewOrderSpecifications = () => {
  const {
    data: specifications,
    isLoading,
    error,
  } = useQuery<OrderSpecification[]>({
    queryKey: ["order-specifications"],
    queryFn: fetchSpecifications,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error)
    return <div>An error has occurred: {error.message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Order Specifications</h1>
      <ul className="list-disc">
        {specifications?.map((spec) => (
          <li key={spec.specificationsId} className="my-2">
            <span>
              Size: {spec.size}, Paper Type: {spec.paperType}, Quantity:{" "}
              {spec.quantity}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewOrderSpecifications;
