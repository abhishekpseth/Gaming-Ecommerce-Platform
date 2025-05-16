import React, { useState } from "react";

const InputBox = ({ label, value, onChange, type = 'text', name, required=true }) => {
  const [isFocused, setIsFocused] = useState(false);

  const shouldFloat = isFocused || value;

  return (
    <div className="relative w-full my-5">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        {...(required ? { required: true } : {})}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder=" "
        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md outline-none peer"
      />
      <label
        htmlFor={name}
        className={`absolute left-4 px-1 bg-white transition-all duration-200 ease-in-out
          ${shouldFloat ? "text-sm -top-2.5 text-gray-600" : "text-sm top-3 text-gray-500"}`}
      >
        {label}
      </label>
    </div>
  );
};

export default InputBox;
