import React from "react";
import { OrderProgress } from "./page";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { API_ORDER_URL } from "@/common/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

const deleteOrder = async (id: string): Promise<void> => {
  const response = await fetch(`${API_ORDER_URL}/orders/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
};
const OrderProgressComponent: React.FC<{ orderProgress: OrderProgress }> = ({
  orderProgress,
}) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      console.log("Order deleted successfully");
      // Refetch orders after a successful deletion
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
  return (
    <Card>
      <CardHeader className="mb-2">
        <h2 className="text-lg font-semibold">Order Progress</h2>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Order ID:</strong> {orderProgress.orderId}
        </p>
        <p>
          <strong>Customer:</strong> {orderProgress.order?.customer.name}
        </p>
        <p>
          <strong>Specifications:</strong>
          Size - {orderProgress.order?.specifications.size}, Type -{" "}
          {orderProgress.order?.specifications.paperType}
        </p>
        <p>
          <strong>Printer:</strong>
          {orderProgress.printer?.name}
          (Location: {orderProgress.printer?.location.city})
        </p>
      </CardContent>

      <CardFooter>
        <Button
          variant="destructive"
          onClick={() => deleteMutation.mutate(orderProgress.orderId)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderProgressComponent;
