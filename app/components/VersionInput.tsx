import React from "react";
import clsx from "clsx";

export const VersionInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = (props) => {
  return (
    <>
      <span className={clsx(!props.value && "text-gray-500 line-through")}>
        {props.label} ≧
      </span>
      <input
        type="string"
        value={props.value}
        className="outline-none border-gray-400 border-solid border-w-[1px] border rounded-sm ml-1 w-[60px]"
        onChange={(e) => props.onChange(e.target.value)}
      />
    </>
  );
};
