"use client";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import styles from "./LocationBar.module.scss";
import { Location } from "@/types";

type SearchBarProps = {
  onSearch: (facility: Location) => void;
};

const MAX_COORD = 180;
const MIN_COORD = -180;

export const LocationBar = ({ onSearch }: SearchBarProps) => {
  const [searchLongitude, setSearchLongitude] = useState<number | "">("");
  const [searchLatitude, setSearchLatitude] = useState<number | "">("");
  const [searchAllowAll, setSearchAllowAll] = useState("");

  const onSearchLongitudeUpdate = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || value === null) {
      setSearchLongitude("");
      return;
    }

    const newValue = Number(value);
    if (!isNaN(newValue) && newValue <= MAX_COORD && newValue >= MIN_COORD) {
      setSearchLongitude(newValue);
    }
  }, []);

  const onSearchLatitudeUpdate = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || value === null) {
      setSearchLatitude("");
      return;
    }

    const newValue = Number(value);
    if (!isNaN(newValue) && newValue <= MAX_COORD && newValue >= MIN_COORD) {
      setSearchLatitude(newValue);
    }
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
      longitude: String(searchLongitude),
      latitude: String(searchLatitude),
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
          id="longitudeInput"
          className={styles.searchInput}
          type="number"
          max="180"
          min={MIN_COORD}
          value={searchLongitude}
          onKeyDown={(evt) => ["e", "E", "+"].includes(evt.key) && evt.preventDefault()}
          onChange={onSearchLongitudeUpdate}
          placeholder="Enter Longitude Here"
        />
        <input
          id="latitudeInput"
          className={styles.searchInput}
          type="number"
          max={MAX_COORD}
          min={MIN_COORD}
          value={searchLatitude}
          onKeyDown={(evt) => ["e", "E", "+"].includes(evt.key) && evt.preventDefault()}
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
