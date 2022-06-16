import { IENonSupportedCompatTable } from "compat-data";
import semver from "semver";

const CHROME = "80.0.0";
const SAFARI = "12.0.0";
const EDGE = "80.0.0";
const FIREFOX = "80.0.0";

const formatVersion = (ver: string) => {
  let vers = ver.split(".");

  vers = [...vers, ...[...new Array(3 - vers.length).keys()].map(() => "0")];

  return vers.join(".");
};

const features = Object.keys(IENonSupportedCompatTable).filter((key) => {
  const feature = IENonSupportedCompatTable[key];

  if (!feature) return false;

  const chromeVer = feature.support.chrome?.version_added;
  const safariVer = feature.support.safari?.version_added;
  const edgeVer = feature.support.edge?.version_added;
  const firefoxVer = feature.support.firefox?.version_added;

  if (
    chromeVer &&
    semver.lte(formatVersion(chromeVer), CHROME) &&
    safariVer &&
    semver.lte(formatVersion(safariVer), SAFARI) &&
    edgeVer &&
    semver.lte(formatVersion(edgeVer), EDGE) &&
    firefoxVer &&
    semver.lte(formatVersion(firefoxVer), FIREFOX)
  ) {
    return true;
  }

  return false;
});

console.log(features);
