// pages/customer/add-order.tsx
"use client";
import React, { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ORDER_URL } from "@/common/constants";
import Autocomplete from "@/components/Autocomplete";
import { OrderSpecification } from "./order-specifications/page";
import AddOrderSpecifications from "./add-order-specification/page";

const CUSTOMER_ID = "4a8737bc-beb4-4f27-87d9-8f804d6538d2";

interface OrderResponse {
  message: string;
  orderId: string;
}

interface OrderError {
  message: string;
}

interface OrderData {
  customerId: string; // Assuming the customer ID is known
  specificationsId: string;
}

// Assuming you have a function to fetch orderSpecifications
async function fetchOrderSpecifications(): Promise<OrderSpecification[]> {
  // Fetch orderSpecifications from your API
  const response = await fetch(`${API_ORDER_URL}/order-specifications`); // Adjust API endpoint as needed
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

const addOrder = async (order: OrderData): Promise<OrderResponse> => {
  const response = await fetch(`${API_ORDER_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const result = await response.json();
  return result;
};

const OrderForm: React.FC = () => {
  const { data: orderSpecifications, isLoading } = useQuery<
    OrderSpecification[]
  >({
    queryKey: ["order-specifications"],
    queryFn: fetchOrderSpecifications,
  });

  const [orderData, setOrderData] = useState<OrderData>({
    customerId: CUSTOMER_ID, // Set this to the actual customer's ID
    specificationsId: "",
  });

  const modalRef = useRef<HTMLDialogElement>(null);

  const queryClient = useQueryClient();

  const orderMutation = useMutation<OrderResponse, OrderError, OrderData>({
    mutationFn: addOrder,
    onSuccess: (data) => {
      console.log("Order added successfully:", data);
      // Perform any additional actions on
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      window.location.assign(`/orders/${data.orderId}`);
    },
    onError: (error) => {
      console.error("Error adding order:", error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    orderMutation.mutate(orderData);
  };

  const onSelectSpec = (key: string) => {
    setOrderData((order) => ({ ...order, specificationsId: key }));
  };

  // Form fields for order specifications
  return (
    <>
      <form className="form-control w-full max-w-xs" onSubmit={handleSubmit}>
        <label className="label">
          <span className="label-text">Specification</span>
        </label>
        <div className="w-full flex max-w-xs">
          <Autocomplete
            onSelect={onSelectSpec}
            suggestions={(orderSpecifications || [])
              ?.filter((spec) => spec.specificationsId)
              .map((spec) => ({
                key: spec.specificationsId!,
                label: `${spec.size} ${spec.paperType}, ${spec.quantity}`,
              }))}
          />
          <button
            type="button"
            className="btn"
            onClick={() => modalRef.current?.showModal()}
          >
            +
          </button>
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          Add Order
        </button>
      </form>
      <dialog id="add_location_modal" className="modal" ref={modalRef}>
        <div className="bg-white p-4 rounded-sm relative">
          <AddOrderSpecifications />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn absolute top-1 right-1">x</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default OrderForm;
