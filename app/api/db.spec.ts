import { Readable } from "node:stream";
import {
  calculateNearestFacilities,
  FoodFacilityWithDistance,
  getClosestFacilities,
  loadAllData,
} from "./db";
import { createReadStream } from "node:fs";
import { prettifyCsvData } from "./transformers";
import BigNumber from "bignumber.js";

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
    it("SHOULD calculate distance AND return closest WHEN called", async () => {
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
    it("SHOULD reject WHEN stream emits an error", async () => {
      // TODO: I'm having trouble mocking a readstream error
    });
  });
});
