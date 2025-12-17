"use client";

import { FoodFacility } from "@/types";
import styles from "./SearchResults.module.scss";

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
        <div className={styles.searchResult}>
          {f.name} -- {f.streetNumber} {f.streetName} -- {f.status}
        </div>
      ))}
    </div>
  );
};
