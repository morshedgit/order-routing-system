// pages/admin/add-printer.tsx
"use client";

import React, { ChangeEvent, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_PRINTER_URL } from "@/common/constants";
import Autocomplete from "@/components/Autocomplete";
import AddLocation from "./add-location/page";
import AddPrinterCapability, {
  PrinterCapabilityData,
} from "./add-printer-capability/page";

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
  const response = await fetch(`${API_PRINTER_URL}/locations`); // Adjust API endpoint as needed
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

async function fetchPrinterCapabilities(): Promise<PrinterCapabilityData[]> {
  // Fetch locations from your API
  const response = await fetch(`${API_PRINTER_URL}/printer-capabilities`); // Adjust API endpoint as needed
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

// Assuming you have a function to submit printer data
async function addPrinter(printerData: PrinterData): Promise<PrinterResponse> {
  // Submit printer data to your API
  const response = await fetch(`${API_PRINTER_URL}/printers`, {
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

interface LocationData {
  locationId?: string;
  address: string;
  city: string;
  createdAt?: string;
  updatedAt?: string;
}

const AddPrinter: React.FC = () => {
  const localtionModalRef = useRef<HTMLDialogElement>(null);
  const capabilityModalRef = useRef<HTMLDialogElement>(null);
  const [printerData, setPrinterData] = useState<PrinterData>({
    name: "",
    locationId: "",
    capabilityId: "",
  });
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );
  const [selectedPrinterCapabilityId, setSelectedPrinterCapabilityId] =
    useState<string | null>(null);

  const { data: locations, isLoading } = useQuery<LocationData[]>({
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
    mutationFn: addPrinter,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocationId) {
      alert("Location is required");
      return;
    }
    if (!selectedPrinterCapabilityId) {
      alert("Printer Capability is required");
      return;
    }

    printerMutation.mutate({
      ...printerData,
      locationId: selectedLocationId,
      capabilityId: selectedPrinterCapabilityId,
    });
  };

  const onSelectLocation = (key: string) => {
    const locationId = key;
    setSelectedLocationId(locationId);
  };
  const onSelectPrinterCapability = (key: string) => {
    setSelectedPrinterCapabilityId(key);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <form className="form-control w-full max-w-xs" onSubmit={handleSubmit}>
        <label className="label">
          <span className="label-text">Printer Name</span>
        </label>
        <input
          type="text"
          placeholder="Name"
          className="input input-bordered w-full max-w-xs"
          value={printerData.name}
          onChange={(e) =>
            setPrinterData({ ...printerData, name: e.target.value })
          }
        />

        <label className="label">
          <span className="label-text">Location</span>
        </label>
        <div className="w-full flex max-w-xs">
          <Autocomplete
            onSelect={onSelectLocation}
            suggestions={(locations || [])
              ?.filter((location) => location.locationId)
              .map((location) => ({
                key: location.locationId!,
                label: `${location.address}, ${location.city}`,
              }))}
          />
          <button
            type="button"
            className="btn"
            onClick={() => localtionModalRef.current?.showModal()}
          >
            +
          </button>
        </div>

        <label className="label">
          <span className="label-text">Printer Capability</span>
        </label>
        <div className="w-full flex max-w-xs">
          <Autocomplete
            onSelect={onSelectPrinterCapability}
            suggestions={(printerCapabilities || [])
              ?.filter((printerCapability) => printerCapability.capabilityId)
              .map((printerCapability) => ({
                key: printerCapability.capabilityId!,
                label: `${printerCapability.printType}, ${printerCapability.volumeCapacity}`,
              }))}
          />
          <button
            type="button"
            className="btn"
            onClick={() => capabilityModalRef.current?.showModal()}
          >
            +
          </button>
        </div>

        <button type="submit" className="btn btn-primary mt-4">
          Add Printer
        </button>
      </form>
      <dialog id="add_location_modal" className="modal" ref={localtionModalRef}>
        <div className="bg-white p-4 rounded-sm relative">
          <AddLocation />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn absolute top-1 right-1">x</button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog
        id="add_location_modal"
        className="modal"
        ref={capabilityModalRef}
      >
        <div className="bg-white p-4 rounded-sm relative">
          <AddPrinterCapability />
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

export default AddPrinter;
