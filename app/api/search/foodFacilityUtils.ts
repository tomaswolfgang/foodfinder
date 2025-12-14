import { FacilityType, FoodFacility, Status } from "../types";

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
      return facilities;

    case "status":
      // strict equality for enums
      if (searchValue in Status) {
        return facilities.filter((f) => f[property]?.toUpperCase() === searchValue.toUpperCase());
      }
      return facilities;
    default:
      // in case function is misused, dont filter anything
      return facilities;
  }
};
