import React from "react";

const Card = ({ children }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {children}
    </div>
  );
};

const CardContent = ({ children }) => {
  return <div className="p-2">{children}</div>;
};

export { Card, CardContent };
