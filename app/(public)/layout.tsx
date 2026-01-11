import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Banner />
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default PublicLayout;
