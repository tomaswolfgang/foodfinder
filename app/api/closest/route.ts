import { NextRequest } from "next/server";
import { getClosestFacilities } from "../db";
import { CustomError, ERROR_CODES, toErrorMessage } from "@/app/ErrorCodes";
import { toFoodFacilityResponse } from "../transformers";

export async function GET(request: NextRequest) {
  try {
    const longitudeQuery = request.nextUrl.searchParams.get("longitude");
    const latitudeQuery = request.nextUrl.searchParams.get("latitude");
    const allowAll = request.nextUrl.searchParams.get("allowAll") === "true";
    const longitude =
      longitudeQuery && !isNaN(Number(longitudeQuery)) ? Number(longitudeQuery) : null;
    const latitude = latitudeQuery && !isNaN(Number(latitudeQuery)) ? Number(latitudeQuery) : null;

    if (longitude !== null && latitude !== null) {
      const closeFacilities = await getClosestFacilities(longitude, latitude, allowAll);
      return Response.json(closeFacilities.map(toFoodFacilityResponse));
    }
    throw new CustomError("INVALID_LOCATION_PAYLOAD");
  } catch (err) {
    if (err instanceof CustomError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error(err);

    const { code, status } = ERROR_CODES.UNKNOWN;
    return Response.json({ error: toErrorMessage(code) }, { status });
  }
}
