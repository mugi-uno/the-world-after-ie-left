import deepmerge from "deepmerge";
import * as fs from "fs";
import * as path from "path";
import { Feature } from "../types/type";

const JS_COMPAT_DIR = "javascript";
const CSS_COMPAT_DIR = "css";
const HTML_COMPAT_DIR = "html";

export const createCompatMap = async (mdnRepo: string) => {
  const jsFiles = await recursiveRead(path.resolve(mdnRepo, JS_COMPAT_DIR));
  // const cssFiles = await recursiveRead(path.resolve(mdnRepo, CSS_COMPAT_DIR));
  // const htmlFiles = await recursiveRead(path.resolve(mdnRepo, HTML_COMPAT_DIR));

  const table = convertAllJsonToTable([
    ...jsFiles,
    // ...cssFiles, ...htmlFiles
  ]);

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
  let feature!: Feature;

  texts.forEach((text) => {
    const json = JSON.parse(text);
    feature = deepmerge(feature, json);
  });

  return convert(feature);
};

const convert = (feature: Feature): Feature => {
  let convertedFeature: Feature = {};

  Object.keys(feature).forEach((key) => {
    if (key === "__compat") return;

    const childJson = feature[key];

    if (!childJson) return;

    convertedFeature[key] = convert(childJson as Feature);
  });

  convertedFeature["__compat"] = feature["__compat"];

  return convertedFeature;
};
