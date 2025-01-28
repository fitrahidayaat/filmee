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
            await authService.login();
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await authService.register(username);
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
            <h1 className="text-4xl">User Authentication with Principal</h1>
            {isAuthenticated ? (
                <div>
                    <p>Logged in as: {principal.toText()}</p>
                    <form action="" onSubmit={() => {authService.logout()}}>
                        <button type="submit">Logout</button>
                    </form>
                </div>
            ) : (
                <>
                    <form onSubmit={handleLogin}>
                        <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-lg">Login</button>
                    </form>
                    <form onSubmit={handleRegister}>
                        username <input type="text" onChange={(e) => setUsername(e.target.value)} />
                        <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-lg">Register</button>
                    </form>
                </>
            )}
        </div>
    );
}

export default App;