import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Layout from "./Layout";
import Transactions from "./Pages/Transactions";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        
                        <Route index element={
                            <Transactions />
                        } />

                        <Route path="/register" element={
                            <Register />
                        } />

                        <Route path="/login" element={
                            <Login />
                        } />
                        
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
