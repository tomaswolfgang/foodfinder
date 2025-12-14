import { NextRequest } from "next/server";
import { loadAllData } from "../db";
import { searchBy } from "./foodFacilityUtils";
import { FoodFacility } from "../../../types/FoodFacilityTypes";

export async function GET(request: NextRequest) {
  const allFacilities = await loadAllData();

  let filteredFacilities = allFacilities;
  for (const [name, value] of request.nextUrl.searchParams) {
    filteredFacilities = searchBy(allFacilities, name as keyof FoodFacility, value);
  }
  return Response.json(filteredFacilities);
}
