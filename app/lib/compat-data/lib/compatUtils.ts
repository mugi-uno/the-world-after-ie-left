import semver from "semver";
import type {
  CompatSupport,
  Feature,
  Support,
  VersionAdded,
} from "./../types/type";

export const hasSubFeatures = (feature: Feature) => {
  const length = Object.keys(feature).length;
  return length >= 2 || (length == 1 && !feature["__compat"]);
};

export const hasCompat = (feature: Feature) => {
  return !!feature.__compat;
};

export const isIEEnabledFeature = (feature: Feature) => {
  const ie = feature.__compat?.support.ie;

  if (!ie || ie === "mirror") return false;

  const version = getVersion(ie);
  return isValidVersion(version, true);
};

const getVersion = (
  supports: Support[] | Support | undefined
): string | boolean | null => {
  if (!supports) return false;

  let support: Support | undefined;

  if ("length" in supports) {
    support = supports[0];
  } else {
    support = supports;
  }

  if (!support) return false;
  if (support.prefix || support.partial_implementation) return false;

  return support.version_added;
};

export const isValidVersion = (
  version: VersionAdded | undefined,
  deprecatedIsValid: boolean = false
): version is string | true => {
  if (!version) return false;
  if (version === true) return true;
  if (!deprecatedIsValid && version.includes("≤")) return false;

  return true;
};

export const isEnabledFeatureOnMajorBrowser = (
  feature: Feature,
  versions: {
    chrome: string;
    safari: string;
    edge: string;
    firefox: string;
  }
) => {
  const support = feature.__compat?.support;

  if (!support) return false;

  if (
    isSupportedVersion(support.chrome, versions.chrome) &&
    isSupportedVersion(support.safari, versions.safari) &&
    isSupportedVersion(support.edge, versions.edge, support.chrome) &&
    isSupportedVersion(support.firefox, versions.firefox)
  ) {
    return true;
  }

  return false;
};

const isSupportedVersion = (
  support: CompatSupport | undefined,
  expectVersion: string,
  mirror?: CompatSupport | undefined
): boolean => {
  if (!support) return false;
  if (support === "mirror") {
    return isSupportedVersion(mirror!, expectVersion);
  }

  const version = getVersion(support);

  if (!isValidVersion(version)) return false;
  if (version === true) return true;

  return semver.lte(formatVersion(version), expectVersion);
};

const formatVersion = (ver: string) => {
  const verString = ver === "preview" ? "0" : ver;

  let vers = verString.split(".");

  vers = [...vers, ...[...new Array(3 - vers.length).keys()].map(() => "0")];

  return vers.join(".");
};
