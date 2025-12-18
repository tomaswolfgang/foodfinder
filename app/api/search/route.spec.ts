/**
 * @jest-environment node
 */
import { GET } from "./route";
import { loadFilteredData } from "../db";
import { validateFoodFacilityQuery } from "./foodFacilityUtils";
import { CustomError, ERROR_CODES, toErrorMessage } from "../ErrorCodes";

const SHOW_LOGS = false;

const mockData = [{ test: "test" }];

jest.mock("../db", () => ({
  loadFilteredData: jest.fn(() => []),
}));

jest.mock("./foodFacilityUtils", () => ({
  validateFoodFacilityQuery: jest.fn((p: URLSearchParams) => {
    const obj: any = {};
    for (const [name, value] of p) {
      obj[name] = value;
    }
    return obj;
  }),
}));

jest.mock("../transformers", () => ({
  toFoodFacilityResponse: jest.fn((p) => p),
}));

describe("GET /api/search", () => {
  //console override to reduce logs
  console.error = SHOW_LOGS ? console.error : jest.fn();
  it("SHOULD call loadFilteredData WHEN query is fully validated", async () => {
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

    expect(loadFilteredData).toHaveBeenCalledTimes(1);
    expect(loadFilteredData).toHaveBeenCalledWith(mockParamObject);
    expect(response.status).toBe(200);
  });

  it("SHOULD respond with custom error code and status WHEN CustomError is thrown during execution", async () => {
    const mockParamObject = {
      id: "mock",
    };

    const mockRequest: any = {
      nextUrl: {
        searchParams: new URLSearchParams(mockParamObject),
      },
    };
    (validateFoodFacilityQuery as jest.Mock).mockImplementationOnce(() => {
      throw new CustomError("INVALID_SEARCH_ENUM");
    });
    // Call the handler function directly
    const response = await GET(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: toErrorMessage(ERROR_CODES.INVALID_SEARCH_ENUM.code) });
  });

  it("SHOULD respond with 500 status WHEN random error occurs during execution", async () => {
    const mockParamObject = {
      id: "mock",
    };

    const mockRequest: any = {
      nextUrl: {
        searchParams: new URLSearchParams(mockParamObject),
      },
    };
    (validateFoodFacilityQuery as jest.Mock).mockImplementationOnce(() => {
      throw Error("random error");
    });
    // Call the handler function directly
    const response = await GET(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: toErrorMessage(ERROR_CODES.UNKNOWN.code) });
  });
});
