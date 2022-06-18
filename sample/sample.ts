import * as fs from "fs";
import * as path from "path";
import { filterByMajorBrowsers } from "./../compat-data/lib/filters/filters";

const data = filterByMajorBrowsers({
  chrome: "92.0.0",
  safari: "14.0.0",
  edge: "92.0.0",
  firefox: "91.0.0",
});

fs.writeFileSync(path.resolve(__dirname, "list.md"), JSON.stringify(data));
