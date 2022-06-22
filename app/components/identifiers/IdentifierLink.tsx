import type { Identifier } from "@mdn/browser-compat-data";
import React from "react";

export const IdentifierLink: React.FC<{
  identifier: Identifier;
}> = ({ identifier }) => {
  const compat = identifier.__compat;

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
