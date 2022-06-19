import React from "react";

export const Badge: React.FC<{
  text: string;
}> = ({ text }) => {
  return (
    <span className="text-[8px] font-bold border-white border-w-[1px] border-solid border bg-white rounded px-1 text-gray-700">
      {text}
    </span>
  );
};
