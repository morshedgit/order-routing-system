// pages/admin/add-location.tsx
'use client'

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { API_BASE_URL } from '@/common/constants';


// Define the type for your location data
export interface LocationData {
    locationId?: string,
    address: string,
    city: string,
    createdAt?: string,
    updatedAt?: string
}


// Define the type for the response data
interface LocationResponse {
  message: string;
}

// Define a type for the error
interface LocationError {
  message: string;
}

const AddLocation: React.FC = () => {
  const [locationData, setLocationData] = useState<LocationData>({ address: '', city: '' });

  // Mutation function with typed input and output
  const addLocation = async (location: LocationData): Promise<LocationResponse> => {
    const response = await fetch(`${API_BASE_URL}/locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(location)
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  // useMutation hook with TypeScript typing
  const mutation = useMutation<LocationResponse, LocationError, LocationData>({
    mutationFn: addLocation,
    onSuccess: (data) => {
      // Handle successful mutation here
      console.log('Location added successfully:', data.message);
    },
    onError: (error) => {
      // Handle error here
      console.error('Error adding location:', error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(locationData);
  };

  return (
    <form className="form-control w-full max-w-xs" onSubmit={handleSubmit}>
      <label className="label">
        <span className="label-text">Address</span>
      </label>
      <input type="text" placeholder="Address" className="input input-bordered w-full max-w-xs" 
             value={locationData.address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocationData({ ...locationData, address: e.target.value })} />

      <label className="label">
        <span className="label-text">City</span>
      </label>
      <input type="text" placeholder="City" className="input input-bordered w-full max-w-xs" 
             value={locationData.city} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocationData({ ...locationData, city: e.target.value })} />

      <button type="submit" className="btn btn-primary mt-4">Add Location</button>
    </form>
  );
};

export default AddLocation;
