// pages/admin/add-printer-capability.tsx
"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_PRINTER_URL } from "@/common/constants";

// Define the type for your printerCapability data
export interface PrinterCapabilityData {
  capabilityId?: string;
  printType: string;
  volumeCapacity: number;
  createdAt?: string;
  updatedAt?: string;
}

// Define the type for the response data
interface PrinterCapabilityResponse {
  message: string;
}

// Define a type for the error
interface PrinterCapabilityError {
  message: string;
}

const AddPrinterCapability: React.FC = () => {
  const [printerCapabilityData, setPrinterCapabilityData] =
    useState<PrinterCapabilityData>({
      printType: "",
      volumeCapacity: 0,
    });

  const queryClient = useQueryClient();

  // Mutation function with typed input and output
  const addPrinterCapability = async (
    printerCapability: PrinterCapabilityData
  ): Promise<PrinterCapabilityResponse> => {
    const response = await fetch(`${API_PRINTER_URL}/printer-capabilities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(printerCapability),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  // useMutation hook with TypeScript typing
  const mutation = useMutation<
    PrinterCapabilityResponse,
    PrinterCapabilityError,
    PrinterCapabilityData
  >({
    mutationFn: addPrinterCapability,
    onSuccess: (data) => {
      // Handle successful mutation here
      console.log("PrinterCapability added successfully:", data.message);

      // Refetch printers after a successful deletion
      queryClient.invalidateQueries({ queryKey: ["printer-capabilities"] });
    },
    onError: (error) => {
      // Handle error here
      console.error("Error adding printerCapability:", error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(printerCapabilityData);
  };

  return (
    <form className="form-control w-full max-w-xs" onSubmit={handleSubmit}>
      <label className="label">
        <span className="label-text">Print Type</span>
      </label>
      <input
        type="text"
        placeholder="Print Type"
        className="input input-bordered w-full max-w-xs"
        value={printerCapabilityData.printType}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPrinterCapabilityData({
            ...printerCapabilityData,
            printType: e.target.value,
          })
        }
      />

      <label className="label">
        <span className="label-text">Volume Capacity</span>
      </label>
      <input
        type="number"
        placeholder="Volume Capacity"
        className="input input-bordered w-full max-w-xs"
        value={printerCapabilityData.volumeCapacity}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPrinterCapabilityData({
            ...printerCapabilityData,
            volumeCapacity: e.target.valueAsNumber,
          })
        }
      />

      <button type="submit" className="btn btn-primary mt-4">
        Add Printer Capability
      </button>
    </form>
  );
};

export default AddPrinterCapability;
