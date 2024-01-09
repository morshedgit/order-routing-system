"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ViewPrinters from "./ViewPrinters";
import Link from "next/link";

const queryClient = new QueryClient();

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <header className="w-full flex p-4 border-b-solid border-b-2">
        <Link href="/">Home</Link>
        <div className="flex-grow flex justify-end">
          <Link href="/">Login</Link>
        </div>
      </header>
      <main className="flex items-start">
        <ViewPrinters />
        <div className="divider divider-horizontal"></div>
        {children}
      </main>
    </QueryClientProvider>
  );
}
