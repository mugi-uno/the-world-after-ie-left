"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterByMajorBrowsers = exports.filterIEEnabledFeatures = exports.filter = void 0;
const compatUtils_1 = require("../compatUtils");
const compatMap_1 = require("./../../tables/compatMap");
const filter = (feature, filterFunc) => {
    let filteredFeature = {};
    if (feature.__compat) {
        filteredFeature.__compat = feature.__compat;
    }
    for (const key in feature) {
        if (key === "__compat")
            continue;
        const subFeature = (0, exports.filter)(feature[key], filterFunc);
        if (filterFunc(subFeature)) {
            filteredFeature[key] = subFeature;
        }
    }
    return filteredFeature;
};
exports.filter = filter;
const filterIEEnabledFeatures = (feature) => {
    return (0, exports.filter)(feature, (checkFeature) => !(0, compatUtils_1.isIEEnabledFeature)(checkFeature) || (0, compatUtils_1.hasSubFeatures)(checkFeature));
};
exports.filterIEEnabledFeatures = filterIEEnabledFeatures;
const filterByMajorBrowsers = (versions) => {
    return (0, exports.filter)(compatMap_1.notIECompatMap, (feature) => {
        if ((0, compatUtils_1.hasSubFeatures)(feature))
            return true;
        return ((0, compatUtils_1.hasCompat)(feature) &&
            (0, compatUtils_1.isEnabledFeatureOnMajorBrowser)(feature, versions) &&
            !(0, compatUtils_1.isIEEnabledFeature)(feature));
    });
};
exports.filterByMajorBrowsers = filterByMajorBrowsers;
