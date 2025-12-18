import { CustomError } from "../ErrorCodes";
import { FacilityType, FoodFacility, Status } from "@/types";

export const searchBy = (
  facilities: readonly FoodFacility[],
  property: keyof FoodFacility,
  searchValue?: string | null
): readonly FoodFacility[] => {
  if (!searchValue) return facilities;
  // only search by expected fields -- i.e. foodItems and NOT latitude
  switch (property) {
    case "id":
    case "name":
    case "streetName":
    case "foodItems":
    case "permit":
      // make search case insensitive
      return facilities.filter((f) =>
        f[property]?.toUpperCase()?.includes(searchValue.toUpperCase())
      );
    case "facilityType":
      // strict equality for enums
      if (searchValue in FacilityType) {
        return facilities.filter((f) => f[property]?.toUpperCase() === searchValue.toUpperCase());
      }
      throw new CustomError("INVALID_SEARCH_ENUM");
    case "status":
      // strict equality for enums
      if (searchValue in Status) {
        return facilities.filter((f) => f[property]?.toUpperCase() === searchValue.toUpperCase());
      }
      throw new CustomError("INVALID_SEARCH_ENUM");
    default:
      throw new CustomError("NON_EXISTENT_SEARCH_PROPERTIES");
  }
};

export const validateFoodFacilityQuery = (queryParams: URLSearchParams): Partial<FoodFacility> => {
  const facilityQuery: Partial<FoodFacility> = {};
  for (const [name, value] of queryParams) {
    switch (name) {
      case "id":
      case "name":
      case "streetName":
      case "foodItems":
      case "permit":
        // only add query keys that have values
        if (value) facilityQuery[name] = value;
        continue;
      case "facilityType":
        // strict equality for enums
        if (value in FacilityType) {
          facilityQuery[name] = value as FacilityType;
          continue;
        }
        throw new CustomError("INVALID_SEARCH_ENUM");
      case "status":
        // strict equality for enums
        if (value in Status) {
          facilityQuery[name] = value as Status;
          continue;
        }
        throw new CustomError("INVALID_SEARCH_ENUM");
      default:
        throw new CustomError("NON_EXISTENT_SEARCH_PROPERTIES");
    }
  }
  return facilityQuery;
};
