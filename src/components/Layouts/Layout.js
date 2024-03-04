import React, { Suspense } from "react";
import Loading from "./Loading";
import { Outlet } from "react-router-dom";
import Header from "../Layouts/Header";

const Layout = ({ selectedChain, setSelectedChain }) => {
  return (
    <>
      <Header
        setSelectedChain={setSelectedChain}
        selectedChain={selectedChain}
      />
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </>
  );
};

export default Layout;
