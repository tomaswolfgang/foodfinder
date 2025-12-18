import { FacilityType, FoodFacility, Status } from "@/types";
import { searchBy, validateFoodFacilityQuery } from "./foodFacilityUtils";
import { CustomError } from "../ErrorCodes";

const SHOW_LOGS = false;

const mockFacilities: readonly FoodFacility[] = [
  {
    id: "mockId1",
    name: "mockName1",
    streetName: "mockStreetName1",
    streetNumber: 1,
    longitude: 1,
    latitude: 1,
    status: Status.APPROVED,
    facilityType: FacilityType.PUSH_CART,
    foodItems: "mockFoodItems1",
    permit: "mockPermit1",
  },
  {
    id: "mockId2",
    name: "mockName2",
    longitude: 2,
    latitude: 2,
    status: Status.SUSPEND,
    foodItems: "mockFoodItems2",
    permit: "mockPermit2",
  },
  {
    id: "mockId3",
    name: "mockName3",
    longitude: 3,
    latitude: 3,
    status: Status.REQUESTED,
    facilityType: FacilityType.TRUCK,
    foodItems: "mockFoodItems3",
    permit: "mockPermit3",
  },
];

describe("foodFacilityUtils", () => {
  describe("searchBy", () => {
    //console override to reduce logs
    console.error = SHOW_LOGS ? console.error : jest.fn();
    it("SHOULD return original facilities WHEN no search value is present to filter on", () => {
      const resultFacilities = searchBy(mockFacilities, "id", "");
      expect(resultFacilities).toEqual(mockFacilities);

      const resultFacilities2 = searchBy(mockFacilities, "id", undefined);
      expect(resultFacilities2).toEqual(mockFacilities);
    });

    it("SHOULD throw 400 error WHEN attempting to search by an non existent property", () => {
      expect(() =>
        searchBy(mockFacilities, "some-random-key" as keyof FoodFacility, "test")
      ).toThrow(new CustomError("NON_EXISTENT_SEARCH_PROPERTIES"));
    });

    describe("Filtering on search keys", () => {
      it("SHOULD filter on [id] WHEN  value is set", () => {
        const prop: keyof FoodFacility = "id";
        const value = mockFacilities[0].id;
        const resultFacilities = searchBy(mockFacilities, prop, value);
        expect(resultFacilities).toEqual([mockFacilities.find((f) => f[prop] === value)]);
      });
      it("SHOULD filter on [id] and return mutliple facilities WHEN value is included in many facilities", () => {
        const prop: keyof FoodFacility = "id";
        const value = "mock"; // this should be all three
        const resultFacilities = searchBy(mockFacilities, prop, value);
        expect(resultFacilities).toEqual(mockFacilities);
      });
      it("SHOULD filter on [name] WHEN  value is set", () => {
        const prop: keyof FoodFacility = "name";
        const value = mockFacilities[0].name;
        const resultFacilities = searchBy(mockFacilities, prop, value);
        expect(resultFacilities).toEqual([mockFacilities.find((f) => f[prop] === value)]);
      });
      it("SHOULD filter on [streetName] WHEN  value is set", () => {
        const prop: keyof FoodFacility = "streetName";
        const value = mockFacilities[0].streetName;
        const resultFacilities = searchBy(mockFacilities, prop, value);
        expect(resultFacilities).toEqual([mockFacilities.find((f) => f[prop] === value)]);
      });
      it("SHOULD filter on [foodItems] WHEN  value is set", () => {
        const prop: keyof FoodFacility = "foodItems";
        const value = mockFacilities[0].foodItems;
        const resultFacilities = searchBy(mockFacilities, prop, value);
        expect(resultFacilities).toEqual([mockFacilities.find((f) => f[prop] === value)]);
      });
      it("SHOULD filter on [permit] WHEN  value is set", () => {
        const prop: keyof FoodFacility = "permit";
        const value = mockFacilities[0].permit;
        const resultFacilities = searchBy(mockFacilities, prop, value);
        expect(resultFacilities).toEqual([mockFacilities.find((f) => f[prop] === value)]);
      });
    });

    describe("Filtering on enum keys", () => {
      it("SHOULD filter on [facilityType] WHEN  value is set AND is a valid enum value", () => {
        const prop: keyof FoodFacility = "facilityType";
        const value = mockFacilities[0].facilityType;
        const resultFacilities = searchBy(mockFacilities, prop, value);
        expect(resultFacilities).toEqual([mockFacilities.find((f) => f[prop] === value)]);
      });
      it("SHOULD throw 400 error WHEN value is NOT valid enum value", () => {
        const prop: keyof FoodFacility = "facilityType";
        const value = "some random value" as FacilityType;
        expect(() => searchBy(mockFacilities, prop, value)).toThrow(
          new CustomError("INVALID_SEARCH_ENUM")
        );
      });

      it("SHOULD filter on [status] WHEN  value is set AND is a valid enum value", () => {
        const prop: keyof FoodFacility = "status";
        const value = mockFacilities[0].status;
        const resultFacilities = searchBy(mockFacilities, prop, value);
        expect(resultFacilities).toEqual([mockFacilities.find((f) => f[prop] === value)]);
      });
      it("SHOULD throw 400 error WHEN value is NOT valid enum value", () => {
        const prop: keyof FoodFacility = "status";
        const value = "some random value" as Status;
        expect(() => searchBy(mockFacilities, prop, value)).toThrow(
          new CustomError("INVALID_SEARCH_ENUM")
        );
      });
    });
  });

  describe("validateFoodFacilityQuery", () => {
    it("SHOULD throw 400 error WHEN attempting to search by an non existent property", () => {
      const query = new URLSearchParams();
      query.set("test", "test");
      expect(() => validateFoodFacilityQuery(query)).toThrow(
        new CustomError("NON_EXISTENT_SEARCH_PROPERTIES")
      );
    });

    it("SHOULD throw 400 error WHEN attempting to search by facilityType with an invalid enum", () => {
      const query = new URLSearchParams();
      query.set("facilityType", "test");
      expect(() => validateFoodFacilityQuery(query)).toThrow(
        new CustomError("INVALID_SEARCH_ENUM")
      );
    });

    it("SHOULD throw 400 error WHEN attempting to search by status with an invalid enum", () => {
      const query = new URLSearchParams();
      query.set("status", "test");
      expect(() => validateFoodFacilityQuery(query)).toThrow(
        new CustomError("INVALID_SEARCH_ENUM")
      );
    });

    it("SHOULD construct facility criteria WHEN successfully validating query params", () => {
      const query = new URLSearchParams();
      query.set("id", "mockId");
      query.set("name", "mockName");
      query.set("streetName", "mockStreetName");
      query.set("facilityType", "TRUCK");
      query.set("status", "APPROVED");
      //should hide query params with no value
      query.set("foodItems", "");
      query.set("permit", "");

      const criteria = validateFoodFacilityQuery(query);

      expect(criteria).toEqual({
        id: "mockId",
        name: "mockName",
        streetName: "mockStreetName",
        facilityType: FacilityType.TRUCK,
        status: Status.APPROVED,
      });
    });
  });
});
