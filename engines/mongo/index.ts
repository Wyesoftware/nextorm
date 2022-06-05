import fs from "fs";
import {
  Collection,
  CollectionKeys,
  CollectionOptions,
  IGeneration,
  KeyOptions,
} from "../../types";
import { readModel, writeModel } from "./model";

export const generate = async ({ importPath, exportPath }: IGeneration) => {
  try {
    const { database, modelPath } = await readModel(importPath);

    let data: string = "";
    data += `import mongoose, { Schema } from "mongoose";\n\n`;
    const collections = Object.keys(database);
    collections.map((collectionName) => {
      data += `const ${collectionName}Schema = new Schema({\n`;
      const collection = database[collectionName] as Collection;
      let options: string = "";
      data += parseKeys(collection);

      if (collection._id) options += `_id: true,\n`;
      if (collection.timestamps) options += `timestamps: true,\n`;

      data += `}, {\n${options}});\n\n`;

      if (
        (collection as CollectionOptions).indexes &&
        (collection as CollectionOptions).indexes.length > 0
      ) {
        (collection as CollectionOptions).indexes.map((index) => {
          const fields = Object.entries(index.fields)
            .map(([key, value]) => `${key}: ${value === "asc" ? 1 : -1}`)
            .join(", ");
          data += `${collectionName}Schema.index({${fields}}${
            index.unique ? ", { unique: true }" : ""
          });\n`;
        });
      }

      data += `export const ${collectionName}Model = mongoose.model("${
        collection.name || collectionName
      }", ${collectionName}Schema);\n\n`;
    });

    await writeModel({ exportPath, importPath, modelPath, data });
    fs.rmSync(`${__dirname}/temp`, { recursive: true });

    console.log(`Generated Successfully`);
  } catch (error) {
    console.log(error);
  }
};

const parseKeys = (collection: Collection) => {
  const keys = Object.keys(collection);
  let data: string = "";
  keys.map((key) => {
    const collectionKey = (collection as CollectionKeys)[key] as KeyOptions;
    if (typeof collectionKey === "object" && key !== "indexes") {
      data += `${key}: {\n`;
      if (
        typeof collectionKey.type === "object" &&
        !Array.isArray(collectionKey.type)
      ) {
        const subCollection = collectionKey.type as CollectionKeys;
        data += `type: {${parseKeys(subCollection)}},\n`;
      } else {
        data += `type: ${
          Array.isArray(collectionKey.type)
            ? `[${collectionKey.type[0].toString()}]`
            : collectionKey.type.toString()
        },\n`;
      }
      data += parseKeyOptions(collectionKey);
      data += `},\n`;
    }
  });
  return data;
};

const parseKeyOptions = (collectionKey: KeyOptions) => {
  let data: string = "";
  if (collectionKey.unique) data += `unique: true,\n`;
  if (collectionKey.required) data += `required: true,\n`;
  if (collectionKey.default) data += `default: ${collectionKey.default},\n`;
  if (collectionKey.index) data += `index: true,\n`;
  if (collectionKey.reference) data += `ref: "${collectionKey.reference}",\n`;
  if (collectionKey.lowercase) data += `lowercase: true,\n`;
  if (collectionKey.uppercase) data += `uppercase: true",\n`;
  return data;
};
