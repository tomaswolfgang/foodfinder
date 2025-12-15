"use client";

import { FoodFacility } from "@/types/FoodFacilityTypes";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

type FacilityProviderData = {
  facilities: readonly FoodFacility[];
  isSearchLoading: boolean;
  search: (facility: FoodFacility) => void;
  searchName: (name: string) => void;
  searchStreetName: (name: string) => void;
};

const FacilitiesContext = createContext<FacilityProviderData | null>(null);

type FacilityProviderProps = {
  children?: React.ReactNode;
};

const BASE_URL = "http://localhost:3000";

const getFacilities = async (foodFacility: Partial<FoodFacility>) => {
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

export function FacilitiesProvider({ children }: FacilityProviderProps) {
  const [searchCriteria, setSearchCriteria] = useState<Partial<FoodFacility>>({});

  const searchKey = useMemo(() => {
    return ["SEARCH", ...Object.entries(searchCriteria).map(([key, value]) => `${key}=${value}`)];
  }, [searchCriteria]);

  const { data: facilities, isLoading: isSearchLoading } = useQuery({
    queryKey: searchKey,
    queryFn: async () => getFacilities(searchCriteria),
  });

  const searchName = useCallback((name: string) => {
    setSearchCriteria({ name });
  }, []);

  const searchStreetName = useCallback((streetName: string) => {
    setSearchCriteria({ streetName });
  }, []);

  return (
    <FacilitiesContext.Provider
      value={{
        facilities: facilities ?? [],
        isSearchLoading,
        search: setSearchCriteria,
        searchName,
        searchStreetName,
      }}
    >
      {children}
    </FacilitiesContext.Provider>
  );
}

export function useFacilities() {
  const context = useContext(FacilitiesContext);
  if (!context) {
    throw new Error("useFacilities must be used within a FacilitiesProvider");
  }
  return context;
}
