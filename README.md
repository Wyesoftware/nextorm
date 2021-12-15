# nextorm

Next level ORM for popular databases

### TypeScript

This module has full typescript support.

## Install package

```bash
npm i @wyesoftware/nextorm
```

```bash
yarn add @wyesoftware/nextorm
```

## Usage

Generate mongo models from custom schema placed in `${project}/nextorm/model.ts(.js)` with output in `${project}/nextorm/generated/nextorm.ts(.js)`:

```bash
nextorm mongo:generate
```

Generate mongo models from custom schema placed in `${customPath}` with output in `${customPath}/generated/nextorm.ts(.js)`:

```bash
nextorm mongo:generate --model ${customPath}
```

Also you can change output path to custom path:

```bash
nextorm mongo:generate --model ${customPath} --output ${outputPath}
```

## Features

### Mongo

- Generate mongo models from custom schema - works with limits
- Strongly typed mongoose functions - in development

### SQLite

- Migration from custom schema - in development
- Strongly typed betterSqlite functions - in development

## Custom Schema Example

```jsx
import { Model, MongoTypes } from "@wyesoftware/nextorm";

export const Database: Model = {
  Users: {
    // schema name
    _id: true, // auto-generated ObjectId
    timestamps: true, // createdAt, updatedAt
    name: "users", // collection name in mongo
    indexes: {
      fields: {
        email: "asc",
        age: "desc",
      },
      unique: true,
    },
    email: {
      // field name in mongo
      type: MongoTypes.String, // field type
      required: true, // field is required
      unique: true, // field is unique
      index: true, // field is indexed
    },
    password: {
      type: MongoTypes.String,
      required: true,
    },
    age: {
      type: MongoTypes.Number,
      required: false,
    },
  },
};
```

## Last update

- Add support for multiple indexes in collection
