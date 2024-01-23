// pages/customer/add-order.tsx
"use client";
"use client";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_ORDER_URL } from "@/common/constants";
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

import { OrderSpecification } from "./order-specifications/page";
import { SpecificationForm } from "./add-order-specification/add-specification-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { httpService } from "@/common/services/http";

const CUSTOMER_ID = "4a8737bc-beb4-4f27-87d9-8f804d6538d2";

interface OrderResponse {
  message: string;
  orderId: string;
}

interface OrderError {
  message: string;
}

interface OrderData {
  customerId: string; // Assuming the customer ID is known
  specificationsId: string;
}
const formSchema = z.object({
  specificationsId: z.string(),
});

// Assuming you have a function to fetch orderSpecifications
async function fetchOrderSpecifications(): Promise<OrderSpecification[]> {
  // Fetch orderSpecifications from your API
  const response = await httpService(`${API_ORDER_URL}/order-specifications`); // Adjust API endpoint as needed
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

const addOrder = async (order: OrderData): Promise<OrderResponse> => {
  const response = await httpService(`${API_ORDER_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const result = await response.json();
  return result;
};

const OrderForm: React.FC = () => {
  const { data: orderSpecifications, isLoading } = useQuery<
    OrderSpecification[]
  >({
    queryKey: ["order-specifications"],
    queryFn: fetchOrderSpecifications,
  });

  const form = useForm<OrderData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: CUSTOMER_ID,
      specificationsId: "",
    },
  });

  const queryClient = useQueryClient();

  const orderMutation = useMutation<OrderResponse, OrderError, OrderData>({
    mutationFn: addOrder,
    onSuccess: (data) => {
      console.log("Order added successfully:", data);
      // Perform any additional actions on
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      window.location.assign(`/orders/${data.orderId}`);
    },
    onError: (error) => {
      console.error("Error adding order:", error.message);
    },
  });

  const handleSubmit = (values: OrderData) => {
    orderMutation.mutate(values);
  };

  // Form fields for order specifications
  return (
    <>
      <Dialog>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="p-8">
            <FormField
              control={form.control}
              name="specificationsId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className="flex">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a spec" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {orderSpecifications?.map((spec) => (
                          <SelectItem
                            value={spec.specificationsId}
                          >{`${spec.paperType} ${spec.size} ${spec.quantity}`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <DialogTrigger className="px-2">+</DialogTrigger>
                  </div>
                  <FormDescription>
                    Select a spec to create your order
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add Order</Button>
          </form>
        </Form>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new specification</DialogTitle>
            <DialogDescription>
              You can add as many specifications as you wish.
            </DialogDescription>
          </DialogHeader>
          <SpecificationForm />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrderForm;
