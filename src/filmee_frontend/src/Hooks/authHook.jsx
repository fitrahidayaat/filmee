<<<<<<< HEAD
import { useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { filmee_backend } from "../../../declarations/filmee_backend";

export const useAuth = () => {
    const [authClient, setAuthClient] = useState(null);
    const [principal, setPrincipal] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Add a loading state

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
            identityProvider: process.env.DFX_NETWORK === "local" ? "https://identity.ic0.app" : "http://localhost:8000?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai",
            onSuccess: async () => {
                const identity = authClient.getIdentity().getPrincipal();
                setPrincipal(identity);
                setIsAuthenticated(true);

                await filmee_backend.authenticateUser(username, identity.toText());
                window.location.href = '/';
            },
        });
    };

    const login = async () => {
        if (!authClient) return;

        await authClient.login({
            identityProvider: process.env.DFX_NETWORK === "local" ? "https://identity.ic0.app" : "http://localhost:8000?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai",
            onSuccess: async () => {
                const identity = authClient.getIdentity().getPrincipal();
                setPrincipal(identity);
                setIsAuthenticated(true);

                window.location.href = '/';
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
        register,
        login,
        logout,
    };
=======
import { useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { filmee_backend } from "../../../declarations/filmee_backend";

export const useAuth = () => {
    const [authClient, setAuthClient] = useState(null);
    const [principal, setPrincipal] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Add a loading state

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
            identityProvider: process.env.DFX_NETWORK === "local" ? "https://identity.ic0.app" : "http://localhost:8000?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai",
            onSuccess: async () => {
                const identity = authClient.getIdentity().getPrincipal();
                setPrincipal(identity);
                setIsAuthenticated(true);

                await filmee_backend.authenticateUser(username, identity.toText());
                window.location.href = '/';
            },
        });
    };

    const login = async () => {
        if (!authClient) return;

        await authClient.login({
            identityProvider: process.env.DFX_NETWORK === "local" ? "https://identity.ic0.app" : "http://localhost:8000?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai",
            onSuccess: async () => {
                const identity = authClient.getIdentity().getPrincipal();
                setPrincipal(identity);
                setIsAuthenticated(true);

                window.location.href = '/';
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
        register,
        login,
        logout,
    };
>>>>>>> 14a3929a952e8bbfd175cc6d3d95bac0870ca9b1
};