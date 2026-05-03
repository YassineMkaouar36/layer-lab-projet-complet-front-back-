import { createContext, useContext, useState, useCallback } from "react";

/**
 * AuthContext — global authentication state.
 *
 * Stored in localStorage:
 *   - "token"     : JWT string
 *   - "userEmail" : user email
 *   - "userRole"  : ROLE_USER | ROLE_ADMIN
 */

const AuthContext = createContext(null);

function parseJwt(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = parseJwt(token);
    if (!payload) return null;

    const role = payload.role || localStorage.getItem("userRole");
    if (!role) {
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userRole");
      return null;
    }

    return {
      email: payload.sub,
      firstName: payload.firstName || localStorage.getItem("userFirstName") || "",
      role,
      token,
    };
  });

  const signIn = useCallback((token, email, role, firstName) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userFirstName", firstName || "");
    setUser({ email, firstName: firstName || "", role, token });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userFirstName");
    setUser(null);
  }, []);

  const isAdmin = user?.role === "ROLE_ADMIN";

  return (
    <AuthContext.Provider value={{ user, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook to consume auth context anywhere in the app. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
