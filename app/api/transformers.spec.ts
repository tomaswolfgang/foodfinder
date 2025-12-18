import { FacilityType, FoodFacility, FoodFacilityCSV, Status } from "@/types";
import { parseAddress, prettifyCsvData, toFoodFacilityResponse } from "./transformers";

describe("transformers", () => {
  describe("parseAddress", () => {
    it("SHOULD return undefined WHEN address is falsey", () => {
      expect(parseAddress("")).toBeUndefined();
      expect(parseAddress(null as any)).toBeUndefined();
      expect(parseAddress(undefined as any)).toBeUndefined();
    });

    it("SHOULD handle address WHEN address is an assessors block", () => {
      const streetName = "ASSESSORS test";
      expect(parseAddress(streetName)).toEqual({
        streetName,
      });
    });

    it("SHOULD handle address WHEN address a number and street combo", () => {
      const streetName = "123 Geary ave";
      expect(parseAddress(streetName)).toEqual({
        streetNumber: 123,
        streetName: "Geary ave",
      });
    });
  });

  describe("prettifyCsvData", () => {
    it("SHOULD throw an error WHEN status type mapping doesnt map to anything -- aka I forgot to include a potential status value", () => {
      expect(() => prettifyCsvData({ Status: "hjahaa" } as any)).toThrow();
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

      expect(prettifyCsvData(initial)).toEqual(expected);

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

      expect(prettifyCsvData(initial2)).toEqual(expected2);
    });
  });
  describe("toFoodFacilityResponse", () => {
    it("SHOULD convert food facility to object with only response fields WHEN called", () => {
      const test: any = {
        id: "mockId",
        name: "mockName",
        status: "REJECTED",
        someOtherField: "hahaha lol",
      };

      expect(toFoodFacilityResponse(test)).toEqual({
        id: "mockId",
        name: "mockName",
        status: "REJECTED",
      });
    });
  });
});
