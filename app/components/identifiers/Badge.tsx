import clsx from "clsx";
import React from "react";

export const Badge: React.FC<{
  text: string;
  className?: string;
}> = ({ text, className }) => {
  return (
    <span
      className={clsx(
        className,
        "text-[8px] font-bold border-white border-w-[1px] border-solid border rounded px-1 text-gray-900"
      )}
    >
      {text}
    </span>
  );
};
