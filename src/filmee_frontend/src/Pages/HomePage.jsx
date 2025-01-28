import React, { useState, useEffect } from "react";
import { AuthService } from "../Service/AuthService";
import { filmee_backend } from "../../../declarations/filmee_backend";

function App() {
    const [authService, setAuthService] = useState(null);
    const [principal, setPrincipal] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const auth = new AuthService();
        auth.init().then(() => {
            setAuthService(auth);
            setPrincipal(auth.principal);
            setIsAuthenticated(auth.isAuthenticated);
            setLoading(false);
        });
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await authService.login(username);
            setMessage("Registration successful!");
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleGetUser = async () => {
        try {
            const user = await authService.getCurrentUser();
            setMessage(user.username);
        } catch (error) {
            setMessage(error.message);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1 className="text-lime-400 text-4xl">User Authentication with Principal</h1>
            {isAuthenticated ? (
                <div>
                    <p>Logged in as: {principal.toText()}</p>
                    <button onClick={() => authService.logout()}>Logout</button>
                </div>
            ) : (
                <form onSubmit={handleLogin}>
                    username <input type="text" onChange={(e) => setUsername(e.target.value)} />
                    <button type="submit">Login with Internet Identity</button>
                </form>
            )}
            <p>{message}</p>
        </div>
    );
}

export default App;