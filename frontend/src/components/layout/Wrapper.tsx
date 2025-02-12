import React from "react";

interface WrapperProps {
  children? :React.ReactNode;
}

export const Wrapper = ({children}: WrapperProps) => {
  return <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 overflow-x-hidden">
    {children}
  </div>
}