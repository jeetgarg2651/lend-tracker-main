
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./component/auth/login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./component/auth/ProtectedRoute";
import Customers from "./pages/Customer";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
    path="/customers"
    element={
        <ProtectedRoute>
            <Customers />
        </ProtectedRoute>
    }
/>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
