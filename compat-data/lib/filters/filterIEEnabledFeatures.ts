import { Feature } from "../../types/type";
import { hasSubFeatures, isIEEnabledFeature } from "../compatUtils";

export const filterIEEnabledFeatures = (feature: Feature): Feature => {
  let nonIeFeature: Feature = {};

  nonIeFeature.__compat = feature.__compat;

  for (const key in feature) {
    if (key === "__compat") continue;

    const subFeature = filterIEEnabledFeatures(feature[key] as Feature);

    if (!isIEEnabledFeature(feature) || hasSubFeatures(feature)) {
      nonIeFeature[key] = subFeature;
    }
  }

  return nonIeFeature;
};
