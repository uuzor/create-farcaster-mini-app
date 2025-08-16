"use client";
import React from "react";

export function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: number;
  onChange: (i: number) => void;
}) {
  return (
    <div
      className="flex bg-card rounded-md border border-muted my-4 overflow-hidden"
      role="tablist"
      aria-label="Segmented control"
    >
      {options.map((opt, i) => (
        <button
          key={opt}
          role="tab"
          aria-selected={value === i}
          onClick={() => onChange(i)}
          className={
            "flex-1 py-2 font-medium text-sm transition-colors " +
            (value === i
              ? "text-accent border-b-2 border-accent bg-accent/10"
              : "text-textSecondary border-b-2 border-transparent")
          }
        >
          {opt}
        </button>
      ))}
    </div>
  );
}