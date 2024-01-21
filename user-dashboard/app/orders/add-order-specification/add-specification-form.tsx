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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ORDER_URL } from "@/common/constants";

const addSpecification = async (
  spec: OrderSpecificationData
): Promise<SpecificationResponse> => {
  const response = await fetch(`${API_ORDER_URL}/order-specifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spec),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

interface SpecificationResponse {
  message: string;
}

interface SpecificationError {
  message: string;
}

interface OrderSpecificationData {
  size: string;
  paperType: string;
  quantity: number;
}

const formSchema = z.object({
  size: z.string().min(2).max(50),
  paperType: z.string().min(2).max(50),
  quantity: z.number().min(1).max(50),
});

export function SpecificationForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      size: "",
      paperType: "",
      quantity: 0,
    },
  });

  const queryClient = useQueryClient();

  const specificationMutation = useMutation<
    SpecificationResponse,
    SpecificationError,
    OrderSpecificationData
  >({
    mutationFn: addSpecification,
    onSuccess: (data) => {
      console.log("Specification added successfully:", data.message);
      // Perform any additional actions on success

      // Refetch printers after a successful deletion
      queryClient.invalidateQueries({ queryKey: ["order-specifications"] });
    },
    onError: (error) => {
      console.error("Error adding specification:", error.message);
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    specificationMutation.mutate(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Size</FormLabel>
              <FormControl>
                <Input placeholder="paper size" {...field} />
              </FormControl>
              <FormDescription>The paper size</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="order quantity"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormDescription>The order quantity</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paperType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input placeholder="paper type" {...field} />
              </FormControl>
              <FormDescription>The paper type</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
