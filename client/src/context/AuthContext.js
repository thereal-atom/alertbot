import React, { useContext, useState, useEffect } from "react";
import DiscordOauth2 from 'discord-oauth2'; 

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState();

    const login = (token) => {
        const loginUser = async () => {
            setLoading(true);
            const oauth = new DiscordOauth2();
            const user = await oauth.getUser(token);
            setCurrentUser(user);
            console.log(user);
            setLoading(false);
        }
        return loginUser();
    }
    const logout = () => {
        setCurrentUser();
    }
    const value = {
        currentUser,
        login,
        logout,
    }

    return (    
        <AuthContext.Provider value={value}>
           {!loading && children}     
        </AuthContext.Provider>
    )
}
