// pages/admin/add-printer.tsx
'use client'

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { API_BASE_URL } from '@/common/constants';

// Define the type for the response data
interface PrinterResponse {
  message: string;
}

// Define a type for the error
interface PrinterError {
  message: string;
}

// Assuming you have a function to fetch locations
async function fetchLocations(): Promise<LocationData[]> {
  // Fetch locations from your API
  const response = await fetch(`${API_BASE_URL}/locations`); // Adjust API endpoint as needed
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

// Assuming you have a function to submit printer data
async function addPrinter(printerData: PrinterData): Promise<PrinterResponse> {
  // Submit printer data to your API
    const response = await fetch(`${API_BASE_URL}/printers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(printerData)
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
}

interface PrinterData {
  name: string;
  locationId: string;
}

interface LocationData {
  locationId?: string;
  address: string;
  city: string;
  createdAt?: string;
  updatedAt?: string;
}

const AddPrinter: React.FC = () => {
  const [printerData, setPrinterData] = useState<PrinterData>({ name: '', locationId: '' });
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  const { data: locations, isLoading } = useQuery<LocationData[]>({
    queryKey: ['locations'],
    queryFn: fetchLocations,
  });

  const printerMutation = useMutation<PrinterResponse, PrinterError, PrinterData>({
    mutationFn: addPrinter,
    onSuccess: (data) => {
      // Handle successful mutation here
      console.log('Location added successfully:', data.message);
    },
    onError: (error) => {
      // Handle error here
      console.error('Error adding location:', error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLocation && selectedLocation.locationId) {
      printerMutation.mutate({ ...printerData, locationId: selectedLocation.locationId });
    }
  };

  const handleLocationChange  = (value: string) => {
    const location = locations?.find(loc => loc.address === value);
    setSelectedLocation(location || null);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <form className="form-control w-full max-w-xs" onSubmit={handleSubmit}>
      <label className="label">
        <span className="label-text">Printer Name</span>
      </label>
      <input type="text" placeholder="Name" className="input input-bordered w-full max-w-xs" 
             value={printerData.name} onChange={(e) => setPrinterData({ ...printerData, name: e.target.value })} />

      <label className="label">
        <span className="label-text">Location</span>
      </label>
      <input list="locationList" placeholder="Location" className="input input-bordered w-full max-w-xs"
             onChange={e=>handleLocationChange(e.target.value)} />
      <datalist id="locationList">
        {locations?.map(location => (
          <option key={location.locationId} value={location.address} />
        ))}
      </datalist>

      <button type="submit" className="btn btn-primary mt-4">Add Printer</button>
    </form>
  );
};

export default AddPrinter;
