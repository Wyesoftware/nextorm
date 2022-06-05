import fs from "fs";
import { execSync } from "child_process";
import { Model, Mongo_IWrite } from "../../types";
import prettier from "prettier";

export const readModel = async (importPath?: string | null) => {
  try {
    let modelPath: string;

    if (importPath && fs.existsSync(importPath)) modelPath = importPath;
    if (fs.existsSync(`${__dirname}/../../../../../../nextorm/model.ts`))
      modelPath = `${__dirname}/../../../../../../nextorm/model.ts`;
    if (fs.existsSync(`${__dirname}/../../../../../../nextorm/model.js`))
      modelPath = `${__dirname}/../../../../../../nextorm/model.js`;

    if (!modelPath) throw new Error("Model file not found");

    if (!fs.existsSync(`${__dirname}/temp`)) fs.mkdirSync(`${__dirname}/temp`);
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
    const database: Model = require("./temp/temp.js").Database;
    return { database, modelPath };
  } catch (error) {
    throw new Error(`Error parsing model file: ${error.message}`);
  }
};

export const writeModel = async ({
  exportPath,
  importPath,
  modelPath,
  data,
}: Mongo_IWrite) => {
  try {
    let outputPath: string;

    if (exportPath && fs.existsSync(exportPath)) outputPath = exportPath;
    if (importPath) {
      const path = modelPath.replace(/(.*)\/.*/, "$1");
      if (fs.existsSync(`${path}/generated`)) {
        outputPath = `${path}/generated`;
      } else {
        fs.mkdirSync(`${path}/generated`, {
          recursive: true,
        });
        outputPath = `${path}/generated`;
      }
    } else {
      if (fs.existsSync(`${__dirname}/../../../../../../nextorm/generated`)) {
        outputPath = `${__dirname}/../../../../../../nextorm/generated`;
      } else {
        fs.mkdirSync(`${__dirname}/../../../../../../nextorm/generated`, {
          recursive: true,
        });
        outputPath = `${__dirname}/../../../../../../nextorm/generated`;
      }
    }

    data = prettier.format(data, { parser: "typescript" });

    fs.writeFileSync(`${outputPath}/nextorm.ts`, data, {
      encoding: "utf8",
      flag: "w",
    });
  } catch (error) {
    throw new Error(`Error creating generated file: ${error.message}`);
  }
};
