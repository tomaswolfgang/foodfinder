/**
 * @jest-environment node
 */
import { ERROR_CODES, toErrorMessage } from "@/app/ErrorCodes";
import { GET } from "./route";
import { getClosestFacilities } from "../db";

const SHOW_LOGS = false;
const mockFacilities = [{ test: "test" }];

jest.mock("../db", () => ({
  getClosestFacilities: jest.fn(() => mockFacilities),
}));

jest.mock("../transformers", () => ({
  toFoodFacilityResponse: jest.fn((p) => p),
}));

describe("GET /api/closest", () => {
  //console override to reduce logs
  console.error = SHOW_LOGS ? console.error : jest.fn();
  it("SHOULD respond with 400 error WHEN missing longitude in request", async () => {
    const mockParamObject = {
      latitude: "123",
    };
    const mockRequest: any = {
      nextUrl: {
        searchParams: new URLSearchParams(mockParamObject),
      },
    };

    // Call the handler function directly
    const response = await GET(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(ERROR_CODES.INVALID_LOCATION_PAYLOAD.status);
    expect(body).toEqual({ error: toErrorMessage(ERROR_CODES.INVALID_LOCATION_PAYLOAD.code) });
  });
  it("SHOULD respond with 400 error WHEN missing latitude in request", async () => {
    const mockParamObject = {
      longitude: "123",
    };
    const mockRequest: any = {
      nextUrl: {
        searchParams: new URLSearchParams(mockParamObject),
      },
    };

    // Call the handler function directly
    const response = await GET(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(ERROR_CODES.INVALID_LOCATION_PAYLOAD.status);
    expect(body).toEqual({ error: toErrorMessage(ERROR_CODES.INVALID_LOCATION_PAYLOAD.code) });
  });
  it("SHOULD respond with 400 error WHEN latitude is NOT a number", async () => {
    const mockParamObject = {
      longitude: "123",
      latitude: "hi",
    };
    const mockRequest: any = {
      nextUrl: {
        searchParams: new URLSearchParams(mockParamObject),
      },
    };

    // Call the handler function directly
    const response = await GET(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(ERROR_CODES.INVALID_LOCATION_PAYLOAD.status);
    expect(body).toEqual({ error: toErrorMessage(ERROR_CODES.INVALID_LOCATION_PAYLOAD.code) });
  });
  it("SHOULD respond with 400 error WHEN longitude is NOT a number", async () => {
    const mockParamObject = {
      longitude: "hi",
      latitude: "123",
    };
    const mockRequest: any = {
      nextUrl: {
        searchParams: new URLSearchParams(mockParamObject),
      },
    };

    // Call the handler function directly
    const response = await GET(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(ERROR_CODES.INVALID_LOCATION_PAYLOAD.status);
    expect(body).toEqual({ error: toErrorMessage(ERROR_CODES.INVALID_LOCATION_PAYLOAD.code) });
  });

  it("SHOULD respond with 500 error WHEN getClosestFacilities fails", async () => {
    const mockParamObject = {
      longitude: "456",
      latitude: "123",
    };
    const mockRequest: any = {
      nextUrl: {
        searchParams: new URLSearchParams(mockParamObject),
      },
    };

    (getClosestFacilities as jest.Mock).mockImplementationOnce(async () => {
      throw Error("some random error");
    });

    // Call the handler function directly
    const response = await GET(mockRequest);
    const body = await response.json();

    expect(response.status).toBe(ERROR_CODES.UNKNOWN.status);
    expect(body).toEqual({ error: toErrorMessage(ERROR_CODES.UNKNOWN.code) });
  });

  it("SHOULD respond call db for closest facilities WHEN request payload is valid", async () => {
    const mockParamObject = {
      longitude: "456",
      latitude: "123",
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
    expect(body).toEqual(mockFacilities);
    expect(getClosestFacilities).toHaveBeenCalledTimes(1);
  });
});
