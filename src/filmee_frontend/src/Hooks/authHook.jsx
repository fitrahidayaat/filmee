import { useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { filmee_backend } from "../../../declarations/filmee_backend";

export const useAuth = () => {
    const [authClient, setAuthClient] = useState(null);
    const [principal, setPrincipal] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Add a loading state
    const [user, setUser] = useState();

    // Initialize AuthClient
    const initAuth = async () => {
        const client = await AuthClient.create();
        setAuthClient(client);

        if (await client.isAuthenticated()) {
            const identity = client.getIdentity().getPrincipal();
            setPrincipal(identity);
            setIsAuthenticated(true);
        }

        setLoading(false); // Set loading to false once initialization is complete
    };

    // Login using Internet Identity
    const register = async (username) => {
        if (!authClient) return;
        await authClient.login({
            identityProvider: "https://identity.ic0.app",
            onSuccess: async () => {
                const identity = authClient.getIdentity().getPrincipal();
                setPrincipal(identity);
                setIsAuthenticated(true);

                let res = await filmee_backend.authenticateUser(username, identity.toText());
                res = await filmee_backend.getUserById(identity.toText());

                setUser(res[0]);
                window.location.href = '/dashboard';
            },
        });
    };

    const login = async () => {
        if (!authClient) return;
        
        await authClient.login({
            identityProvider: "https://identity.ic0.app",
            onSuccess: async () => {
                const identity = authClient.getIdentity().getPrincipal();
                setPrincipal(identity);
                setIsAuthenticated(true);
                
                let res = await filmee_backend.authenticateUser("user", identity.toText());
                res = await filmee_backend.getUserById(identity.toText());

                setUser(res[0]);
                window.location.href = '/dashboard';
            },
        });
    };
    
    // Logout
    const logout = async () => {
        if (!authClient) return;

        await authClient.logout();
        setPrincipal(null);
        setIsAuthenticated(false);
    };

    // Initialize auth client on mount
    useEffect(() => {
        initAuth();
    }, []);

    return {
        authClient,
        principal,
        isAuthenticated,
        loading, // Expose the loading state
        user,
        register,
        login,
        logout,
    };
};