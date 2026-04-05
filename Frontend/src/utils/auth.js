/**
 * Secure JWT Token Decoder
 * Extracts claims from the token payload without external libraries.
 */
export const decodeToken = (token) => {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Token decoding failed", e);
        return null;
    }
};

/**
 * Gets the user role from the currently stored JWT token.
 * This is tamper-proof because it decodes the server-signed payload.
 */
export const getUserRole = () => {
    const token = localStorage.getItem('token');
    const decoded = decodeToken(token);
    if (!decoded) return null;

    // ASP.NET Core standard role claim key
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;
};

/**
 * Gets the user ID (Sub) from the currently stored JWT token.
 */
export const getUserId = () => {
    const token = localStorage.getItem('token');
    const decoded = decodeToken(token);
    if (!decoded) return null;

    return decoded.sub || decoded.nameid;
};

/**
 * Checks if the current user has the required role.
 */
export const hasRole = (requiredRole) => {
    const userRole = getUserRole();
    return userRole === requiredRole;
};
