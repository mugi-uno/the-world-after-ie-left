import { exit } from "process";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { createIENonSupportedTable } from "./createIENonSupportedTable";

dotenv.config();

const mdnRepo = process.env["MDN_REPO"];

if (!mdnRepo) {
  console.error('"MDN_REPO" environment value is undefined.');
  exit(1);
}

if (!fs.existsSync(path.resolve(mdnRepo))) {
  console.error(`MDN_REPO directory (${mdnRepo}) not found.`);
  exit(1);
}

console.log(`MDN_REPO: ${mdnRepo}`);

(async () => {
  const json = await createIENonSupportedTable(mdnRepo);

  fs.writeFileSync(
    path.resolve(__dirname, "../tables/", "IENonSupportedCompatTable.ts"),
    `
      import type { FlattenJson } from './../types/type';
      export const IENonSupportedCompatTable = ${JSON.stringify(
        json
      )} as unknown as FlattenJson;`
  );
})();
