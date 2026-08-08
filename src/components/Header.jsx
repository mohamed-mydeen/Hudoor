import React from 'react';

export const Header = ({ title, subtitle, rightElement }) => {
  return (
    <header className="bg-white px-6 pt-10 pb-4 sticky top-0 z-40 bg-opacity-95 backdrop-blur-md">
      <div className="flex justify-between items-end">
        <div>
          {subtitle && <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">{subtitle}</p>}
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
        </div>
        {rightElement && (
          <div>{rightElement}</div>
        )}
      </div>
    </header>
  );
};
