import React from "react";

export default function SectionHeader({ title }) {
  return (
    <h3 className="text-2xl font-bold text-blue-700 border-b border-blue-200 pb-1">
      {title}
    </h3>
  );
}
