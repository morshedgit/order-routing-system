"use client";
import { API_ORDER_URL } from "@/common/constants";
import { useQuery } from "@tanstack/react-query";
import OrderProgressComponent from "./order-progress";
import { httpService } from "@/common/services/http";

export interface OrderProgress {
  orderId: string;
  order?: Order;
  printer?: Printer;
}

export interface Order {
  orderId: string;
  customerId: string;
  specificationsId: string;
  customer?: Customer | null;
  specifications: Specifications;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface Customer {
  customerId: string;
  name: string;
  contactDetails: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface Specifications {
  specificationsId: string;
  size: string;
  paperType: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface Printer {
  printerId: string;
  name: string;
  location: Location;
}

export interface Location {
  locationId: string;
  address: string;
  city: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

const fetchOrderProgress = async (orderId: string): Promise<OrderProgress> => {
  const response = await httpService(
    `${API_ORDER_URL}/orders/${orderId}/order-progress`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

type ViewOrderProps = { params: { orderId: string } };

const ViewOrder = (props: ViewOrderProps) => {
  const {
    data: orderProgressData,
    isLoading,
    error,
  } = useQuery<OrderProgress>({
    queryKey: ["orders", "order-progress"],
    queryFn: () => fetchOrderProgress(props.params.orderId),
  });

  if (!orderProgressData) return null;

  // return <pre>{JSON.stringify(orderProgressData, null, 2)}</pre>;
  return <OrderProgressComponent orderProgress={orderProgressData} />;
};

export default ViewOrder;
