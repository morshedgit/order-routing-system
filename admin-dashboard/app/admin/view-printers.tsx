// pages/admin/view-printers.tsx
"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_PRINTER_URL } from "@/common/constants";
import { LocationData } from "./add-location/page";
import Link from "next/link";

interface Printer {
  printerId: string;
  name: string;
  location: LocationData;
}

const fetchPrinters = async (): Promise<Printer[]> => {
  const response = await httpService(`${API_PRINTER_URL}/printers`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const deletePrinter = async (id: string): Promise<void> => {
  const response = await httpService(`${API_PRINTER_URL}/printers/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
};

const ViewPrinters = () => {
  const queryClient = useQueryClient();
  const {
    data: printers,
    isLoading,
    error,
  } = useQuery<Printer[]>({
    queryKey: ["printers"],
    queryFn: fetchPrinters,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePrinter,
    onSuccess: () => {
      console.log("Printer deleted successfully");
      // Refetch printers after a successful deletion
      queryClient.invalidateQueries({ queryKey: ["printers"] });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error)
    return <div>An error has occurred: {error.message}</div>;

  return (
    <div>
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Printer Partners</h1>
      </header>
      <ul className="list-disc">
        {printers?.map((printer) => (
          <li key={printer.printerId} className="flex justify-between my-2">
            <span>
              <span className="font-semibold">{printer.name}</span>- Location:{" "}
              {printer?.location?.address}, {printer?.location?.city}
            </span>
            <button
              onClick={() => deleteMutation.mutate(printer.printerId)}
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

export default ViewPrinters;
