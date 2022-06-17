import * as fs from "fs";
import * as path from "path";
import deepmerge from "deepmerge";
import { CompatJson, FlattenJson } from "../types/type";

const JS_COMPAT_DIR = "javascript";
const CSS_COMPAT_DIR = "css";
const HTML_COMPAT_DIR = "html";

export const createIENonSupportedTable = async (mdnRepo: string) => {
  const jsFiles = await recursiveRead(path.resolve(mdnRepo, JS_COMPAT_DIR));
  const cssFiles = await recursiveRead(path.resolve(mdnRepo, CSS_COMPAT_DIR));
  const htmlFiles = await recursiveRead(path.resolve(mdnRepo, HTML_COMPAT_DIR));

  const table = convertAllJsonToTable([...jsFiles, ...cssFiles, ...htmlFiles]);

  return table;
};

const recursiveRead = async (filePath: string): Promise<string[]> => {
  const stat = await fs.promises.stat(filePath);

  if (stat.isDirectory()) {
    const files = await fs.promises.readdir(filePath);

    let result: string[] = [];
    for (const f of files) {
      const ret = await recursiveRead(path.resolve(filePath, f));
      result = [...result, ...ret];
    }

    return result;
  }

  if (!stat.isFile()) return [];

  const text = await fs.promises.readFile(filePath);

  return [text.toString()];
};

const convertAllJsonToTable = (texts: string[]) => {
  let result = {};

  texts.forEach((text) => {
    const json = JSON.parse(text);
    result = deepmerge(result, json);
  });

  const flatted = flattenJson(result);

  return removeIEEnabledFeature(flatted);
};

const removeIEEnabledFeature = (flatted: FlattenJson): FlattenJson => {
  const result: FlattenJson = {};

  Object.keys(flatted).forEach((key) => {
    const compat = flatted[key];

    if (!compat) return;

    const ie = compat.support.ie;

    if (ie === "mirror") return;

    if (!ie) {
      result[key] = compat;
      return;
    }

    if ("length" in ie) {
      // add partial implementation feature
      if (ie.some((s) => s.version_added && s.partial_implementation)) {
        result[key] = compat;
      }
      return;
    }

    if (!ie.version_added) {
      result[key] = compat;
    }
  });

  return result;
};

const flattenJson = (
  json: CompatJson,
  keys: string[] = [],
  result: FlattenJson = {}
): FlattenJson => {
  Object.keys(json).forEach((key) => {
    if (key === "__compat") return;

    const childJson = json[key];
    if (!childJson) return;

    flattenJson(childJson as CompatJson, [...keys, key], result);
  });

  const compat = json["__compat"];
  if (compat) {
    result[keys.join(".")] = compat;
  }

  return result;
};
