import { Feature, Support, VersionAdded } from "./../types/type";

export const hasSubFeatures = (feature: Feature) => {
  const length = Object.keys(feature).length;
  return length >= 2 || (length == 1 && !!feature["__compat"]);
};

export const isIEEnabledFeature = (feature: Feature) => {
  const ie = feature.__compat?.support.ie;

  if (!ie || ie === "mirror") return false;

  return isFullSupport(ie);
};

export const isFullSupport = (supports: Support[] | Support | undefined) => {
  if (!supports) return false;

  let support: Support | undefined;

  if ("length" in supports) {
    support = supports[0];
  } else {
    support = supports;
  }

  if (support.prefix || support.partial_implementation) return false;

  return isValidVersion(support.version_added);
};

export const isValidVersion = (version: VersionAdded | undefined) => {
  if (!version) return false;
  if (version === true) return true;
  if (version.includes("≤")) return false;

  return true;
};

// const formatVersion = (ver: string) => {
//   const verString = ver === "preview" ? "0" : ver;

//   let vers = verString.split(".");

//   vers = [...vers, ...[...new Array(3 - vers.length).keys()].map(() => "0")];

//   return vers.join(".");
// };

// const checkVersion = (
//   support: FlattenJson[string]["support"][Browsers] | undefined,
//   expectVersion: string,
//   mirror?: FlattenJson[string]["support"][Browsers] | undefined
// ): boolean => {
//   if (!support) return false;

//   if (support === "mirror") {
//     return checkVersion(mirror!, expectVersion);
//   }

//   let ver: string | boolean | undefined;

//   if ("length" in support) {
//     const s = support.find((s) => isValidSupport(s));
//     ver = s?.version_added;
//   } else {
//     ver = support.version_added;
//   }

//   if (!isValidVersion(ver)) return false;
//   if (ver === true) return true;

//   return semver.lte(formatVersion(ver), expectVersion);
// };
