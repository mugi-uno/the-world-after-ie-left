import type { Identifier } from "@mdn/browser-compat-data";
import React from "react";
import { Badge } from "./Badge";
import { IdentifierLink } from "./IdentifierLink";
import { IdentifierTree } from "./IdentifierTree";

export const IdentifierRoot: React.FC<{
  identifier: Identifier;
  name: string;
  id: string;
  badges?: string[];
  unwrapDepth: number;
  badgeClass?: string;
}> = ({ identifier, name, id, badges = [], badgeClass = "", unwrapDepth }) => {
  if (unwrapDepth > 0) {
    return (
      <>
        {Object.keys(identifier).flatMap(
          (key) =>
            key !== "__compat" && (
              <IdentifierRoot
                key={key}
                name={key}
                identifier={identifier[key]}
                id={`${id}-${key}`}
                badges={[...badges, name]}
                badgeClass={badgeClass}
                unwrapDepth={unwrapDepth - 1}
              />
            )
        )}
      </>
    );
  }

  const subIdentifierKeys = Object.keys(identifier);
  const hasSubIdentifier =
    subIdentifierKeys.length >= 2 ||
    (subIdentifierKeys.length === 1 && subIdentifierKeys[0] !== "__compat");
  const compat = identifier.__compat;

  return (
    <section className="font-mono m-2 mb-8 border-2">
      <div className="bg-gray-200 px-1 pl-2 pb-0.5">
        <div className="flex pt-1 pb-0.5">
          {badges.map((badge) => (
            <div key={badge} className="mr-1 flex">
              <Badge text={badge} className={badgeClass} />
            </div>
          ))}
        </div>
        <div className="flex items-center">
          <h2 className="font-bold mr-2" id={id}>
            <a href={`#${id}`}>{name}</a>
          </h2>
          <IdentifierLink identifier={identifier} />
        </div>
        {compat?.description && (
          <div
            dangerouslySetInnerHTML={{ __html: compat.description }}
            className="text-xs text-gray-700"
          ></div>
        )}
      </div>

      {hasSubIdentifier && (
        <div className="p-2">
          {subIdentifierKeys.map(
            (key) =>
              key !== "__compat" && (
                <IdentifierTree
                  key={key}
                  identifier={identifier[key]}
                  name={key}
                  id={`${id}-${key}`}
                />
              )
          )}
        </div>
      )}
    </section>
  );
};
