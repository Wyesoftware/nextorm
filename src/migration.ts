import { IMigration } from "./types";

export const migrate = async ({
  schema,
  database,
  force = false,
}: IMigration = {}) => {
  const { Database } = require(`${__dirname}/../nextorm/schema.ts`);
  console.log(Object.keys(Database));
};
