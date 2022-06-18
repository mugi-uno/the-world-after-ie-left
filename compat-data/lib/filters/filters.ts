import type { Feature } from "../../types/type";
import {
  hasCompat,
  hasSubFeatures,
  isEnabledFeatureOnMajorBrowser,
  isIEEnabledFeature,
} from "../compatUtils";
import { notIECompatMap } from "./../../tables/compatMap";

export const filter = (
  feature: Feature,
  filterFunc: (checkFeature: Feature) => boolean
): Feature => {
  let filteredFeature: Feature = {};

  if (feature.__compat) {
    filteredFeature.__compat = feature.__compat;
  }

  for (const key in feature) {
    if (key === "__compat") continue;

    const subFeature = filter(feature[key] as Feature, filterFunc);

    if (filterFunc(subFeature)) {
      filteredFeature[key] = subFeature;
    }
  }

  return filteredFeature;
};

export const filterIEEnabledFeatures = (feature: Feature): Feature => {
  return filter(
    feature,
    (checkFeature) =>
      !isIEEnabledFeature(checkFeature) || hasSubFeatures(checkFeature)
  );
};

export const filterByMajorBrowsers = (versions: {
  chrome: string;
  safari: string;
  edge: string;
  firefox: string;
}): Feature => {
  return filter(notIECompatMap, (feature) => {
    if (hasSubFeatures(feature)) return true;

    return (
      hasCompat(feature) && isEnabledFeatureOnMajorBrowser(feature, versions)
    );
  });
};
