import type { FlattenJson } from "./../compat-data/types/type";
import { IENonSupportedCompatTable } from "compat-data";
import semver from "semver";
import * as fs from "fs";
import * as path from "path";
import type { Browsers, Support } from "compat-data/dist/types/type";

const CHROME = "92.0.0";
const SAFARI = "14.0.0";
const EDGE = "92.0.0";
const FIREFOX = "91.0.0";

const formatVersion = (ver: string) => {
  const verString = ver === "preview" ? "0" : ver;

  let vers = verString.split(".");

  vers = [...vers, ...[...new Array(3 - vers.length).keys()].map(() => "0")];

  return vers.join(".");
};

const isValidSupport = (support: Support) => {
  if (support.prefix || support.partial_implementation) return false;

  if (!support.version_added) return false;
  if (support.version_added === true) return true;
  if (support.version_added.includes("≤")) return false;

  return true;
};

const isValidVersion = (
  ver: string | boolean | undefined
): ver is string | true => {
  if (!ver) return false;
  if (ver === true) return true;
  if (ver.includes("≤")) return false;
  return true;
};

const checkVersion = (
  support: FlattenJson[string]["support"][Browsers] | undefined,
  expectVersion: string,
  mirror?: FlattenJson[string]["support"][Browsers] | undefined
): boolean => {
  if (!support) return false;

  if (support === "mirror") {
    return checkVersion(mirror!, expectVersion);
  }

  let ver: string | boolean | undefined;

  if ("length" in support) {
    const s = support.find((s) => isValidSupport(s));
    ver = s?.version_added;
  } else {
    ver = support.version_added;
  }

  if (!isValidVersion(ver)) return false;
  if (ver === true) return true;

  return semver.lte(formatVersion(ver), expectVersion);
};

const features = Object.keys(IENonSupportedCompatTable).filter((key) => {
  const feature = IENonSupportedCompatTable[key];

  if (!feature) return false;

  console.log(key);

  if (
    checkVersion(feature.support.chrome, CHROME) &&
    checkVersion(feature.support.safari, SAFARI) &&
    checkVersion(feature.support.edge, EDGE, feature.support.chrome) &&
    checkVersion(feature.support.firefox, FIREFOX)
  ) {
    return true;
  }

  return false;
});

const texts = features
  .sort((a, b) => (a < b ? -1 : 1))
  .map((featureKey) => {
    const feature = IENonSupportedCompatTable[featureKey];

    const mdn = feature?.mdn_url ? ` | [🔗mdn](${feature.mdn_url})` : "";
    const spec = feature?.spec_url ? ` | [🔗spec](${feature?.spec_url})` : "";

    return `- \`${featureKey}\`${mdn}${spec}`;
  });

fs.writeFileSync(path.resolve(__dirname, "list.md"), texts.join("\n"));
