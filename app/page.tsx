"use client";
import { SearchBar } from "@components/SearchBar";
import { useFacilities } from "@components/Context";
import styles from "./page.module.scss";
import { SearchResults } from "@/components/SearchResults";

export default function Home() {
  const { searchName, searchStreetName, facilities, isSearchLoading } = useFacilities();
  return (
    <main className={styles.pageContainer}>
      <SearchBar onSearch={searchName} />
      <SearchResults facilities={facilities} isLoading={isSearchLoading} />
    </main>
  );
}
