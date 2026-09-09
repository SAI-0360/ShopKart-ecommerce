import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import Landing from "./pages/Landing"
import { AuthProvider } from "./context/AuthContext"
import PublicRoute from "./components/PublicRoute"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {


    return (
        <>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
                        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    </Routes>


                </BrowserRouter>
            </AuthProvider>
        </>
    )
}

export default App