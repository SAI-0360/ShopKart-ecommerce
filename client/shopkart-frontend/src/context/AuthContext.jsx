import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { api } from "../services/api";
import { useContext } from "react";

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await api.get('/customers/me')
                setUser(userData.data.authenticatedUser)
            } catch {
                setUser(null)
            }
        }

        fetchUser()
    }, [])


    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => useContext(AuthContext);