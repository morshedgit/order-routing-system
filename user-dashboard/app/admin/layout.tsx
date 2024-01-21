"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

const queryClient = new QueryClient();

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <header className="w-full flex p-4 border-b-solid border-b-2">
        <Link href="/orders">Home</Link>
        <div className="flex-grow flex justify-end flex items-center gap-2">
          <Link href="/">Login</Link>
          <ModeToggle />
        </div>
      </header>
      <main className="w-full max-w-3xl flex items-start">{children}</main>
    </QueryClientProvider>
  );
}
