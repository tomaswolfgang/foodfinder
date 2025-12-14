"use client";
import { SearchBar } from "@components/SearchBar";
import { FacilitiesProvider } from "@components/Context";
import styles from "./page.module.scss";

export default function Home() {
  const onSearch = (searchText: string) => {
    console.info("TEST! ", searchText);
  };
  return (
    <main className={styles.pageContainer}>
      test
      <FacilitiesProvider>
        <SearchBar onSearch={onSearch} />
      </FacilitiesProvider>
    </main>
  );
}
