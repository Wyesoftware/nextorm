import { IMigration, Schema } from "./types";
import fs from "fs";
import dayjs from "dayjs";

export const migrate = async ({
  schema,
  database,
  force = false,
}: IMigration = {}) => {
  const {
    Database,
  }: { Database: Schema } = require(`${__dirname}/../../data/schema.ts`);

  let data: string = "";
  const tables = Object.keys(Database);
  tables.map((table) => {
    data += `CREATE TABLE IF NOT EXISTS ${table} (\n`;
    const tableFields = Object.keys(Database[table]);
    tableFields.map((field) => {
      let column = `${field} ${Database[table][field].type} `;
      if (Database[table][field].required) column += "NOT NULL ";
      if (Database[table][field].primary) column += "PRIMARY KEY ";
      if (Database[table][field].id) column += "AUTOINCREMENT ";
      if (Database[table][field].default)
        column += `DEFAULT ${Database[table][field].default} `;

      data += `\t${column}\n`;
    });
    data += `);\n`;
  });
  fs.mkdirSync(`${__dirname}/../../data/migrations`, { recursive: true });
  fs.writeFileSync(
    `${__dirname}/../../data/migrations/${dayjs().format(
      "YYYYMMDDHHmmss"
    )}.sql`,
    data,
    { encoding: "utf8" }
  );
  console.log(`Migration created`);
};
