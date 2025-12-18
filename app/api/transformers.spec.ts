import { FacilityType, FoodFacility, FoodFacilityCSV, Status } from "@/types";
import * as Transformers from "./transformers";

describe("transformers", () => {
  describe("parseAddress", () => {
    it("SHOULD return undefined WHEN address is falsey", () => {
      expect(Transformers.parseAddress("")).toBeUndefined();
      expect(Transformers.parseAddress(null as any)).toBeUndefined();
      expect(Transformers.parseAddress(undefined as any)).toBeUndefined();
    });

    it("SHOULD handle address WHEN address is an assessors block", () => {
      const streetName = "ASSESSORS test";
      expect(Transformers.parseAddress(streetName)).toEqual({
        streetName,
      });
    });

    it("SHOULD handle address WHEN address a number and street combo", () => {
      const streetName = "123 Geary ave";
      expect(Transformers.parseAddress(streetName)).toEqual({
        streetNumber: 123,
        streetName: "Geary ave",
      });
    });
  });

  describe("prettifyCsvData", () => {
    it("SHOULD throw an error WHEN status type mapping doesnt map to anything -- aka I forgot to include a potential status value", () => {
      expect(() => Transformers.prettifyCsvData({ Status: "hjahaa" } as any)).toThrow();
    });

    it("SHOULD map the csv row to a prettier structure WHEN called", () => {
      const initial: FoodFacilityCSV = {
        locationid: "mockLocationId",
        Applicant: "mockApplicant",
        Longitude: "123.123123123123",
        Latitude: "456.456456456456",
        Status: "APPROVED",
        permit: "mockPermit",
        Address: "1 test st",
        LocationDescription: "haha",
        FoodItems: "mockFoodItems",
        FacilityType: "mockFacilityType",
      };

      const expected: FoodFacility = {
        id: "mockLocationId",
        name: "mockApplicant",
        longitude: 123.123123123123,
        latitude: 456.456456456456,
        status: Status.APPROVED,
        permit: "mockPermit",
        streetName: "test st",
        streetNumber: 1,
      };

      expect(Transformers.prettifyCsvData(initial)).toEqual(expected);

      const initial2: FoodFacilityCSV = {
        locationid: "mockLocationId",
        Applicant: "mockApplicant",
        Longitude: "123.123123123123",
        Latitude: "456.456456456456",
        Status: "APPROVED",
        permit: "mockPermit",
        Address: "",
        LocationDescription: "haha",
        FoodItems: "mockFoodItems",
        FacilityType: "Push Cart",
      };

      const expected2: FoodFacility = {
        id: "mockLocationId",
        name: "mockApplicant",
        longitude: 123.123123123123,
        latitude: 456.456456456456,
        status: Status.APPROVED,
        permit: "mockPermit",
        facilityType: FacilityType.PUSH_CART,
      };

      expect(Transformers.prettifyCsvData(initial2)).toEqual(expected2);
    });
  });
});
