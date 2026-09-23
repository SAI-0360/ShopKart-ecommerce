import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { api } from "../services/api";
import { useContext } from "react";

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const userData = await api.get('/customers/me')
                setUser(userData.data.authenticatedUser)
            } catch {
                setUser(null)
            }
            finally {
                setLoading(false);
            }
        }

        fetchUser()
    }, [])


    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => useContext(AuthContext);