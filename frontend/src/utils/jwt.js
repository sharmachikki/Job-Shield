// Lightweight, dependency-free JWT payload reader.
//
// This does NOT verify the token's signature — it only base64-decodes the
// payload so the UI can rehydrate session state (who's logged in, which
// roles) after a page refresh. Every real authorization decision still
// happens server-side in middleware/auth.middleware.js, which does verify
// the signature. This is purely for deciding what to render.
export function decodeJwt(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// exp is in seconds since epoch (standard JWT claim)
export function isTokenExpired(payload) {
  if (!payload || typeof payload.exp !== 'number') return true;
  return Date.now() >= payload.exp * 1000;
}
