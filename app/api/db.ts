import { createReadStream } from "node:fs";
import csv from "csv-parser";
import { type FoodFacility, type FoodFacilityCSV, Status } from "@/types";
import BigNumber from "bignumber.js";
import { prettifyCsvData } from "./transformers";

const DATASTORE_FILE =
  "/Users/thomaswong/Documents/projects/learning/interviewTrials/Rad AI/radai-take-home/app/api/data.csv";

const NEAREST_LIMIT = 5;

export const loadAllData = () =>
  new Promise<readonly FoodFacility[]>((resolve, reject) => {
    const results: FoodFacility[] = [];

    createReadStream(DATASTORE_FILE)
      .pipe(csv())
      .on("data", (data: FoodFacilityCSV) => results.push(prettifyCsvData(data)))
      .on("end", () => {
        resolve(results as readonly FoodFacility[]);
      })
      .on("error", (err) => {
        reject(err);
      });
  });

type FoodFacilityWithDistance = FoodFacility & { absoluteDistance: BigNumber };

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
  }

  return currentNearest;
};

export const getClosestFacilities = (longitude: number, latitude: number, approvedOnly = true) =>
  new Promise<readonly FoodFacility[]>((resolve, reject) => {
    let results: FoodFacilityWithDistance[] = [];

    createReadStream(DATASTORE_FILE)
      .pipe(csv())
      .on("data", (data: FoodFacilityCSV) => {
        const foodFacility = prettifyCsvData(data);
        if (approvedOnly && foodFacility.status !== Status.APPROVED) return;

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
