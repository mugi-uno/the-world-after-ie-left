import deepmerge from "deepmerge";
import * as fs from "fs";
import * as path from "path";
import { CompatJson, CompatMap } from "../types/type";

const JS_COMPAT_DIR = "javascript";
const CSS_COMPAT_DIR = "css";
const HTML_COMPAT_DIR = "html";

export const createCompatMap = async (mdnRepo: string) => {
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
  let result!: CompatJson;

  texts.forEach((text) => {
    const json = JSON.parse(text);
    result = deepmerge(result, json);
  });

  return convert(result);
};

const convert = (json: CompatJson, key: string = "__root__"): CompatMap => {
  let features: CompatMap[] = [];

  Object.keys(json).forEach((featureKey) => {
    if (featureKey === "__compat") return;

    const childJson = json[featureKey];

    if (!childJson) return;

    features.push(convert(childJson as CompatJson, featureKey));
  });

  return {
    key,
    __features: features,
    __compat: json["__compat"],
  };
};
