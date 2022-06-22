import type {
  Identifier,
  SimpleSupportStatement,
  SupportStatement,
  VersionValue,
} from "@mdn/browser-compat-data";
import semver from "semver";

export const hasSubIdentifiers = (identifier: Identifier) => {
  const length = Object.keys(identifier).length;
  return length >= 2 || (length == 1 && !identifier["__compat"]);
};

export const hasCompat = (identifier: Identifier) => {
  return !!identifier.__compat;
};

export const isIEEnabled = (identifier: Identifier) => {
  const ie = identifier.__compat?.support.ie;
  const version = getVersion(ie);
  return isValidVersion(version, true);
};

const getVersion = (
  supportStatement: SupportStatement | undefined
): string | boolean | null => {
  if (!supportStatement) return false;

  let support: SimpleSupportStatement | undefined;

  if ("length" in supportStatement) {
    support = supportStatement[0];
  } else {
    support = supportStatement;
  }

  if (!support) return false;
  if (support.prefix || support.partial_implementation) return false;

  return support.version_added;
};

export const isValidVersion = (
  version: VersionValue | undefined,
  deprecatedIsValid: boolean = false
): version is string | true => {
  if (!version) return false;
  if (version === true) return true;
  if (!deprecatedIsValid && version.includes("≤")) return false;

  return true;
};

export const isEnabledOnMajorBrowser = (
  identifier: Identifier,
  versions: {
    chrome: string;
    safari: string;
    edge: string;
    firefox: string;
  }
) => {
  const support = identifier.__compat?.support;

  if (!support) return false;

  if (
    (!versions.chrome || isSupportedVersion(support.chrome, versions.chrome)) &&
    (!versions.safari || isSupportedVersion(support.safari, versions.safari)) &&
    (!versions.edge || isSupportedVersion(support.edge, versions.edge)) &&
    (!versions.firefox || isSupportedVersion(support.firefox, versions.firefox))
  ) {
    return true;
  }

  return false;
};

const isSupportedVersion = (
  support: SupportStatement | undefined,
  expectVersion: string
): boolean => {
  if (!support) return false;

  const version = getVersion(support);

  if (!isValidVersion(version)) return false;
  if (version === true) return true;

  return semver.lte(formatVersion(version), formatVersion(expectVersion));
};

const formatVersion = (ver: string) => {
  const verString = ver === "preview" ? "0" : ver;

  let vers = verString.split(".");

  vers = [...vers, ...[...new Array(3 - vers.length).keys()].map(() => "0")];

  return vers.join(".");
};
