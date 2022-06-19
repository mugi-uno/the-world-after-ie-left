import type { Feature } from "../../types/type";
export declare const filter: (feature: Feature, filterFunc: (checkFeature: Feature) => boolean) => Feature;
export declare const filterIEEnabledFeatures: (feature: Feature) => Feature;
export declare const filterByMajorBrowsers: (versions: {
    chrome: string;
    safari: string;
    edge: string;
    firefox: string;
}) => Feature;
