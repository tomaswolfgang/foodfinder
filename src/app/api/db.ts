import { createReadStream } from "node:fs";
import csv from "csv-parser";
import { type FoodFacility, type FoodFacilityCSV, Status } from "@/types";
import BigNumber from "bignumber.js";
import { prettifyCsvData } from "./transformers";

const NEAREST_LIMIT = 5;
const PATH_TO_CSV = process.env.PATH_TO_CSV;

if (!PATH_TO_CSV) throw Error("Please set the PATH_TO_CSV in your .env");

export const facilityCompare = (
  foodFacility: FoodFacility,
  criteria: Partial<FoodFacility>
): boolean => {
  return Object.entries(criteria).every(([key, value]) => {
    // Lets make searching case insensitive
    return foodFacility[key as keyof FoodFacility]
      ?.toString()
      .toUpperCase()
      .includes(value.toString().toUpperCase());
  });
};

export const loadFilteredData = (foodFacilityCriteria: Partial<FoodFacility>) =>
  new Promise<readonly FoodFacility[]>((resolve, reject) => {
    const results: FoodFacility[] = [];

    createReadStream(PATH_TO_CSV)
      .pipe(csv())
      .on("data", (data: FoodFacilityCSV) => {
        const foodFacility = prettifyCsvData(data);
        if (facilityCompare(foodFacility, foodFacilityCriteria)) {
          results.push(foodFacility);
        }
      })
      .on("end", () => {
        resolve(results as readonly FoodFacility[]);
      })
      .on("error", (err) => {
        reject(err);
      });
  });

export type FoodFacilityWithDistance = FoodFacility & { absoluteDistance: BigNumber };

export const calculateNearestFacilities = (
  currentNearest: FoodFacilityWithDistance[],
  facilityToCheck: FoodFacilityWithDistance
) => {
  if (!currentNearest.length) {
    return [...currentNearest, facilityToCheck];
  }

  const positionToAddResult = currentNearest.findIndex((result) =>
    facilityToCheck.absoluteDistance.isLessThan(result.absoluteDistance)
  );
  if (positionToAddResult >= 0) {
    // only splice in result if it is smaller than another result
    const newNearest = [
      ...currentNearest.slice(0, positionToAddResult),
      facilityToCheck,
      ...currentNearest.slice(positionToAddResult),
    ];

    return newNearest.length > NEAREST_LIMIT ? newNearest.slice(0, 5) : newNearest;
  } else if (currentNearest.length < NEAREST_LIMIT) {
    return [...currentNearest, facilityToCheck];
  }

  return currentNearest;
};

export const getClosestFacilities = (longitude: number, latitude: number, allowAll = false) =>
  new Promise<readonly FoodFacility[]>((resolve, reject) => {
    let results: FoodFacilityWithDistance[] = [];

    createReadStream(PATH_TO_CSV)
      .pipe(csv())
      .on("data", (data: FoodFacilityCSV) => {
        const foodFacility = prettifyCsvData(data);
        if (foodFacility.status !== Status.APPROVED && !allowAll) return;

        // TECHNICALLY we should use Harversine distance formula to calculate true proximity using longitude and latitude
        // but for simplicity I'm sticking with good ole pythagoras
        const longDist = BigNumber(foodFacility.longitude).minus(BigNumber(longitude)).pow(2);
        const latDist = BigNumber(foodFacility.latitude).minus(BigNumber(latitude)).pow(2);
        const absoluteDistance = longDist.plus(latDist).squareRoot();

        const foodFacilityWithDistance: FoodFacilityWithDistance = {
          ...foodFacility,
          absoluteDistance,
        };
        results = calculateNearestFacilities(results, foodFacilityWithDistance);
      })
      .on("end", () => {
        resolve(results as readonly FoodFacility[]);
      })
      .on("error", (err) => {
        reject(err);
      });
  });

/**
 * DEPRECATED - This was my old v1 implementation before I found the light in loadFilteredData
 * @returns All data from the csv in a JSON format
 */
export const loadAllData = () =>
  new Promise<readonly FoodFacility[]>((resolve, reject) => {
    const results: FoodFacility[] = [];

    createReadStream(PATH_TO_CSV)
      .pipe(csv())
      .on("data", (data: FoodFacilityCSV) => results.push(prettifyCsvData(data)))
      .on("end", () => {
        resolve(results as readonly FoodFacility[]);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
