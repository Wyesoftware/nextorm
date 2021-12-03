import { Schema, Types } from "../engines/migration/types";

export const Database: Schema = {
  Users: {
    id: {
      type: Types.boolean,
      id: true,
      primary: true,
    },
    email: {
      type: Types.string,
      required: true,
    },
    password: {
      type: Types.string,
      required: true,
    },
    isActive: {
      type: Types.boolean,
      required: true,
      default: 1,
    },
  },
};
