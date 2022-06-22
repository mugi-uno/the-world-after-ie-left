import type { Identifier } from "@mdn/browser-compat-data";
import bcd from "@mdn/browser-compat-data";
import { ROOT_IDENTIFIERS } from "~/constant";
import type { FilteredCompatData } from "~/types/types";
import {
  hasCompat,
  hasSubIdentifiers,
  isEnabledOnMajorBrowser,
  isIEEnabled,
} from "./compatUtils";

export const filter = (
  filterFunc: (target: Identifier) => boolean
): FilteredCompatData => {
  let filteredCompatData: FilteredCompatData = { ...bcd };

  ROOT_IDENTIFIERS.forEach((key) => {
    filteredCompatData[key] = filterIdentifier(bcd[key], filterFunc);
  });

  return filteredCompatData;
};

export const filterIdentifier = (
  identifier: Identifier,
  filterFunc: (target: Identifier) => boolean
): Identifier => {
  let filtered: Identifier = {};

  if (identifier.__compat) {
    filtered.__compat = identifier.__compat;
  }

  for (const key in identifier) {
    if (key === "__compat") continue;

    const subIdentifier = filterIdentifier(identifier[key], filterFunc);

    if (filterFunc(subIdentifier)) {
      filtered[key] = subIdentifier;
    }
  }

  return filtered;
};

export const filterByMajorBrowsers = (versions: {
  chrome: string;
  safari: string;
  edge: string;
  firefox: string;
}): FilteredCompatData => {
  return filter((identifer) => {
    if (hasSubIdentifiers(identifer)) return true;

    return (
      hasCompat(identifer) &&
      isEnabledOnMajorBrowser(identifer, versions) &&
      !isIEEnabled(identifer)
    );
  });
};
