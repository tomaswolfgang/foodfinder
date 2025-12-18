export const toErrorMessage = (code: string) => `Please contact support with error code: ${code}`;

export const ERROR_CODES = {
  INVALID_LOCATION_PAYLOAD: {
    code: "lololol",
    description: "Longitude and latitude are either missing or not numbers",
    status: 400,
  },

  NON_EXISTENT_SEARCH_PROPERTIES: {
    code: "hahaha",
    description: "Searching by a property that shouldnt be searched on",
    status: 400,
  },

  INVALID_SEARCH_ENUM: {
    code: "hehehe",
    description: "Searching by an enum field with in invalid enum value",
    status: 400,
  },

  UNKNOWN: {
    code: "ohnooooooo",
    description: "Something bad has happened and we need to fix this...",
    status: 500,
  },
};

export class CustomError extends Error {
  status: number;
  constructor(errorCode: keyof typeof ERROR_CODES) {
    const error = ERROR_CODES[errorCode];
    super(toErrorMessage(error.code));
    console.error(error.code, error.description, this.stack);
    this.status = error.status;
  }
}
