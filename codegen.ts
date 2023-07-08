import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "src/schema/schema.graphql",
  documents: ["src/**/*.tsx", "src/**/*.ts"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/schema/": {
      plugins: [],
      preset: "gql-tag-operations-preset",
      config: {
        enumsAsTypes: true,
        immutableTypes: true,
        scalars: {
          JSONString: "string",
          ObjectIdType: "string",
          Upload: "Blob",
          BigInt: "number",
        },
      },
    },
  },
};

export default config;
