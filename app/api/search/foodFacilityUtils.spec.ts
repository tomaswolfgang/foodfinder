import { FacilityType, FoodFacility, Status } from "@/types";
import { searchBy } from "./foodFacilityUtils";

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

describe("foodFacilityUtils - searchBy", () => {
  it("SHOULD return original facilities WHEN no search value is present to filter on", () => {
    const resultFacilities = searchBy(mockFacilities, "id", "");
    expect(resultFacilities).toEqual(mockFacilities);

    const resultFacilities2 = searchBy(mockFacilities, "id", undefined);
    expect(resultFacilities2).toEqual(mockFacilities);
  });

  it("SHOULD return original facilities WHEN property is not a searchable key", () => {
    const resultFacilities = searchBy(
      mockFacilities,
      "some-random-key" as keyof FoodFacility,
      "test"
    );
    expect(resultFacilities).toEqual(mockFacilities);
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
    it("SHOULD NOT filter on [facilityType] WHEN value is NOT valid enum value", () => {
      const prop: keyof FoodFacility = "facilityType";
      const value = "some random value" as FacilityType;
      const resultFacilities = searchBy(mockFacilities, prop, value);
      expect(resultFacilities).toEqual(mockFacilities);
    });

    it("SHOULD filter on [status] WHEN  value is set AND is a valid enum value", () => {
      const prop: keyof FoodFacility = "status";
      const value = mockFacilities[0].status;
      const resultFacilities = searchBy(mockFacilities, prop, value);
      expect(resultFacilities).toEqual([mockFacilities.find((f) => f[prop] === value)]);
    });
    it("SHOULD NOT filter on [status] WHEN value is NOT valid enum value", () => {
      const prop: keyof FoodFacility = "status";
      const value = "some random value" as Status;
      const resultFacilities = searchBy(mockFacilities, prop, value);
      expect(resultFacilities).toEqual(mockFacilities);
    });
  });
});
