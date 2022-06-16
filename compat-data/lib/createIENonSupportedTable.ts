import * as fs from "fs";
import * as path from "path";
import deepmerge from "deepmerge";

const JS_COMPAT_DIR = "javascript";

export const createIENonSupportedTable = async (mdnRepo: string) => {
  const jsCompatDir = path.resolve(mdnRepo, JS_COMPAT_DIR);

  const files = await recursiveRead(jsCompatDir);

  const table = convertAllJsonToTable(files);

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

    if (!compat.support.ie?.version_added) {
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
