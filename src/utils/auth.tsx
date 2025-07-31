import {useState, useEffect, useCallback, useRef} from 'react';  

const TOKEN_KEY = "token";
const EXPIRATION_KEY = "tokenExpiration";
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
const DEBOUNCE_DELAY = 500; 

function debounce<T extends (...args: any[]) => any>(func: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        const expiration = localStorage.getItem(EXPIRATION_KEY);
        if (token && expiration) {
            return new Date().getTime() < parseInt(expiration, 10);
        }
        return false;
    });

    const logoutTimerId = useRef<ReturnType<typeof setTimeout> | null>(null);

    const logout = useCallback(() => {
        if (logoutTimerId.current) {
            clearTimeout(logoutTimerId.current);
            logoutTimerId.current = null;
        }
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(EXPIRATION_KEY);
        setIsAuthenticated(false);
    }, []);

    const resetSessionExpiration = useCallback(() => {
        if (logoutTimerId.current) {
            clearTimeout(logoutTimerId.current);
        }
        
        const newExpirationTime = new Date().getTime() + INACTIVITY_TIMEOUT_MS;
        localStorage.setItem(EXPIRATION_KEY, newExpirationTime.toString());
        
        logoutTimerId.current = setTimeout(logout, INACTIVITY_TIMEOUT_MS);
    }, [logout]);

    const debouncedResetSessionExpiration = useRef(debounce(resetSessionExpiration, DEBOUNCE_DELAY)).current;

    const login = (token: string) => {
        localStorage.setItem(TOKEN_KEY, token);
        setIsAuthenticated(true);
        resetSessionExpiration(); 
    };

    useEffect(() => {
        if (isAuthenticated) {
            const expiration = localStorage.getItem(EXPIRATION_KEY);
            if (expiration) {
                const remainingTime = parseInt(expiration, 10) - new Date().getTime();
                if (remainingTime <= 0) {
                    logout();
                } else {
                    if (logoutTimerId.current) clearTimeout(logoutTimerId.current);
                    logoutTimerId.current = setTimeout(logout, remainingTime);
                }
            } else {
                logout();
            }

            ACTIVITY_EVENTS.forEach(event => {
                window.addEventListener(event, debouncedResetSessionExpiration);
            });

            return () => {
                ACTIVITY_EVENTS.forEach(event => {
                    window.removeEventListener(event, debouncedResetSessionExpiration);
                });
                if (logoutTimerId.current) {
                    clearTimeout(logoutTimerId.current);
                }
            };
        } else {
             ACTIVITY_EVENTS.forEach(event => {
                window.removeEventListener(event, debouncedResetSessionExpiration);
            });
            if (logoutTimerId.current) {
                clearTimeout(logoutTimerId.current);
                logoutTimerId.current = null;
            }
        }
    }, [isAuthenticated, logout, debouncedResetSessionExpiration]);


    return {isAuthenticated, login, logout};
}

export default useAuth;