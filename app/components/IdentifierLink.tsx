import React from "react";
import clsx from "clsx";

export const IdentifierLink: React.FC<{
  link: string;
  active: boolean;
  children: React.ReactNode;
}> = (props) => {
  return (
    <a
      href={props.link}
      className={clsx(
        "font-mono text-sm rounded outline px-2 cursor-pointer transition-all",
        props.active
          ? "outline-red-300"
          : "outline-gray-300 hover:outline-offset-2"
      )}
    >
      {props.children}
    </a>
  );
};
