// pages/customer/add-order-specifications.tsx
"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ORDER_URL } from "@/common/constants";

interface SpecificationResponse {
  message: string;
}

interface SpecificationError {
  message: string;
}

interface OrderSpecificationData {
  size: string;
  paperType: string;
  quantity: number;
}

const AddOrderSpecifications: React.FC = () => {
  const [specData, setSpecData] = useState<OrderSpecificationData>({
    size: "",
    paperType: "",
    quantity: 1,
  });

  const queryClient = useQueryClient();

  const addSpecification = async (
    spec: OrderSpecificationData
  ): Promise<SpecificationResponse> => {
    const response = await fetch(`${API_ORDER_URL}/order-specifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(spec),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const specificationMutation = useMutation<
    SpecificationResponse,
    SpecificationError,
    OrderSpecificationData
  >({
    mutationFn: addSpecification,
    onSuccess: (data) => {
      console.log("Specification added successfully:", data.message);
      // Perform any additional actions on success

      // Refetch printers after a successful deletion
      queryClient.invalidateQueries({ queryKey: ["order-specifications"] });
    },
    onError: (error) => {
      console.error("Error adding specification:", error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    specificationMutation.mutate(specData);
  };

  // Form fields for order specification
  return (
    <form className="form-control w-full max-w-xs" onSubmit={handleSubmit}>
      {/* Input fields for size, paper type, quantity */}
      <label className="label">
        <span className="label-text">Size</span>
      </label>
      <input
        type="text"
        placeholder="Size"
        className="input input-bordered w-full max-w-xs"
        value={specData.size}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSpecData({ ...specData, size: e.target.value })
        }
      />

      <label className="label">
        <span className="label-text">Paper Type</span>
      </label>
      <input
        type="text"
        placeholder="Paper Type"
        className="input input-bordered w-full max-w-xs"
        value={specData.paperType}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSpecData({ ...specData, paperType: e.target.value })
        }
      />
      <label className="label">
        <span className="label-text">Quantity</span>
      </label>
      <input
        type="number"
        placeholder="Quantity"
        className="input input-bordered w-full max-w-xs"
        value={specData.quantity}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSpecData({ ...specData, quantity: e.target.valueAsNumber })
        }
      />
      <button type="submit" className="btn btn-primary mt-4">
        Add Specification
      </button>
    </form>
  );
};

export default AddOrderSpecifications;
