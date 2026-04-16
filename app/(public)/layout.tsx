import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";
import { Toaster } from "react-hot-toast";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Banner />
      <Navbar />
      <Toaster />
      {children}
      <Footer />
    </>
  );
};

export default PublicLayout;
