import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PublicRoute = ({children}) => {
    const { user, loading } = useAuth()
    
    if(loading){
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if(user){
        return <Navigate to="/home" replace />;
    }

    return children;
    
}

export default PublicRoute