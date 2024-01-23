// pages/admin/view-locations.tsx
"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_PRINTER_URL } from "@/common/constants";
import { LocationData } from "./add-location/location-form";

const fetchLocations = async (): Promise<LocationData[]> => {
  const response = await httpService(`${API_PRINTER_URL}/locations`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const deleteLocation = async (id: string): Promise<void> => {
  const response = await httpService(`${API_PRINTER_URL}/locations/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
};

const ViewLocations = () => {
  const queryClient = useQueryClient();
  const {
    data: locations,
    isLoading,
    error,
  } = useQuery<LocationData[]>({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      console.log("Location deleted successfully");
      // Refetch locations after a successful deletion
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
    onError: (e: any) => {
      alert(e.message);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error)
    return <div>An error has occurred: {error.message}</div>;

  return (
    <div>
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Locations</h1>
      </header>
      <ul className="list-disc">
        {locations?.map((location) => (
          <li key={location.locationId} className="flex justify-between my-2">
            <span>
              <span className="font-semibold">{location.address}</span>- City:{" "}
              {location?.city}
            </span>
            <button
              onClick={() => deleteMutation.mutate(location.locationId!)}
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

export default ViewLocations;
