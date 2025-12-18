"use client";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import styles from "./LocationBar.module.scss";
import { Location } from "../Context/queries";

type SearchBarProps = {
  onSearch: (facility: Location) => void;
};

export const LocationBar = ({ onSearch }: SearchBarProps) => {
  const [searchLongitude, setSearchLongitude] = useState("");
  const [searchLatitude, setSearchLatitude] = useState("");
  const [searchAllowAll, setSearchAllowAll] = useState("");

  const onSearchLongitudeUpdate = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchLongitude(e.target.value ?? "");
  }, []);

  const onSearchLatitudeUpdate = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchLatitude(e.target.value ?? "");
  }, []);

  const onSearchAllowAllUpdate = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setSearchAllowAll(e.target.value);
  }, []);

  useEffect(() => {
    return () => {
      // unmount actions: clear search data
      onSearch({ longitude: "", latitude: "" });
    };
  }, []);

  const searchLocation = useMemo(() => {
    const critera: Location = {
      longitude: searchLongitude,
      latitude: searchLatitude,
    };

    if (searchAllowAll === "true") {
      critera.allowAll = true;
    }

    return critera;
  }, [searchLongitude, searchLatitude, searchAllowAll]);

  const search = useCallback(() => {
    onSearch(searchLocation);
  }, [searchLocation, onSearch]);

  return (
    <div className={styles.searchBarContainer}>
      <div className={styles.searchBar}>
        <input
          className={styles.searchInput}
          type="text"
          value={searchLongitude}
          onChange={onSearchLongitudeUpdate}
          placeholder="Enter Longitude Here"
        />
        <input
          className={styles.searchInput}
          type="text"
          value={searchLatitude}
          onChange={onSearchLatitudeUpdate}
          placeholder="Enter Latitude Here"
        />
        <button onClick={search}> Search!</button>
      </div>
      <div className={styles.searchBar}>
        <div className={styles.filterPill}>
          <label htmlFor="statusFilter">Allow all statuses</label>
          <select
            id="statusFilter"
            name="statusFilter"
            onChange={onSearchAllowAllUpdate}
            className={styles.statusSelector}
            value={searchAllowAll}
          >
            <option key="false" value="">
              false
            </option>
            <option key="true" value="true">
              true
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};
