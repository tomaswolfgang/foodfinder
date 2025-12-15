"use client";

import { FoodFacility } from "@/types/FoodFacilityTypes";

type SearchResultsProps = {
  facilities: readonly FoodFacility[];
  isLoading: boolean;
};

export const SearchResults = ({ facilities, isLoading }: SearchResultsProps) => {
  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      {facilities.map((f) => (
        <div>
          {f.name} -- {f.streetNumber} {f.streetName} -- {f.status}
        </div>
      ))}
    </div>
  );
};
