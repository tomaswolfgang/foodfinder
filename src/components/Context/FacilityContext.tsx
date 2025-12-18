"use client";

import { FoodFacility, Location } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { getFacilities, getNearbyFacilities } from "./queries";

type FacilityProviderData = {
  facilities: readonly FoodFacility[];
  nearbyFacilities: readonly FoodFacility[];
  isSearchQueryLoading: boolean;
  locationSearchEnabled: boolean;
  isNearbyQueryLoading: boolean;
  search: (facility: Partial<FoodFacility>) => void;
  searchName: (name: string) => void;
  searchStreetName: (name: string) => void;
  searchLocation: (location: Location) => void;
};

const FacilitiesContext = createContext<FacilityProviderData | null>(null);

type FacilityProviderProps = {
  children?: React.ReactNode;
};

export function FacilitiesProvider({ children }: FacilityProviderProps) {
  const [searchCriteria, setSearchCriteria] = useState<Partial<FoodFacility>>({});
  const [location, setLocation] = useState<Location>({ longitude: "", latitude: "" });

  const searchKey = useMemo(() => {
    return ["SEARCH", ...Object.entries(searchCriteria).map(([key, value]) => `${key}=${value}`)];
  }, [searchCriteria]);

  const locationSearchKey = useMemo(() => {
    return ["NEARBY_SEARCH", ...Object.entries(location).map(([key, value]) => `${key}=${value}`)];
  }, [location]);

  const locationSearchEnabled = useMemo(() => {
    return !!location.latitude && !!location.longitude;
  }, [location]);

  const { data: facilities, isLoading: isSearchQueryLoading } = useQuery({
    queryKey: searchKey,
    queryFn: async () => getFacilities(searchCriteria),
  });

  const { data: nearbyFacilities, isLoading: isNearbyQueryLoading } = useQuery({
    queryKey: locationSearchKey,
    enabled: locationSearchEnabled,
    queryFn: async () => getNearbyFacilities(location),
  });

  const searchName = useCallback((name: string) => {
    setSearchCriteria({ name });
  }, []);

  const searchStreetName = useCallback((streetName: string) => {
    setSearchCriteria({ streetName });
  }, []);

  const searchLocation = useCallback((location: Location) => {
    setLocation(location);
  }, []);

  return (
    <FacilitiesContext.Provider
      value={{
        facilities: facilities ?? [],
        nearbyFacilities: nearbyFacilities ?? [],
        locationSearchEnabled,
        isSearchQueryLoading,
        isNearbyQueryLoading,
        search: setSearchCriteria,
        searchName,
        searchStreetName,
        searchLocation,
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
