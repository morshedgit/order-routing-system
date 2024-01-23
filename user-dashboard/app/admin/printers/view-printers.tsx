// pages/admin/view-printers.tsx
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { API_PRINTER_URL } from "@/common/constants";
import { LocationData } from "../locations/add-location/location-form";
import { File } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SideNav } from "../../orders/side-nav";
import { httpService } from "@/common/services/http";

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

const ViewPrinters = () => {
  const {
    data: printers,
    isLoading,
    error,
  } = useQuery<Printer[]>({
    queryKey: ["printers"],
    queryFn: fetchPrinters,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error)
    return <div>An error has occurred: {error.message}</div>;

  return (
    <TooltipProvider delayDuration={0}>
      <h2 className="text-3xl p-2">Printers</h2>
      <SideNav
        isCollapsed={false}
        links={
          printers?.map((printer) => ({
            title: printer.name,
            label: `${printer.location.address} ${printer.location.city}`,
            icon: File,
            variant: "default",
            href: `/admin/printers/${printer.printerId}`,
          })) || []
        }
      />
    </TooltipProvider>
  );
};

export default ViewPrinters;
