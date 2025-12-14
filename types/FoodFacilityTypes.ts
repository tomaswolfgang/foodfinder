// enum keys and values are the same by design
// it allows us to check if something is an enum value using for(... in) - checking the keys
// and standardizes whenever we use it
export enum FacilityType {
  TRUCK = "TRUCK",
  PUSH_CART = "PUSH_CART",
}

export enum Status {
  APPROVED = "APPROVED",
  REQUESTED = "REQUESTED",
  ISSUED = "ISSUED",
  EXPIRED = "EXPIRED",
  SUSPEND = "SUSPEND",
}

export type Address = {
  streetNumber?: number;
  streetName: string;
};

export type FoodFacility = {
  id: string;
  name: string;
  streetName?: string;
  streetNumber?: number;
  longitude: number;
  latitude: number;
  status: Status;
  // extras to search by ?
  facilityType?: FacilityType;
  foodItems?: string;
  permit: string;
};

export type FoodFacilityCSV = {
  locationid: string;
  Applicant: string;
  LocationDescription: string;
  Address: string;
  Status: string;
  Latitude: string;
  Longitude: string;
  // extras to search by ? we can add more later
  FacilityType: string;
  FoodItems: string;
  permit: string;
};
