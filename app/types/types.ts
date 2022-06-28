import type { CompatData } from "@mdn/browser-compat-data";

export type FilteredCompatData = Pick<
  CompatData,
  "javascript" | "html" | "api" | "css" | "http" | "svg" | "webextensions"
>;
