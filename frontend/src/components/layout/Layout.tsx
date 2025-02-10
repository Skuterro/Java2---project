import React from "react";

import { Navbar } from "./Navbar";
import { Footer } from "./Footer"

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
   
      <Navbar />
      <main className="h-80[vh] ">{children}</main>
      <Footer />

 </>
  )
}