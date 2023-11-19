import React from "react";
import LogoutIcon from "@mui/icons-material/Logout";

const Header = ({ currentUser }) => {

    const handleLogout = () => {
        localStorage.removeItem('user');
    }

    return (
        <div className="header-bar">
            <h1 style={{ marginLeft: "10px" }}>WalletWatch</h1>

            {
                currentUser &&

                <LogoutIcon
                    fontSize="large"
                    className="header-icon"
                    onClick={handleLogout}
                />
            }
        </div>
    );
};

export default Header;
