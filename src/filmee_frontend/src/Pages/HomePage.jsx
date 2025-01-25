import { useEffect, useState } from 'react';
import { filmee_backend } from 'declarations/filmee_backend';
import { useAuth } from "../Hooks/authHook";
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from "@dfinity/principal";

function App() {
    const { Login, principalId, accountIdentifier, authClient } = useAuth();
    
    const getUsers = async () => {
        const users = await filmee_backend.getUsers();
        console.log(users);
    }

    const showBalance = async () => {
        const balance = await filmee_backend.getAccountBalance(principalId);
        console.log(Number(balance)/1e8);
    }

    return (
        <>
            <button onClick={Login}>Login</button>
            <h1>{principalId ? principalId : ""}</h1>
            <h1>{accountIdentifier ? accountIdentifier : ""}</h1>

            <button onClick={getUsers}>getUsers</button>
            <button onClick={showBalance}>getBalance</button>
        </>
    );
}

export default App;