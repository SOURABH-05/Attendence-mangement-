"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import api from "./api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkUser();
  }, [pathname]);

  const checkUser = async () => {
    const token = Cookies.get("token");
    if (!token) {
      setLoading(false);
      // Redirect to login if not already on an auth page, ignoring home page
      if (
        !pathname.startsWith("/login") &&
        !pathname.startsWith("/register") &&
        pathname !== "/"
      ) {
        router.push("/login");
      }
      return;
    }

    try {
      const res = await api.get("/auth/me");
      const currentUser = res.data.data;
      setUser(currentUser);

      // Redirect logic if on login page and already logged in
      if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
       redirectRole(currentUser.role);
      }
    } catch (err) {
      Cookies.remove("token");
      setUser(null);
      if (
        !pathname.startsWith("/login") &&
        !pathname.startsWith("/register") &&
        pathname !== "/"
      ) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const redirectRole = (role) => {
    switch (role) {
      case 'student': return router.push('/dashboard/student');
      case 'trainer': return router.push('/dashboard/trainer');
      case 'institution': return router.push('/dashboard/institution');
      case 'programme_manager': return router.push('/dashboard/manager');
      case 'monitoring_officer': return router.push('/dashboard/monitor');
      default: return router.push('/');
    }
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    Cookies.set("token", res.data.token, { expires: 30 });
    setUser(res.data.user);
    redirectRole(res.data.user.role);
    return res.data;
  };

  const register = async (userData) => {
    const res = await api.post("/auth/register", userData);
    Cookies.set("token", res.data.token, { expires: 30 });
    setUser(res.data.user);
    redirectRole(res.data.user.role);
    return res.data;
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
