"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEnabledFeatureOnMajorBrowser = exports.isValidVersion = exports.isIEEnabledFeature = exports.hasCompat = exports.hasSubFeatures = void 0;
const semver_1 = __importDefault(require("semver"));
const hasSubFeatures = (feature) => {
    const length = Object.keys(feature).length;
    return length >= 2 || (length == 1 && !feature["__compat"]);
};
exports.hasSubFeatures = hasSubFeatures;
const hasCompat = (feature) => {
    return !!feature.__compat;
};
exports.hasCompat = hasCompat;
const isIEEnabledFeature = (feature) => {
    const ie = feature.__compat?.support.ie;
    if (!ie || ie === "mirror")
        return false;
    const version = getVersion(ie);
    return (0, exports.isValidVersion)(version, true);
};
exports.isIEEnabledFeature = isIEEnabledFeature;
const getVersion = (supports) => {
    if (!supports)
        return false;
    let support;
    if ("length" in supports) {
        support = supports[0];
    }
    else {
        support = supports;
    }
    if (!support)
        return false;
    if (support.prefix || support.partial_implementation)
        return false;
    return support.version_added;
};
const isValidVersion = (version, deprecatedIsValid = false) => {
    if (!version)
        return false;
    if (version === true)
        return true;
    if (!deprecatedIsValid && version.includes("≤"))
        return false;
    return true;
};
exports.isValidVersion = isValidVersion;
const isEnabledFeatureOnMajorBrowser = (feature, versions) => {
    const support = feature.__compat?.support;
    if (!support)
        return false;
    if (isSupportedVersion(support.chrome, versions.chrome) &&
        isSupportedVersion(support.safari, versions.safari) &&
        isSupportedVersion(support.edge, versions.edge, support.chrome) &&
        isSupportedVersion(support.firefox, versions.firefox)) {
        return true;
    }
    return false;
};
exports.isEnabledFeatureOnMajorBrowser = isEnabledFeatureOnMajorBrowser;
const isSupportedVersion = (support, expectVersion, mirror) => {
    if (!support)
        return false;
    if (support === "mirror") {
        return isSupportedVersion(mirror, expectVersion);
    }
    const version = getVersion(support);
    if (!(0, exports.isValidVersion)(version))
        return false;
    if (version === true)
        return true;
    return semver_1.default.lte(formatVersion(version), expectVersion);
};
const formatVersion = (ver) => {
    const verString = ver === "preview" ? "0" : ver;
    let vers = verString.split(".");
    vers = [...vers, ...[...new Array(3 - vers.length).keys()].map(() => "0")];
    return vers.join(".");
};
