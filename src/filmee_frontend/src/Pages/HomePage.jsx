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
    const [image, setImage] = useState(null);
    const [userData, setUserData] = useState(null);

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
            const a  = await authService.register(username);
            console.log(a);
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleGetUser = async () => {
        try {
            const user = await filmee_backend.getUserById(principal.toText());
            setMessage(user.username);
        } catch (error) {
            setMessage(error.message);
        }
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const profilePic = e.target.image.files[0];
    
        // Read the file content as text
        const fileReader = new FileReader();
        fileReader.onload = async (event) => {
            const fileContent = event.target.result; // This is the text content of the file
    
            // Update the user profile with the text content
            const res = await filmee_backend.updateUserProfile(principal.toText(), {
                "username": [username],
                "profilePic": [fileContent] // Save the text content instead of the file object
            });

            // setImage(fileContent);
            console.log(res);
        };
    
        // Read the file as a data URL
        fileReader.readAsDataURL(profilePic);
    };

    const fetchUserData = async () => {
        try {
            // Fetch user data by ID
            let user = await filmee_backend.getUserById(principal.toText());
            console.log("User Data:", user);
            user = user[0]
            console.log(user.profilePic[0]);
            // Update the user data state
            setUserData(user);

            // If the user has a profile picture, update the image state
            if (user.profilePic) {
                setImage(user.profilePic[0]);
            } else {
                setImage(null); // Clear the image if no profile picture exists
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
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
                    {image && <img src={image} alt="Profile" />} {/* Display the image if it exists */}
                    <form action="" onSubmit={() => { authService.logout() }}>
                        <button type="submit">Logout</button>
                    </form>
        
                    <form action="" onSubmit={updateProfile}>
                        <input type="text" name="username" />
                        <input type="file" name="image" accept="image/*" /> {/* Accept only image files */}
                        <button type="submit">Update Profile</button>
                    </form>
        
                    {/* Button to fetch user data */}
                    <button onClick={fetchUserData}>Fetch User Data</button>
        
                    {/* Display user data if available */}
                    {userData && (
                        <div>
                            <h3>User Details</h3>
                            <p>Username: {userData.username}</p>
                            <p>Tier: {userData.tier}</p>
                            <p>Tier Valid Until: {Date(Number(userData.tierValidUntil))}</p>
                        </div>
                    )}
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