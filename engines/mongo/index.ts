import fs from "fs";
import {
  Collection,
  CollectionKeys,
  IGeneration,
  KeyOptions,
  Model,
} from "../../types";
import prettier from "prettier";
import { execSync } from "child_process";

export const generate = async ({ model, output }: IGeneration) => {
  try {
    let modelPath: string;

    if (model && fs.existsSync(model)) modelPath = model;
    if (fs.existsSync(`${__dirname}/../../../../../../nextorm/model.ts`))
      modelPath = `${__dirname}/../../../../../../nextorm/model.ts`;
    if (fs.existsSync(`${__dirname}/../../../../../../nextorm/model.js`))
      modelPath = `${__dirname}/../../../../../../nextorm/model.js`;

    if (!modelPath) throw new Error("Model file not found");

    let Database: Model;
    try {
      if (!fs.existsSync(`${__dirname}/temp`))
        fs.mkdirSync(`${__dirname}/temp`);
      if (modelPath.endsWith(".ts")) {
        const path = modelPath.replace(/(.*)\/.*/, "$1");
        const file = modelPath.replace(/.*\/(.*)/, "$1");
        execSync(`cd ${path} && tsc ${file}`);
        const newFilePath = modelPath.replace(/\.ts/, ".js");
        fs.cpSync(`${newFilePath}`, `${__dirname}/temp/temp.js`);
        fs.rmSync(newFilePath);
      } else {
        fs.cpSync(`${modelPath}`, `${__dirname}/temp/temp.js`);
      }
      Database = require("./temp/temp.js").Database;
    } catch (error) {
      throw new Error(`Error parsing model file: ${error.message}`);
    }

    let data: string = "";
    data += `import mongoose, { Schema } from "mongoose";\n\n`;
    const collections = Object.keys(Database);
    collections.map((collectionName) => {
      data += `const ${collectionName}Schema = new Schema({\n`;
      const collection = Database[collectionName] as Collection;
      let options: string = "";
      data += parseKeys(collection);

      if (collection._id) options += `_id: true,\n`;
      if (collection.timestamps) options += `timestamps: true,\n`;

      data += `}, {\n${options}});\n\n`;
      data += `export const ${collectionName}Model = mongoose.model("${
        collection.name || collectionName
      }", ${collectionName}Schema);\n\n`;
    });

    let outputPath: string;

    if (output && fs.existsSync(output)) outputPath = output;
    if (fs.existsSync(`${__dirname}/../../../../../../nextorm/generated`)) {
      outputPath = `${__dirname}/../../../../../../nextorm/generated`;
    } else {
      fs.mkdirSync(`${__dirname}/../../../../../../nextorm/generated`, {
        recursive: true,
      });
      outputPath = `${__dirname}/../../../../../../nextorm/generated`;
    }

    data = prettier.format(data, { parser: "typescript" });

    fs.writeFileSync(`${outputPath}/nextorm.ts`, data, {
      encoding: "utf8",
      flag: "w",
    });

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
    if (typeof collectionKey === "object") {
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
