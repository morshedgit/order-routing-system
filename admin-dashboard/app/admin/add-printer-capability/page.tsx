// pages/admin/add-printer-capability.tsx
"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_PRINTER_URL } from "@/common/constants";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mutation function with typed input and output
const addPrinterCapability = async (
  printerCapability: PrinterCapabilityData
): Promise<PrinterCapabilityResponse> => {
  const response = await httpService(
    `${API_PRINTER_URL}/printer-capabilities`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(printerCapability),
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

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

const formSchema = z.object({
  printType: z.string().min(2).max(50),
  volumeCapacity: z.number().min(2).max(50),
});

const PrinterCapabilityForm: React.FC = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      printType: "",
      volumeCapacity: 0,
    },
  });

  const queryClient = useQueryClient();

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

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="printType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input placeholder="Print Type" {...field} />
              </FormControl>
              <FormDescription>The Print Type</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="volumeCapacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input placeholder="Volume Capacity" {...field} />
              </FormControl>
              <FormDescription>The Volume Capacity</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default PrinterCapabilityForm;
