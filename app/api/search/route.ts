import { NextRequest } from "next/server";
import { loadFilteredData } from "../db";
import { searchBy, validateFoodFacilityQuery } from "./foodFacilityUtils";
import { FoodFacility } from "@/types";
import { CustomError, ERROR_CODES, toErrorMessage } from "../ErrorCodes";
import { toFoodFacilityResponse } from "../transformers";

export async function GET(request: NextRequest) {
  try {
    const searchQuery = validateFoodFacilityQuery(request.nextUrl.searchParams);
    const filteredFacilities = await loadFilteredData(searchQuery);
    return Response.json(filteredFacilities.map(toFoodFacilityResponse));
  } catch (err: any) {
    if (err instanceof CustomError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error(err);
    const { code, status } = ERROR_CODES.UNKNOWN;
    return Response.json({ error: toErrorMessage(code) }, { status });
  }
}
