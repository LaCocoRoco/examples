import { emitSchemaDefinitionFile } from "type-graphql";
import { schema } from "./schema";
import { join } from "path";

(async () => {
  const schemaFilePath = join(__dirname, '/schema.gql');
  await emitSchemaDefinitionFile(schemaFilePath, await schema());
})();