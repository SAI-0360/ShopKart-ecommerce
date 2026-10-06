import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import Landing from "./pages/Landing"
import Products from "./pages/Products"
import ProductDetails from "./pages/ProductDetails"
import Wishlist from "./pages/Wishlist"
import Cart from "./pages/Cart"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import PublicRoute from "./routes/PublicRoute"
import ProtectedRoute from "./routes/ProtectedRoute"

function App() {


    return (
        <>
            <AuthProvider>
                <CartProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
                            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                            <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                            <Route path="/products/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
                            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                        </Routes>
                    </BrowserRouter>
                </CartProvider>
            </AuthProvider>
        </>
    )
}

export default App