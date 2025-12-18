import { FoodFacility } from "@/types";

export type Location = {
  longitude: string;
  latitude: string;
  allowAll?: boolean;
};

const BASE_URL = "http://localhost:3000";

export const getFacilities = async (foodFacility: Partial<FoodFacility>) => {
  const url = new URL("/api/search", BASE_URL);

  Object.entries(foodFacility).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load entity connections (${response.status})`);
  }

  const data = await response.json();
  return data as readonly FoodFacility[];
};

export const getNearbyFacilities = async (location: Location) => {
  const url = new URL("/api/closest", BASE_URL);

  Object.entries(location).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load entity connections (${response.status})`);
  }

  const data = await response.json();
  return data as readonly FoodFacility[];
};
