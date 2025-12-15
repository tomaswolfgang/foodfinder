"use client";
import { FoodFacility } from "@/types/FoodFacilityTypes";
import { ChangeEvent, ChangeEventHandler, useCallback, useEffect, useState } from "react";

type SearchBarProps = {
  onSearch: (searchText: string) => void;
};

const DEBOUNCE_TIME_MS = 1000;

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchText, setSearchText] = useState("");

  const onSearchTextUpdate = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value ?? "");
  }, []);

  useEffect(() => {
    // debounce search text query
    const timeoutId = setTimeout(() => onSearch(searchText), DEBOUNCE_TIME_MS);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchText]);

  return (
    <div>
      <input type="text" value={searchText} onChange={onSearchTextUpdate} />
    </div>
  );
};
