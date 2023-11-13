import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Transactions from "./Pages/Transactions";

function App() {
    const navigate = useNavigate();

    const navigateToRegister = () => {
        navigate("/register");
    };

    const navigateToLogin = () => {
        navigate("/login");
    };

    const navigateToHome = () => {
        navigate("/");
    };
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Transactions />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </div>
    );
}

export default App;
