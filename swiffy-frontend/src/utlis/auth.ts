// utils/auth.ts
export function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = decodeURIComponent(
      atob(base64Url)
        .split('')
        .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(base64);
  } catch (e) {
    return null;
  }
}
// src/utils/auth.ts
// src/utils/auth.ts
export const getUserEmailFromToken = (): string | undefined => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
    );
    return payload.email;
  } catch (err) {
    console.error('Erreur dans le décodage du token:', err);
    return;
  }
};