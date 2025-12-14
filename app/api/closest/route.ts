import { NextRequest } from "next/server";
import { getClosestFacilities, loadAllData } from "../db";

export async function GET(request: NextRequest) {
  const longitudeQuery = request.nextUrl.searchParams.get("longitude");
  const latitudeQuery = request.nextUrl.searchParams.get("latitude");
  const onlyApproved = request.nextUrl.searchParams.get("onlyApproved") !== "false";
  const longitude =
    longitudeQuery && !isNaN(Number(longitudeQuery)) ? Number(longitudeQuery) : null;
  const latitude = latitudeQuery && !isNaN(Number(latitudeQuery)) ? Number(latitudeQuery) : null;

  if (longitude !== null && latitude !== null) {
    const closeFacilities = await getClosestFacilities(longitude, latitude, onlyApproved);
    return Response.json(closeFacilities);
  }

  return Response.json([]);
}
