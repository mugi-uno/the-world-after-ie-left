import type { Feature, VersionAdded } from "./../types/type";
export declare const hasSubFeatures: (feature: Feature) => boolean;
export declare const hasCompat: (feature: Feature) => boolean;
export declare const isIEEnabledFeature: (feature: Feature) => boolean;
export declare const isValidVersion: (version: VersionAdded | undefined, deprecatedIsValid?: boolean) => version is string | true;
export declare const isEnabledFeatureOnMajorBrowser: (feature: Feature, versions: {
    chrome: string;
    safari: string;
    edge: string;
    firefox: string;
}) => boolean;
