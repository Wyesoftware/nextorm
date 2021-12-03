export type IMigration = {
  schema?: string;
  database?: string;
  force?: boolean;
};

export enum Types {
  string = "TEXT",
  int = "INTEGER",
  boolean = "NUMERIC",
  float = "REAL",
  blob = "BLOB",
}

export type Schema = {
  [key: string]: {
    [key: string]: {
      type: Types;
      id?: boolean;
      primary?: boolean;
      unique?: boolean;
      required?: boolean;
      default?: any;
      relation?: {
        table: string;
        column: string;
      };
    };
  };
};
