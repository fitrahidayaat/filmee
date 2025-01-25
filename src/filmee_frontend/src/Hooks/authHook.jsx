import { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { filmee_backend } from "declarations/filmee_backend";
import { AccountIdentifier } from '@dfinity/ledger-icp';

export const useAuth = () => {
  const [authClient, setAuthClient] = useState(null);
  const [principalId, setPrincipalId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountIdentifier, setAccountIdentifier] = useState('');

  useEffect(() => {
    let isMounted = true;

    const initializeAuthClient = async () => {
      const client = await AuthClient.create();
      if (isMounted) setAuthClient(client);

      const savedPrincipalId = localStorage.getItem('principalId');
      const savedAccountIdentifier = localStorage.getItem('accountIdentifier');

      if (savedPrincipalId && savedAccountIdentifier && isMounted) {
        setPrincipalId(savedPrincipalId);
        setAccountIdentifier(savedAccountIdentifier);
        setIsLoggedIn(true);
      }
    };

    initializeAuthClient();

    return () => {
      isMounted = false;
    };
  }, [principalId]);

  const Login = async () => {
    if (!authClient) throw new Error('AuthClient belum terinisialisasi');
    const client = await AuthClient.create();
    client.login({
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
        onSuccess: async () => {
            const principal = await authClient.getIdentity().getPrincipal();
            const accountIdentifier = AccountIdentifier.fromPrincipal({
              principal,
              subAccount: undefined,
            });
            
            localStorage.setItem('principalId', principal);
            localStorage.setItem('accountIdentifier', accountIdentifier.toHex());
            
            setPrincipalId(principal);
            setIsLoggedIn(true);
            setAccountIdentifier(accountIdentifier.toHex());

            await filmee_backend.authenticateUser("fitra", accountIdentifier.toHex(), principal.toText());
            
            // window.location.href = '/';
        },
    });

  };

  const Logout = () => {
    authClient.logout();
    setIsLoggedIn(false);
    setPrincipal('');
    localStorage.removeItem('principalId');
    window.location.href = '/';
  };

  return { authClient, principalId, Login, Logout, accountIdentifier };
};