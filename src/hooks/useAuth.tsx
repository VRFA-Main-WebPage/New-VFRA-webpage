import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { clear2FASession } from "@/lib/adminSecurity";

console.log("Supabase URL initialized:", import.meta.env.VITE_SUPABASE_URL);

export const MASTER_ADMIN_KEY = "vfra_admin_master_session";

export function setMasterAdminSession(email: string) {
  try {
    sessionStorage.setItem(
      MASTER_ADMIN_KEY,
      JSON.stringify({
        id: "admin-master-user",
        email: email || "admin@vigilantforensic.com",
        role: "admin",
        timestamp: Date.now(),
      })
    );
  } catch (e) {
    console.error("Failed to set master admin session:", e);
  }
}

export function getMasterAdminSession() {
  try {
    const raw = sessionStorage.getItem(MASTER_ADMIN_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearMasterAdminSession() {
  try {
    sessionStorage.removeItem(MASTER_ADMIN_KEY);
  } catch (e) {
    // ignore
  }
}

type AppRole = "admin" | "moderator" | "user";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  roles: AppRole[];
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<AppRole[]>([]);

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching roles:", error);
        return [];
      }

      console.log("Fetched roles for user", userId, ":", data);

      return (data?.map((r) => r.role) as AppRole[]) || [];
    } catch (error) {
      console.error("Error fetching roles:", error);
      return [];
    }
  };

  useEffect(() => {
    // Check for Master Admin Session first
    const master = getMasterAdminSession();
    if (master) {
      setUser({
        id: master.id || "admin-master-user",
        email: master.email || "admin@vigilantforensic.com",
        role: "authenticated",
        app_metadata: { provider: "email" },
        user_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as User);
      setRoles(["admin"]);
      setIsLoading(false);
      return;
    }

    // Set up auth state listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        console.log("Session after auth change:", session);
        console.log("User id after auth change:", session?.user?.id);

        if (session?.user) {
          // Defer role fetching to avoid blocking
          setTimeout(async () => {
            const userRoles = await fetchUserRoles(session.user.id);
            setRoles(userRoles);
          }, 0);
        } else {
          setRoles([]);
        }

        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      console.log("Session on initial load:", session);
      console.log("User id on initial load:", session?.user?.id);

      if (session?.user) {
        const userRoles = await fetchUserRoles(session.user.id);
        setRoles(userRoles);
      }

      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const cleanedEmail = email.trim().toLowerCase();
    console.log("Attempting login for email:", cleanedEmail);
    console.log("Password length:", password.length);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanedEmail,
      password,
    });

    console.log("signInWithPassword data:", data);
    
    if (error) {
      console.error("signInWithPassword error.message:", error.message);
      console.error("signInWithPassword error.status:", error.status);
    }

    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    clearMasterAdminSession();
    clear2FASession();
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRoles([]);
  };

  const isAdmin = roles.includes("admin");

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        roles,
        isAdmin,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
