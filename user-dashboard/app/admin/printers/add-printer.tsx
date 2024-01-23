// pages/admin/add-printer.tsx
"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_PRINTER_URL } from "@/common/constants";
import { PrinterCapabilityData } from "../printer-capabilities/add-printer-capability/page";
import { LocationData } from "../locations/add-location/location-form";
import PrinterForm, { PrinterFormValue } from "./printer-form";
import { httpService } from "@/common/services/http";

// Define the type for the response data
interface PrinterResponse {
  message: string;
}

// Define a type for the error
interface PrinterError {
  message: string;
}

async function fetchLocations(): Promise<LocationData[]> {
  // Fetch locations from your API
  const response = await httpService(`${API_PRINTER_URL}/locations`); // Adjust API endpoint as needed
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

async function fetchPrinterCapabilities(): Promise<PrinterCapabilityData[]> {
  // Fetch locations from your API
  const response = await httpService(`${API_PRINTER_URL}/printer-capabilities`); // Adjust API endpoint as needed
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

// Assuming you have a function to submit printer data
async function addNewPrinter(
  printerData: PrinterData
): Promise<PrinterResponse> {
  // Submit printer data to your API
  const response = await httpService(`${API_PRINTER_URL}/printers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(printerData),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

interface PrinterData {
  name: string;
  locationId: string;
  capabilityId: string;
}

const AddPrinter: React.FC = () => {
  const { data: locations } = useQuery<LocationData[]>({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });
  const { data: printerCapabilities } = useQuery<PrinterCapabilityData[]>({
    queryKey: ["printer-capabilities"],
    queryFn: fetchPrinterCapabilities,
  });

  const queryClient = useQueryClient();

  const printerMutation = useMutation<
    PrinterResponse,
    PrinterError,
    PrinterData
  >({
    mutationFn: addNewPrinter,
    onSuccess: (data) => {
      // Handle successful mutation here
      console.log("Location added successfully:", data.message);

      // Refetch printers after a successful deletion
      queryClient.invalidateQueries({ queryKey: ["printers"] });
    },
    onError: (error) => {
      // Handle error here
      console.error("Error adding location:", error.message);
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: PrinterFormValue) {
    printerMutation.mutate(values);
  }

  return (
    <PrinterForm
      locations={locations!}
      printerCapabilities={printerCapabilities!}
      onSubmit={onSubmit}
    />
  );
};

export default AddPrinter;
