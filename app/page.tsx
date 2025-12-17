"use client";
import { SearchBar } from "@components/SearchBar";
import { useFacilities } from "@components/Context";
import styles from "./page.module.scss";
import { SearchResults } from "@/components/SearchResults";

export default function Home() {
  const { search, setIsSearchLoading, facilities, isSearchLoading } = useFacilities();

  return (
    <main className={styles.pageContainer}>
      <div className={styles.stickyContent}>
        <SearchBar onSearch={search} setIsSearchLoading={setIsSearchLoading} />
      </div>
      <SearchResults facilities={facilities} isLoading={isSearchLoading} />
    </main>
  );
}
