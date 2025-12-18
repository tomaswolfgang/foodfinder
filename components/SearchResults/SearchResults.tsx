"use client";

import { FoodFacility } from "@/types";
import styles from "./SearchResults.module.scss";

type SearchResultsProps = {
  facilities: readonly FoodFacility[];
  isLoading: boolean;
};

export const SearchResults = ({ facilities, isLoading }: SearchResultsProps) => {
  return isLoading ? (
    // TODO: Make the loading state prettier
    <div>Loading...</div>
  ) : (
    <div>
      {facilities.length ? (
        facilities.map((f) => {
          const facilityInfo = `${f.name} (${f.id}) -- ${f.streetNumber ?? ""} ${
            f.streetName ?? ""
          } -- ${f.status}`;
          return (
            <div className={styles.searchResult} key={f.id}>
              {facilityInfo}
            </div>
          );
        })
      ) : (
        // TODO: Make this empty state prettier
        <div>No results found</div>
      )}
    </div>
  );
};
