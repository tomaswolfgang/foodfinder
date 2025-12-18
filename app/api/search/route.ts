import { NextRequest } from "next/server";
import { loadAllData } from "../db";
import { searchBy } from "./foodFacilityUtils";
import { FoodFacility } from "@/types";
import { CustomError, ERROR_CODES, toErrorMessage } from "@/app/ErrorCodes";

export async function GET(request: NextRequest) {
  try {
    const allFacilities = await loadAllData();
    let filteredFacilities = allFacilities;

    for (const [name, value] of request.nextUrl.searchParams) {
      filteredFacilities = searchBy(filteredFacilities, name as keyof FoodFacility, value);
    }
    return Response.json(filteredFacilities);
  } catch (err: any) {
    if (err instanceof CustomError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error(err);
    const { code, status } = ERROR_CODES.UNKNOWN;
    return Response.json({ error: toErrorMessage(code) }, { status });
  }
}
