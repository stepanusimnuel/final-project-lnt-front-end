"use client";

import React from "react";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mustFill?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({ label, name, type = "text", value, onChange, mustFill = false }) => {
  return (
    <div>
      <label htmlFor={name} className="block mb-1 font-medium text-gray-800 dark:text-gray-200">
        {label}
        <span className="text-red-500 ms-1">{mustFill ? "*" : ""}</span>
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full p-2 border "border-gray-300 dark:border-gray-600"
         rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 "focus:ring-sky-300 dark:focus:ring-sky-500"
        `}
      />
    </div>
  );
};
