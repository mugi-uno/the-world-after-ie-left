import { CompatMap } from "../../types/type";
import { hasSubFeatures, isIEEnabledFeature } from "../compatUtils";

export const filterIEEnabledFeatures = (compat: CompatMap): CompatMap => {
  const features = compat.__features.map((feature) =>
    filterIEEnabledFeatures(feature)
  );

  // remove empty features
  let emptyRemovedFeatures = features.filter((feature) => {
    if (isIEEnabledFeature(feature) && !hasSubFeatures(feature)) {
      return false;
    }
    return true;
  });

  return {
    ...compat,
    __features: emptyRemovedFeatures,
  };
};
