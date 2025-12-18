"use client";
import { LocationBar } from "@components/LocationBar";
import { useFacilities } from "@components/Context";
import styles from "./page.module.scss";
import { SearchResults } from "@/components/SearchResults";

export default function Home() {
  const { searchLocation, locationSearchEnabled, nearbyFacilities, isNearbyQueryLoading } =
    useFacilities();

  return (
    <main className={styles.pageContainer}>
      <div className={styles.stickyContent}>
        <LocationBar onSearch={searchLocation} />
      </div>
      <SearchResults
        facilities={nearbyFacilities}
        isEnabled={locationSearchEnabled}
        isLoading={isNearbyQueryLoading}
      />
    </main>
  );
}
