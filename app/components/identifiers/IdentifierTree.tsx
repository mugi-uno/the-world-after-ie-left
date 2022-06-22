import type { Identifier } from "@mdn/browser-compat-data";
import React from "react";
import { IdentifierLink } from "./IdentifierLink";

export const IdentifierTree: React.FC<{
  identifier: Identifier;
  name: string;
  id: string;
}> = ({ identifier, name, id }) => {
  const subIdentifierKeys = Object.keys(identifier);
  const hasSubIdentifier =
    subIdentifierKeys.length >= 2 ||
    (subIdentifierKeys.length === 1 && subIdentifierKeys[0] !== "__compat");
  const compat = identifier.__compat;

  return (
    <section className="ml-4 font-mono">
      <div className="flex items-center">
        <h2 className="mr-2 text-sm" id={id}>
          <a href={`#${id}`}>{name}</a>
        </h2>
        <IdentifierLink identifier={identifier} />
      </div>

      {compat?.description && (
        <div
          dangerouslySetInnerHTML={{ __html: compat.description }}
          className="text-xs text-gray-500"
        ></div>
      )}
      <div className="border-w-[1px] border-solid border-b"></div>

      {hasSubIdentifier && (
        <ul>
          {subIdentifierKeys.map(
            (key) =>
              key !== "__compat" && (
                <li key={key}>
                  <IdentifierTree
                    identifier={identifier[key]}
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
