import type { CompatData } from "@mdn/browser-compat-data";

export type FilteredCompatData = Pick<
  CompatData,
  // | "html"
  // | "api"
  "javascript"
  // | "css"
  // | "http"
  // | "mathml"
  // | "svg"
  // | "webdriver"
  // | "webextensions"
>;
