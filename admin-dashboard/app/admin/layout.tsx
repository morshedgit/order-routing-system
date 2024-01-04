
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ViewPrinters from './ViewPrinters';

const queryClient = new QueryClient();


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex items-start">
        <ViewPrinters/>
        <div className="divider divider-horizontal"></div>
        {children}
      </main>
    </QueryClientProvider>
  )
}
