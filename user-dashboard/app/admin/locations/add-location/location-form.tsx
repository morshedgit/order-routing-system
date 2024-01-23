// pages/admin/add-location.tsx
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
import { httpService } from "@/common/services/http";

// Mutation function with typed input and output
const LocationForm = async (
  location: LocationData
): Promise<LocationResponse> => {
  const response = await httpService(`${API_PRINTER_URL}/locations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(location),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

// Define the type for your location data
export interface LocationData {
  locationId?: string;
  address: string;
  city: string;
  createdAt?: string;
  updatedAt?: string;
}

// Define the type for the response data
interface LocationResponse {
  message: string;
}

// Define a type for the error
interface LocationError {
  message: string;
}

const formSchema = z.object({
  address: z.string().min(2).max(50),
  city: z.string().min(2).max(50),
});

const AddLocation: React.FC = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      city: "",
    },
  });

  const queryClient = useQueryClient();

  // useMutation hook with TypeScript typing
  const mutation = useMutation<LocationResponse, LocationError, LocationData>({
    mutationFn: LocationForm,
    onSuccess: (data) => {
      // Handle successful mutation here
      console.log("Location added successfully:", data.message);

      // Refetch printers after a successful deletion
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
    onError: (error) => {
      // Handle error here
      console.error("Error adding location:", error.message);
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
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Address" {...field} />
              </FormControl>
              <FormDescription>The Address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="order city" {...field} />
              </FormControl>
              <FormDescription>The order city</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default AddLocation;
