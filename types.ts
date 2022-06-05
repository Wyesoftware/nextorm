export type IMigration = {
  schema?: string;
  database?: string;
  force?: boolean;
};

export const enum SqliteTypes {
  string = "TEXT",
  int = "INTEGER",
  boolean = "NUMERIC",
  float = "REAL",
  blob = "BLOB",
}

export type Schema = {
  [key: string]: {
    [key: string]: {
      type: SqliteTypes;
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

export type IGeneration = {
  importPath?: string;
  exportPath?: string;
};

export type Mongo_IWrite = {
  exportPath?: string | null;
  importPath?: string | null;
  modelPath: string;
  data: string;
};

export const enum MongoTypes {
  String = "Schema.Types.String",
  Array = "Schema.Types.Array",
  ObjectId = "Schema.Types.ObjectId",
  Mixed = "Schema.Types.Mixed",
  Boolean = "Schema.Types.Boolean",
  Number = "Schema.Types.Number",
  Date = "Schema.Types.Date",
  Buffer = "Schema.Types.Buffer",
  Decimal128 = "Schema.Types.Decimal128",
  Map = "Schema.Types.Map",
  Subdocument = "Schema.Types.Subdocument",
  DocumentArray = "Schema.Types.DocumentArray",
}

export type KeyOptions = {
  type: MongoTypes | MongoTypes[] | CollectionKeys;
  unique?: boolean;
  required?: boolean;
  default?: any;
  index?: boolean;
  lowercase?: boolean;
  uppercase?: boolean;
  reference?: string;
};

export type CollectionKeys = {
  [key: string]: KeyOptions;
};

export type CollectionOptions = {
  _id?: boolean;
  timestamps?: boolean;
  name?: string;
  indexes?: {
    fields: {
      [key: string]: "asc" | "desc";
    };
    unique?: boolean;
  }[];
};

export type Collection = CollectionKeys | CollectionOptions;

export type Model = {
  [collection: string]: Collection;
};
