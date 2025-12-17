"use client";
import { FoodFacility, Status } from "@/types/FoodFacilityTypes";
import { ChangeEvent, ChangeEventHandler, useCallback, useEffect, useMemo, useState } from "react";
import styles from "./SearchBar.module.scss";

type SearchBarProps = {
  onSearch: (facility: Partial<FoodFacility>) => void;
  setIsSearchLoading: (loading: boolean) => void;
};

const DEBOUNCE_TIME_MS = 100;

enum SEARCH_TYPES {
  NAME = "name",
  STREET = "streetName",
}

export const SearchBar = ({ onSearch, setIsSearchLoading }: SearchBarProps) => {
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState(SEARCH_TYPES.NAME);
  const [searchStatus, setSearchStatus] = useState<Status | "">("");

  const onSearchTextUpdate = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value ?? "");
  }, []);

  const onSearchTypeUpdate = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setSearchText("");
    setSearchType(e.target.value as SEARCH_TYPES);
  }, []);

  const onSearchStatusUpdate = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setSearchStatus(e.target.value as Status);
  }, []);

  const searchCriteria = useMemo(() => {
    const critera: Partial<FoodFacility> = {};

    if (searchType === SEARCH_TYPES.NAME) {
      critera.name = searchText;
    } else {
      critera.streetName = searchText;
    }

    if (searchStatus) {
      critera.status = searchStatus;
    }

    return critera;
  }, [searchType, searchText, searchStatus]);

  useEffect(() => {
    setIsSearchLoading(true);
    // debounce only text changes
    const timeoutId = setTimeout(() => {
      onSearch(searchCriteria);
      setIsSearchLoading(false);
    }, DEBOUNCE_TIME_MS);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchText]);

  useEffect(() => {
    // immediate search call on other changes
    onSearch(searchCriteria);
  }, [searchType, searchStatus]);

  return (
    <div className={styles.searchBarContainer}>
      <div className={styles.searchBar}>
        <input
          className={styles.searchInput}
          type="text"
          value={searchText}
          onChange={onSearchTextUpdate}
          placeholder="Enter Search Query Here"
        />
        <select
          id="searchTypeSelect"
          name="searchType"
          className={styles.searchTypeSelector}
          onChange={onSearchTypeUpdate}
          value={searchType}
        >
          <option key={SEARCH_TYPES.NAME} value={SEARCH_TYPES.NAME}>
            Search By Name
          </option>
          <option key={SEARCH_TYPES.STREET} value={SEARCH_TYPES.STREET}>
            Search By Street
          </option>
        </select>
      </div>
      <div className={styles.searchBar}>
        <div className={styles.filterPill}>
          <label htmlFor="statusFilter">Status</label>
          <select
            id="statusFilter"
            name="statusFilter"
            onChange={onSearchStatusUpdate}
            className={styles.statusSelector}
            value={searchStatus}
          >
            {Object.values(Status).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
            <option key="all" value="">
              ALL
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};
