import React from "react";
import { Feature } from "~/lib/compat-data/types/type";
import { FeatureLinks } from "./FeatureLinks";

export const FeatureTree: React.FC<{
  feature: Feature;
  name: string;
  id: string;
}> = ({ feature, name, id }) => {
  const subFeatureKeys = Object.keys(feature);
  const hasSubFeature =
    subFeatureKeys.length >= 2 ||
    (subFeatureKeys.length === 1 && subFeatureKeys[0] !== "__compat");
  const compat = feature.__compat;

  return (
    <section className="ml-4 font-mono">
      <div className="flex items-center">
        <h2 className="mr-2 text-sm" id={id}>
          <a href={`#${id}`}>{name}</a>
        </h2>
        <FeatureLinks feature={feature} />
      </div>

      {compat?.description && (
        <div
          dangerouslySetInnerHTML={{ __html: compat.description }}
          className="text-xs text-gray-500"
        ></div>
      )}
      <div className="border-w-[1px] border-solid border-b"></div>

      {hasSubFeature && (
        <ul>
          {subFeatureKeys.map(
            (key) =>
              key !== "__compat" && (
                <li key={key}>
                  <FeatureTree
                    feature={feature[key]}
                    name={key}
                    id={`${id}-${key}`}
                  />
                </li>
              )
          )}
        </ul>
      )}
    </section>
  );
};
