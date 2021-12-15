#!/usr/bin/env node
import { program } from "commander";
import { generate } from "./engines/mongo";
import { migrate } from "./engines/sqlite";

program.version("0.0.1").name("nextorm").usage("[command]");
program
  .command("sqlite:migrate")
  .description("Migrate sqlite database")
  .option("--schema [schema]", "schema file")
  .option("--database [database]", "database file")
  .option("--force", "migration with reset data")
  .action(async (options) => {
    await migrate({
      schema: options.schema,
      database: options.database,
      force: !!options.force,
    });
  });
program
  .command("mongo:generate")
  .description("Generate mongoose model")
  .option("--model [model]", "model file path")
  .option("--output [output]", "output path for generated file")
  .action(async (options, command) => {
    await generate({
      model: options.model,
      output: options.output,
    });
  });
program.parse(process.argv);
