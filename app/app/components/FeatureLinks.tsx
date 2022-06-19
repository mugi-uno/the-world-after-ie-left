import type { Feature } from "compat-data/types/type";
import React from "react";

export const FeatureLinks: React.FC<{
  feature: Feature;
}> = ({ feature }) => {
  const compat = feature.__compat;

  return (
    <>
      {compat?.mdn_url && (
        <span className="text-xs">
          [
          <a
            href={compat.mdn_url}
            target="_blank"
            className="text-blue-600 no-underline hover:underline"
            rel="noreferrer"
          >
            mdn
          </a>
          ]
        </span>
      )}
      {compat?.spec_url && (
        <span className="text-xs">
          [
          <a
            href={compat.mdn_url}
            target="_blank"
            className="text-blue-600 no-underline hover:underline"
            rel="noreferrer"
          >
            spec
          </a>
          ]
        </span>
      )}
    </>
  );
};
