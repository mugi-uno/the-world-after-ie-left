import type { Feature } from "compat-data/dist/types/type";
import React from "react";

export const FeatureTree: React.FC<{
  feature: Feature;
  name: string;
  badges?: string[];
  depth?: number;
}> = ({ feature, name, badges = [], depth = 0 }) => {
  const subFeatureKeys = Object.keys(feature);
  const hasSubFeature =
    subFeatureKeys.length >= 2 ||
    (subFeatureKeys.length === 1 && subFeatureKeys[0] !== "__compat");

  return (
    <section className={`ml-4`}>
      <h2>{name}</h2>

      {hasSubFeature && (
        <ul>
          {subFeatureKeys.map(
            (key) =>
              key !== "__compat" && (
                <FeatureTree
                  key={key}
                  feature={feature[key]}
                  name={key}
                  badges={badges}
                  depth={depth + 1}
                />
              )
          )}
        </ul>
      )}
    </section>
  );
};
