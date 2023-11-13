import React from "react";
import Header from "./Components/Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <main>
            <Header />
            <Outlet />
        </main>
    );
}

export default Layout;