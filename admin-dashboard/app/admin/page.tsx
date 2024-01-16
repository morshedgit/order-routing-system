// pages/admin/add-printer.tsx
"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_PRINTER_URL } from "@/common/constants";
import PrinterCapabilityForm, {
  PrinterCapabilityData,
} from "./add-printer-capability/page";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import LocationForm from "./add-location/location-form";

// Define the type for the response data
interface PrinterResponse {
  message: string;
}

// Define a type for the error
interface PrinterError {
  message: string;
}
const formSchema = z.object({
  name: z.string().min(2).max(50),
  locationId: z.string().min(2).max(50),
  capabilityId: z.string().min(2).max(50),
});

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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      locationId: "",
      capabilityId: "",
    },
  });

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

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    printerMutation.mutate(values);
  }

  const [selectedForm, setSelectedForm] = useState<
    "location" | "cap" | undefined
  >();

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Dialog>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Printer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="printer name" {...field} />
                  </FormControl>
                  <FormDescription>The printer name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="locationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Printer Location</FormLabel>
                  <div className="flex">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select printer location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations?.map((location) => (
                          <SelectItem
                            value={location.locationId!}
                          >{`${location.address} ${location.city}`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <DialogTrigger className="px-2">
                      <span onClick={() => setSelectedForm("location")}>+</span>
                    </DialogTrigger>
                  </div>
                  <FormDescription>Select printer location</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capabilityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Printer Spec</FormLabel>
                  <div className="flex">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select printer spec" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {printerCapabilities?.map((cap) => (
                          <SelectItem
                            value={cap.capabilityId!}
                          >{`${cap.printType} ${cap.volumeCapacity}`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <DialogTrigger className="px-2">
                      <span onClick={() => setSelectedForm("cap")}>+</span>
                    </DialogTrigger>
                  </div>
                  <FormDescription>Select printer spec</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add Order</Button>
          </form>
        </Form>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new one</DialogTitle>
          </DialogHeader>
          {selectedForm === "location" && <LocationForm />}
          {selectedForm === "cap" && <PrinterCapabilityForm />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddPrinter;
