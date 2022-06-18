import { Browsers, FlattenJson, Support } from "./../types/type";
import semver from "semver";

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
