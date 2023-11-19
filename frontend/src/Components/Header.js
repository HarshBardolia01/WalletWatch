import React, { useEffect, useState } from "react";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const [showLogin, UpdateShowLogin] = useState(false);
    const navigate = useNavigate();

    useEffect(async () => {
        const user = localStorage.getItem("user");
        if (!user) {
            UpdateShowLogin(true);
        } else {
            UpdateShowLogin(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        UpdateShowLogin(true);
    };

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <div className="header-bar">
            <h1 style={{ marginLeft: "10px" }}>WalletWatch</h1>
            {showLogin ? (
                <LoginIcon
                    fontSize="large"
                    style={{ marginRight: "25px" }}
                    className="header-icon"
                    onClick={handleLogin}
                />
            ) : (
                <LogoutIcon
                    fontSize="large"
                    className="header-icon"
                    onClick={handleLogout}
                />
            )}
        </div>
    );
};

export default Header;
