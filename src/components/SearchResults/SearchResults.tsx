"use client";

import { FoodFacility, Status } from "@/types";
import styles from "./SearchResults.module.scss";
import cx from "classnames";

type SearchResultsProps = {
  facilities: readonly FoodFacility[];
  isLoading: boolean;
  isEnabled?: boolean;
};

export const SearchResults = ({ facilities, isLoading, isEnabled }: SearchResultsProps) => {
  return isLoading ? (
    // TODO: Make the loading state prettier
    <div className={styles.emptyResults}>Loading...</div>
  ) : (
    <div className={styles.allResultsContainer}>
      {facilities.length ? (
        facilities.map((f) => {
          const facilityInfo = `${f.name}`;
          return (
            <div className={styles.searchResultContainer} key={f.id}>
              <button
                className={cx(styles.searchResult, {
                  [styles.approved]: f.status === Status.APPROVED,
                  [styles.pending]: f.status === Status.REQUESTED || f.status === Status.ISSUED,
                  [styles.rejected]: f.status === Status.SUSPEND || f.status === Status.EXPIRED,
                })}
                key={`${f.id}-button`}
                popoverTarget={f.id}
              >
                {facilityInfo}
              </button>
              <div key={`${f.id}-popover`} id={f.id} popover="hint" className={styles.popover}>
                <div className={styles.propRow}>
                  <div className={styles.label}>ID</div>
                  <div className={styles.value}>{f.id}</div>
                </div>
                <div className={styles.propRow}>
                  <div className={styles.label}>Name</div>
                  <div className={styles.value}>{f.name}</div>
                </div>
                {f.streetName && (
                  <div className={styles.propRow}>
                    <div className={styles.label}>Address</div>
                    <div className={styles.value}>
                      {f.streetNumber} {f.streetName}
                    </div>
                  </div>
                )}
                <div className={styles.propRow}>
                  <div className={styles.label}>Status</div>
                  <div className={styles.value}>{f.status}</div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        // TODO: Make this empty state prettier
        <div className={styles.emptyResults}>
          {isEnabled ? "No Results Found" : "Enter a search query"}
        </div>
      )}
    </div>
  );
};
