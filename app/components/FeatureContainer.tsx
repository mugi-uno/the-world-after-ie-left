import React from "react";
import { Feature } from "~/lib/compat-data/types/type";
import { Badge } from "./Badge";
import { FeatureLinks } from "./FeatureLinks";
import { FeatureTree } from "./FeatureTree";

export const FeatureContainer: React.FC<{
  feature: Feature;
  name: string;
  badges: string[];
}> = ({ feature, name, badges = [] }) => {
  const subFeatureKeys = Object.keys(feature);
  const hasSubFeature =
    subFeatureKeys.length >= 2 ||
    (subFeatureKeys.length === 1 && subFeatureKeys[0] !== "__compat");
  const compat = feature.__compat;

  return (
    <section className="font-mono m-2 mb-8 border-2">
      <div className="bg-gray-200 p-1 pl-2">
        <div className="flex">
          {badges.map((badge) => (
            <span key={badge} className="mr-1">
              <Badge text={badge} />
            </span>
          ))}
        </div>
        <div className="flex items-center">
          <h2 className="font-bold mr-2">{name}</h2>
          <FeatureLinks feature={feature} />
        </div>
        {compat?.description && (
          <div
            dangerouslySetInnerHTML={{ __html: compat.description }}
            className="text-xs text-gray-700"
          ></div>
        )}
      </div>

      {hasSubFeature && (
        <div className="p-2">
          {subFeatureKeys.map(
            (key) =>
              key !== "__compat" && (
                <FeatureTree key={key} feature={feature[key]} name={key} />
              )
          )}
        </div>
      )}
    </section>
  );
};
