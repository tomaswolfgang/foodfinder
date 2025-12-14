"use client";

import { FoodFacility } from "@/types/FoodFacilityTypes";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface FacilityProviderProps {
  children?: React.ReactNode;
  facilities: readonly FoodFacility[];
}

const FacilitiesContext = createContext<FacilityProviderProps>({
  facilities: [],
});

export function FacilitiesProvider({ children }: FacilityProviderProps) {
  const [facilities, setFacilities] = useState<readonly FoodFacility[]>([]);

  return (
    <FacilitiesContext.Provider
      value={{
        facilities,
      }}
    >
      {children}
    </FacilitiesContext.Provider>
  );
}

export function useFacilities() {
  const context = useContext(FacilitiesContext);
  if (context === undefined) {
    throw new Error("useFacilities must be used within a FacilitiesProvider");
  }
  return context;
}
