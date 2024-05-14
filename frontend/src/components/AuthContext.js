import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {auth} from "../firebase/firebase-config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return unsubscribe;
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth); // Cierra la sesión en Firebase
            setUser(null); // Actualiza el estado del usuario a null
        } catch (error) {
            console.error("Error al cerrar sesión:", error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ user, handleSignOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;