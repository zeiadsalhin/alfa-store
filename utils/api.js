import { getAccessToken, refreshAccessToken } from './token';

const fetchWithAuth = async (url, options = {}) => {
    let token = getAccessToken();

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
    };

    let response = await fetch(url, { ...options, headers });

    if (response.status === 401) { // Token expired
        try {
            token = await refreshAccessToken();
            headers['Authorization'] = `Bearer ${token}`;
            response = await fetch(url, { ...options, headers });
        } catch (error) {
            console.error('Token refresh failed:', error);
            throw error;
        }
    }

    return response;
};

export default fetchWithAuth;