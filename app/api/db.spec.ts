import { Readable } from "node:stream";
import {
  calculateNearestFacilities,
  facilityCompare,
  FoodFacilityWithDistance,
  getClosestFacilities,
  loadAllData,
  loadFilteredData,
} from "./db";
import { createReadStream } from "node:fs";
import { prettifyCsvData } from "./transformers";
import BigNumber from "bignumber.js";
import { FoodFacility } from "@/types";

jest.mock("node:fs", () => ({
  createReadStream: jest.fn(),
}));

jest.mock("./transformers", () => ({
  prettifyCsvData: jest.fn((p) => p),
}));

describe("db or at least this pseudo db", () => {
  describe("loadAllData", () => {
    it("SHOULD read csv data and call prettify function on each row WHEN called", async () => {
      let i = 0;
      const rows = ["id,name\n", "1,tommy\n", "2,timmy\n"];
      const mockEventStream = new Readable({
        objectMode: true,
        read: function (size) {
          if (i < rows.length) {
            const buf = Buffer.from(rows[i], "ascii");
            const chunk = this.push(buf);
            i++;
            return chunk;
          } else {
            return this.push(null);
          }
        },
      });

      (createReadStream as jest.Mock).mockImplementationOnce(() => mockEventStream);

      const data = await loadAllData();

      expect(prettifyCsvData).toHaveBeenCalledTimes(rows.length - 1);
      expect(data).toEqual([
        { id: "1", name: "tommy" },
        { id: "2", name: "timmy" },
      ]);
    });

    it("SHOULD reject WHEN stream emits an error", async () => {
      // TODO: I'm having trouble mocking a readstream error
    });
  });

  describe("facilityCompare", () => {
    it("SHOULD compare every criteria to a FoodFacility WHEN called", () => {
      const mockFoodFacility = {
        id: "mockId",
        name: "mockName",
        streetName: "mockStreet1",
        status: "mockStatus",
      } as unknown as FoodFacility;

      const mockFoodFacility2 = {
        id: "mockId",
        name: "otherName",
        streetName: "otherStreet",
        status: "mockStatus",
      } as unknown as FoodFacility;

      const criteria: Partial<FoodFacility> = {
        name: "MocKN", // should be case insensitive and include partial values
      };

      const criteria2: Partial<FoodFacility> = {
        name: "oTHER",
        streetName: "oThErStReet",
      };

      expect(facilityCompare(mockFoodFacility, criteria)).toBe(true);
      expect(facilityCompare(mockFoodFacility2, criteria)).toBe(false);
      expect(facilityCompare(mockFoodFacility2, criteria2)).toBe(true);
    });
  });

  describe("loadFilteredData", () => {
    it("SHOULD filter data as it is read and respond with full filtered data WHEN called", async () => {
      const criteria: Partial<FoodFacility> = {
        name: "tom",
      };
      let i = 0;
      const rows = ["id,name\n", "1,tommy\n", "2,timmy\n", "3,tommothy\n"];
      const mockEventStream = new Readable({
        objectMode: true,
        read: function (size) {
          if (i < rows.length) {
            const buf = Buffer.from(rows[i], "ascii");
            const chunk = this.push(buf);
            i++;
            return chunk;
          } else {
            return this.push(null);
          }
        },
      });

      (createReadStream as jest.Mock).mockImplementationOnce(() => mockEventStream);

      const data = await loadFilteredData(criteria);

      expect(prettifyCsvData).toHaveBeenCalledTimes(rows.length - 1);
      expect(data).toEqual([
        { id: "1", name: "tommy" },
        { id: "3", name: "tommothy" },
      ]);
    });
  });

  describe("calculateNearestFacilities", () => {
    it("SHOULD add facility WHEN current nearest array is empty", () => {
      const mockFacilityToCheck = {
        absoluteDistance: BigNumber(10),
      } as unknown as FoodFacilityWithDistance;

      const mockExistingNearest = [] as FoodFacilityWithDistance[];

      expect(calculateNearestFacilities(mockExistingNearest, mockFacilityToCheck)).toEqual([
        mockFacilityToCheck,
      ]);
    });

    it("SHOULD add facility WHEN current nearest array when array isnt full", () => {
      const mockFacilityToCheck = {
        absoluteDistance: BigNumber(10),
      } as unknown as FoodFacilityWithDistance;

      const mockExistingNearest = [
        { absoluteDistance: BigNumber(3) },
        { absoluteDistance: BigNumber(4) },
      ] as unknown as FoodFacilityWithDistance[];

      expect(calculateNearestFacilities(mockExistingNearest, mockFacilityToCheck)).toEqual([
        mockExistingNearest[0],
        mockExistingNearest[1],
        mockFacilityToCheck,
      ]);
    });

    it("SHOULD add facility in ordered position WHEN facility to check has smaller absolute distance than existing facility in array", () => {
      const mockFacilityToCheck = {
        absoluteDistance: BigNumber(4),
      } as unknown as FoodFacilityWithDistance;

      const mockExistingNearest = [
        { absoluteDistance: BigNumber(3) },
        { absoluteDistance: BigNumber(5) },
      ] as unknown as FoodFacilityWithDistance[];

      expect(calculateNearestFacilities(mockExistingNearest, mockFacilityToCheck)).toEqual([
        mockExistingNearest[0],
        mockFacilityToCheck,
        mockExistingNearest[1],
      ]);
    });

    it("SHOULD replace largest dist with new facility in ordered position WHEN facility to check has smaller absolute distance than an existing facility in array", () => {
      const mockFacilityToCheck = {
        absoluteDistance: BigNumber(4),
      } as unknown as FoodFacilityWithDistance;

      const mockExistingNearest = [
        { absoluteDistance: BigNumber(1) },
        { absoluteDistance: BigNumber(1) },
        { absoluteDistance: BigNumber(1) },
        { absoluteDistance: BigNumber(3) },
        { absoluteDistance: BigNumber(5) },
      ] as unknown as FoodFacilityWithDistance[];

      expect(calculateNearestFacilities(mockExistingNearest, mockFacilityToCheck)).toEqual([
        mockExistingNearest[0],
        mockExistingNearest[1],
        mockExistingNearest[2],
        mockExistingNearest[3],
        mockFacilityToCheck,
      ]);
    });

    it("SHOULD skip adding facility WHEN facility dist is greater than all dists in array", () => {
      const mockFacilityToCheck = {
        absoluteDistance: BigNumber(10),
      } as unknown as FoodFacilityWithDistance;

      const mockExistingNearest = [
        { absoluteDistance: BigNumber(1) },
        { absoluteDistance: BigNumber(1) },
        { absoluteDistance: BigNumber(1) },
        { absoluteDistance: BigNumber(3) },
        { absoluteDistance: BigNumber(5) },
      ] as unknown as FoodFacilityWithDistance[];

      expect(calculateNearestFacilities(mockExistingNearest, mockFacilityToCheck)).toEqual(
        mockExistingNearest
      );
    });
  });

  describe("getClosestFacilities", () => {
    it("SHOULD calculate distance AND return closest any status facility WHEN called with allowAll=true", async () => {
      (prettifyCsvData as jest.Mock).mockImplementation(({ longitude, latitude }) => ({
        longitude: Number(longitude),
        latitude: Number(latitude),
      }));
      let i = 0;
      const rows = ["longitude,latitude\n", "1,1\n", "3,3\n", "3,3\n", "3,3\n", "4,4\n", "4,4\n"];
      const mockEventStream = new Readable({
        objectMode: true,
        read: function (size) {
          if (i < rows.length) {
            const buf = Buffer.from(rows[i], "ascii");
            const chunk = this.push(buf);
            i++;
            return chunk;
          } else {
            return this.push(null);
          }
        },
      });

      (createReadStream as jest.Mock).mockImplementationOnce(() => mockEventStream);

      const data = await getClosestFacilities(2, 2, true);

      expect(prettifyCsvData).toHaveBeenCalledTimes(rows.length - 1);
      expect(data).toEqual([
        { longitude: 1, latitude: 1, absoluteDistance: expect.any(BigNumber) },
        { longitude: 3, latitude: 3, absoluteDistance: expect.any(BigNumber) },
        { longitude: 3, latitude: 3, absoluteDistance: expect.any(BigNumber) },
        { longitude: 3, latitude: 3, absoluteDistance: expect.any(BigNumber) },
        { longitude: 4, latitude: 4, absoluteDistance: expect.any(BigNumber) },
      ]);
    });

    it("SHOULD calculate distance AND return closest approved facility WHEN called without allowAll", async () => {
      (prettifyCsvData as jest.Mock).mockImplementation(({ longitude, latitude, status }) => ({
        longitude: Number(longitude),
        latitude: Number(latitude),
        status,
      }));
      let i = 0;
      const rows = [
        "longitude,latitude,status\n",
        "1,1,EXPIRED\n",
        "3,3,APPROVED\n",
        "3,3,REQUESTED\n",
        "3,3,REQUESTED\n",
        "4,4,REQUESTED\n",
        "4,4,REQUESTED\n",
      ];
      const mockEventStream = new Readable({
        objectMode: true,
        read: function (size) {
          if (i < rows.length) {
            const buf = Buffer.from(rows[i], "ascii");
            const chunk = this.push(buf);
            i++;
            return chunk;
          } else {
            return this.push(null);
          }
        },
      });

      (createReadStream as jest.Mock).mockImplementationOnce(() => mockEventStream);

      //WILL FILTER OUT ANY NON APPROVED FACILITIES
      const data = await getClosestFacilities(2, 2);

      expect(prettifyCsvData).toHaveBeenCalledTimes(rows.length - 1);
      expect(data).toEqual([
        { longitude: 3, latitude: 3, status: "APPROVED", absoluteDistance: expect.any(BigNumber) },
      ]);
    });
    it("SHOULD reject WHEN stream emits an error", async () => {
      // TODO: I'm having trouble mocking a readstream error
    });
  });
});
