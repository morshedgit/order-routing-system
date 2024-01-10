import React from "react";
import { OrderProgress } from "./page";

// ... other interfaces

// The component
const OrderProgressComponent: React.FC<{ orderProgress: OrderProgress }> = ({
  orderProgress,
}) => {
  return (
    <article className="p-4 bg-white rounded-lg shadow-md">
      <header className="mb-2">
        <h2 className="text-lg font-semibold">Order Progress</h2>
      </header>
      <section>
        <p>
          <strong>Order ID:</strong> {orderProgress.orderId}
        </p>
        <p>
          <strong>Customer:</strong> {orderProgress.order.customer.name}
        </p>
        <p>
          <strong>Specifications:</strong>
          Size - {orderProgress.order.specifications.size}, Type -{" "}
          {orderProgress.order.specifications.paperType}
        </p>
        <p>
          <strong>Printer:</strong>
          {orderProgress.printer?.name}
          (Location: {orderProgress.printer?.location.city})
        </p>
      </section>
    </article>
  );
};

export default OrderProgressComponent;
