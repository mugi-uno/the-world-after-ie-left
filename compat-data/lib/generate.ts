import { filterIEEnabledFeatures } from "./filters/filterIEEnabledFeatures";
import { exit } from "process";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { createCompatMap } from "./createCompatMap";

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
  const compatMap = await createCompatMap(mdnRepo);
  const notIECompatMap = filterIEEnabledFeatures(compatMap);

  fs.writeFileSync(
    path.resolve(__dirname, "../tables/", "compatMap.ts"),
    `
      import type { Schema } from './../types/type';
      export const compatMap = ${JSON.stringify(
        compatMap
      )} as unknown as Schema;
      export const notIECompatMap = ${JSON.stringify(
        notIECompatMap
      )} as unknown as Schema;
    `
  );
})();
