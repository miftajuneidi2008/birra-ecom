"use client";
import { makeStore } from "@/lib/store";
import React from "react";
import { Provider } from "react-redux";

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={makeStore}>{children}</Provider>;
};

export default StoreProvider;
