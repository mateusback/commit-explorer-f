import { useState, useEffect } from 'react';

export const useGitHubToken = () => {
    const [token, setToken] = useState(null);
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        const savedToken = localStorage.getItem('github_token');
        if (savedToken) {
            setToken(savedToken);
            setHasToken(true);
        }
    }, []);

    const saveToken = (newToken) => {
        localStorage.setItem('github_token', newToken);
        setToken(newToken);
        setHasToken(true);
    };

    const removeToken = () => {
        localStorage.removeItem('github_token');
        localStorage.removeItem('github_token_skipped');
        setToken(null);
        setHasToken(false);
    };

    const getAuthHeaders = () => {
        if (!token) return {};
        return {
            'Authorization': `Bearer ${token}`,
            'X-GitHub-Token': token
        };
    };

    return {
        token,
        hasToken,
        saveToken,
        removeToken,
        getAuthHeaders
    };
};
