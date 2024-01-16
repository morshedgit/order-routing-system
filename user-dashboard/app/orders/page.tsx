import Link from "next/link";

const Index = () => {
  return (
    <div className="flex flex-col">
      <Link href="/orders/add-order" className="p-4">
        Add New Order
      </Link>
    </div>
  );
};

export default Index;
