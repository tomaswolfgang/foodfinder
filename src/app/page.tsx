"use client";
import { SearchBar } from "@components/SearchBar";
import { useFacilities } from "@components/Context";
import styles from "./page.module.scss";
import { SearchResults } from "@/components/SearchResults";

export default function Home() {
  const { search, facilities, isSearchQueryLoading } = useFacilities();

  return (
    <>
      <div className={styles.stickyContent}>
        <SearchBar onSearch={search} />
      </div>
      <SearchResults facilities={facilities} isEnabled isLoading={isSearchQueryLoading} />
    </>
  );
}
