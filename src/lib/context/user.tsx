import { ID, Models } from 'appwrite';
import { createContext, useContext, useEffect, useState } from 'react';
import { account } from '../appwrite';

interface IUserContext {
    current: Models.User<Models.Preferences> | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    error: string | null;
    setError: (error: string | null) => void;
    isLoading: boolean;
}

interface AppwriteError {
    type: string;
    message: string;
}

const REFRESH_INTERVAL = 14 * 60 * 1000; 

const UserContext = createContext<IUserContext | null>(null);

export function useUser() {
    return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null),
        [error, setError] = useState<string | null>(null),
        [isLoading, setIsLoading] = useState<boolean>(true);

    async function login(email: string, password: string) {
        try {
            setIsLoading(true);
            await account.createEmailPasswordSession({ email, password });
            const loggedInUser = await account.get();
            const accountJWT = await account.createJWT();
            sessionStorage.setItem('accountJWT', accountJWT.jwt);
            setUser(loggedInUser);
            setError(null);
            window.location.replace('/');
        }
        catch (err) {
            const error = err as Error;
            setError(error.message || 'An error occurred');
        }
        finally {
            setIsLoading(false);
        }
    }

    async function logout() {
        try {
            await account.deleteSession({ sessionId: 'current'});
        }
        catch (err) {
            console.error('Logout error:', err);
        }
        finally {
            setUser(null);
            setIsLoading(false);
            sessionStorage.removeItem('accountJWT');
        }
    }

    async function register(email: string, password: string) {
        try {
            setIsLoading(true);
            await account.create(ID.unique(), email, password);
            await login(email, password);
        }
        catch (err) {
            const error = err as Error;
            setError(error.message || 'An error occurred');
            setIsLoading(false);
        }
    }

    // Initial session check.
    useEffect(() => {
        async function initSession() {
            try {
                const currentUser = await account.get();
                if (currentUser) {
                    const accountJWT = await account.createJWT();
                    sessionStorage.setItem('accountJWT', accountJWT.jwt);
                    setUser(currentUser);
                }
            }
            catch (err) {
                setUser(null);
            }
            finally {
                setIsLoading(false);
            }
        };

        initSession();
    }, []); // Run once on mount.

    useEffect(() => {
        if (!user) return; // Don't set up refresh for logged-out users.

        let refreshInterval: number | null = null;

        const refreshToken = async() => {
            try {
                // First, verify the session is still valid.
                await account.get();
                // If the session is valid, refresh the JWT.
                const accountJWT = await account.createJWT();
                sessionStorage.setItem('accountJWT', accountJWT.jwt);
            }
            catch (err) {
                const error = err as any;
                // Log the user out if there is an unauthorized-scope or session-not-found error.
                if (error?.type === 'general_unauthorized_scope' ||
                    error?.type === 'user_session_not_found') {
                    if (refreshInterval) {
                        clearInterval(refreshInterval);
                    }
                    await logout();
                }
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                refreshToken();
            }
        };

        // Set up the refresh interval.
        refreshInterval = window.setInterval(refreshToken, REFRESH_INTERVAL);

        // Add the visibility change listener.
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup
        return () => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [user]); // Only reset the refresh logic when the user changes.

    return (
        <UserContext.Provider value={{
            current : user,
            login,
            logout,
            register,
            error,
            setError,
            isLoading
        }}>
            {children}
        </UserContext.Provider>
    );
}