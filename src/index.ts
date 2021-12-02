import { program } from "commander";
import { migrate } from "./migration";

program.version("0.0.1").name("nextorm").usage("[command]");
program
  .command("migrate")
  .description("Do migration")
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
program.parse(process.argv);
