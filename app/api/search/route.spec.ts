/**
 * @jest-environment node
 */
import { GET } from "./route";
import { FacilityType, FoodFacility, Status } from "@/types";

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

jest.mock("../db", () => ({
  loadAllData: jest.fn(() => mockFacilities),
}));

describe("GET /api/search", () => {
  it("should return items with status 200", async () => {
    const mockParamObject = {
      id: "mockId1",
      name: "mockName1",
      streetName: "mockStreetName1",
      streetNumber: "1",
      longitude: "1",
      latitude: "1",
      status: "APPROVED",
      facilityType: "PUSH_CART",
      foodItems: "mockFoodItems1",
      permit: "mockPermit1",
    };

    const mockRequest: any = {
      nextUrl: {
        searchParams: new URLSearchParams(mockParamObject),
      },
    };
    // Call the handler function directly
    const response = await GET(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.length).toBe(1);
    expect(body[0]).toEqual(mockFacilities[0]);
  });

  it("should return multiple items with status 200", async () => {
    const mockParamObject = {
      id: "mock",
    };

    const mockRequest: any = {
      nextUrl: {
        searchParams: new URLSearchParams(mockParamObject),
      },
    };
    // Call the handler function directly
    const response = await GET(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.length).toBe(3);
    expect(body).toEqual(mockFacilities);
  });
});
