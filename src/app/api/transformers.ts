import {
  Address,
  FacilityType,
  FoodFacility,
  FoodFacilityCSV,
  FoodFacilityResponse,
  Status,
} from "@/types";

const ASSESSORS_ADDRESS_BEGINNING = "ASSESSORS";

const facilityTypeMapping: { [key: string]: FacilityType } = {
  "Push Cart": FacilityType.PUSH_CART,
  Truck: FacilityType.TRUCK,
};

const statusTypeMapping: { [key: string]: Status } = {
  APPROVED: Status.APPROVED,
  REQUESTED: Status.REQUESTED,
  ISSUED: Status.ISSUED,
  EXPIRED: Status.EXPIRED,
  SUSPEND: Status.SUSPEND,
};

export const parseAddress = (address: string): Address | undefined => {
  if (!address) return;

  const addressSplit = address.split(" ");

  if (addressSplit[0].toUpperCase() === ASSESSORS_ADDRESS_BEGINNING) {
    return {
      streetName: address,
    };
  }

  const streetNumber = Number(addressSplit.shift());
  const streetName = addressSplit.join(" ");

  return {
    streetName,
    streetNumber,
  };
};

export const prettifyCsvData = (csvRow: FoodFacilityCSV): FoodFacility => {
  const address = parseAddress(csvRow.Address);
  const status = statusTypeMapping[csvRow.Status];

  if (!status) {
    throw Error("Did we not include all the statuses? oh no");
  }

  return {
    id: csvRow.locationid,
    name: csvRow.Applicant,
    longitude: Number.parseFloat(csvRow.Longitude),
    latitude: Number.parseFloat(csvRow.Latitude),
    status,
    permit: csvRow.permit,
    ...(address ? { ...address } : {}),
    ...(facilityTypeMapping[csvRow.FacilityType]
      ? { facilityType: facilityTypeMapping[csvRow.FacilityType] }
      : {}),
  };
};

export const toFoodFacilityResponse = (facility: FoodFacility): FoodFacilityResponse => ({
  id: facility.id,
  name: facility.name,
  streetNumber: facility.streetNumber,
  streetName: facility.streetName,
  status: facility.status,
});
