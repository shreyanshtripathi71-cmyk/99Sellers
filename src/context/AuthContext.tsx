"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI, subscriptionAPI, SubscriptionStatus } from "@/services/api";

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  userType?: string;
  createdAt: string;
}

export interface Subscription {
  id?: number;
  plan: "free" | "basic" | "premium" | "enterprise";
  status: "active" | "trialing" | "expired" | "cancelled" | "suspended";
  billingCycle: "monthly" | "yearly";
  startDate?: string;
  endDate?: string;
  trialStartDate?: string;
  trialEndDate?: string;
  trialDaysRemaining?: number;
  price?: number;
  autoRenew?: boolean;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: string;
  features?: {
    searchLimit?: number;
    exportLimit?: number;
    apiCallsPerDay?: number;
    advancedSearch?: boolean;
    fullDataAccess?: boolean;
    exportEnabled?: boolean;
    leadGeneration?: boolean;
    realTimeAlerts?: boolean;
  };
}

interface AuthState {
  user: User | null;
  subscription: Subscription | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; userType?: string }>;
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<{ success: boolean; message: string; userType?: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  updateSubscription: (data: Partial<Subscription>) => void;
  refreshSubscription: () => Promise<void>;
  startTrial: () => Promise<{ success: boolean; message: string }>;
  canAccessPremium: () => boolean;
  isTrialActive: () => boolean;
  getTrialDaysRemaining: () => number;
  maskData: (data: string, type?: "name" | "address" | "phone" | "email") => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: "99sellers_user",
  SUBSCRIPTION: "99sellers_subscription",
  AUTH_TOKEN: "99sellers_token",
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// ============ DEMO/TEST USERS (works without backend) ============
const DEMO_USERS = {
  "admin@example.com": {
    password: "password",
    user: {
      id: "demo-admin-1",
      email: "admin@example.com",
      name: "Admin User",
      firstName: "Admin",
      lastName: "User",
      userType: "Admin",
      createdAt: "2025-01-01T00:00:00Z",
    },
    subscription: {
      plan: "enterprise" as const,
      status: "active" as const,
      billingCycle: "yearly" as const,
      features: {
        searchLimit: -1, // unlimited
        exportLimit: -1,
        apiCallsPerDay: -1,
        advancedSearch: true,
        fullDataAccess: true,
        exportEnabled: true,
        leadGeneration: true,
        realTimeAlerts: true,
      },
    },
  },
  "free@example.com": {
    password: "password",
    user: {
      id: "demo-free-1",
      email: "free@example.com",
      name: "Free User",
      firstName: "Free",
      lastName: "User",
      userType: "public",
      createdAt: "2025-01-01T00:00:00Z",
    },
    subscription: {
      plan: "free" as const,
      status: "active" as const,
      billingCycle: "monthly" as const,
      features: {
        searchLimit: 50,
        exportLimit: 0,
        advancedSearch: false,
        fullDataAccess: false,
        exportEnabled: false,
        leadGeneration: false,
        realTimeAlerts: false,
      },
    },
  },
  "paid@example.com": {
    password: "password",
    user: {
      id: "demo-paid-1",
      email: "paid@example.com",
      name: "Premium User",
      firstName: "Premium",
      lastName: "User",
      userType: "public",
      createdAt: "2025-01-01T00:00:00Z",
    },
    subscription: {
      plan: "premium" as const,
      status: "active" as const,
      billingCycle: "monthly" as const,
      price: 99,
      features: {
        searchLimit: 5000,
        exportLimit: 1000,
        apiCallsPerDay: 10000,
        advancedSearch: true,
        fullDataAccess: true,
        exportEnabled: true,
        leadGeneration: true,
        realTimeAlerts: true,
      },
    },
  },
};
// ============ END DEMO USERS ============

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    subscription: null,
    isAuthenticated: false,
    isLoading: true,
    isAdmin: false,
  });

  const getDefaultSubscription = (): Subscription => ({
    plan: "free",
    status: "active",
    billingCycle: "monthly",
    features: {
      searchLimit: 50,
      exportLimit: 0,
      advancedSearch: false,
      fullDataAccess: false,
      exportEnabled: false,
      leadGeneration: false,
      realTimeAlerts: false,
    },
  });

  const mapBackendSubscription = (data: SubscriptionStatus): Subscription => ({
    id: data.id,
    plan: data.planType as Subscription["plan"],
    status: data.status as Subscription["status"],
    billingCycle: data.billingCycle as Subscription["billingCycle"],
    startDate: data.startDate,
    endDate: data.endDate,
    trialStartDate: data.trial?.startDate,
    trialEndDate: data.trial?.endDate,
    trialDaysRemaining: data.trial?.daysRemaining,
    price: data.price,
    autoRenew: data.autoRenew,
    features: data.features as Subscription["features"],
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const storedSubscription = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

        if (storedUser && token) {
          const user = JSON.parse(storedUser);
          let subscription = storedSubscription ? JSON.parse(storedSubscription) : getDefaultSubscription();

          try {
            const subResult = await subscriptionAPI.getStatus();
            if (subResult.success && subResult.data) {
              subscription = mapBackendSubscription(subResult.data);
              localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(subscription));
            }
          } catch (e) {
            console.log("Could not fetch subscription status, using cached");
          }

          setState({
            user,
            subscription,
            isAuthenticated: true,
            isLoading: false,
            isAdmin: user.userType === "Admin",
          });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Error loading auth state:", error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string; userType?: string }> => {
    // ============ CHECK DEMO USERS FIRST ============
    const demoUser = DEMO_USERS[email.toLowerCase() as keyof typeof DEMO_USERS];
    if (demoUser && demoUser.password === password) {
      console.log("Demo user login:", email);
      const user = demoUser.user as User;
      const subscription = demoUser.subscription as Subscription;
      
      // Create a mock token for demo users
      const mockToken = btoa(JSON.stringify({ id: user.id, role: user.userType, demo: true }));
      
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, `demo.${mockToken}.signature`);
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(subscription));

      setState({
        user,
        subscription,
        isAuthenticated: true,
        isLoading: false,
        isAdmin: user.userType === "Admin",
      });

      return { success: true, message: "Demo login successful", userType: user.userType };
    }
    // ============ END DEMO USER CHECK ============

    try {
      console.log("Attempting login to:", API_BASE_URL + "/api/login");
      const response = await fetch(API_BASE_URL + "/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Login response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        const tokenPayload = JSON.parse(atob(data.token.split(".")[1]));

        const user: User = {
          id: tokenPayload.id.toString(),
          email: email,
          name: email.split("@")[0],
          userType: data.userType,
          createdAt: new Date().toISOString(),
        };

        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);

        let subscription = getDefaultSubscription();
        try {
          const subResult = await subscriptionAPI.getStatus();
          if (subResult.success && subResult.data) {
            subscription = mapBackendSubscription(subResult.data);
          }
        } catch (e) {
          console.log("Could not fetch subscription, using default");
        }
        localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(subscription));

        setState({
          user,
          subscription,
          isAuthenticated: true,
          isLoading: false,
          isAdmin: data.userType === "Admin",
        });

        return { success: true, message: "Login successful", userType: data.userType };
      } else {
        const error = await response.json();
        console.log("Login failed with error:", error);
        return { success: false, message: error.error || "Invalid credentials" };
      }
    } catch (error: any) {
      console.error("Login error:", error);
      console.error("Error name:", error?.name);
      console.error("Error message:", error?.message);
      // If backend is not available, show helpful message about demo users
      return { 
        success: false, 
        message: "Backend not available. Try demo accounts: admin@example.com, free@example.com, or paid@example.com (password: password)" 
      };
    }
  };

  const register = async (data: { firstName: string; lastName: string; email: string; password: string }): Promise<{ success: boolean; message: string; userType?: string }> => {
    try {
      console.log("Attempting registration to:", API_BASE_URL + "/api/register");
      const response = await fetch(API_BASE_URL + "/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        }),
      });

      console.log("Register response status:", response.status);
      
      if (response.ok) {
        const loginResult = await login(data.email, data.password);
        if (loginResult.success) {
          try {
            await subscriptionAPI.startTrial();
            await refreshSubscription();
          } catch (e) {
            console.log("Could not start trial");
          }
          return { success: true, message: "Account created successfully! Your 15-day trial has started.", userType: loginResult.userType };
        }
        return loginResult;
      } else {
        const error = await response.json();
        console.log("Registration failed with error:", error);
        return { success: false, message: error.error || "Registration failed" };
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      console.error("Error name:", error?.name);
      console.error("Error message:", error?.message);
      if (error?.name === "TypeError" && error?.message?.includes("fetch")) {
        return { success: false, message: "Server is not running. Please start the backend server." };
      }
      return { success: false, message: "Unable to connect to server. Please check your connection and try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    authAPI.logout();

    setState({
      user: null,
      subscription: null,
      isAuthenticated: false,
      isLoading: false,
      isAdmin: false,
    });
  };

  const updateUser = (data: Partial<User>) => {
    if (!state.user) return;

    const updatedUser = { ...state.user, ...data };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    setState((prev) => ({ ...prev, user: updatedUser }));
  };

  const updateSubscription = (data: Partial<Subscription>) => {
    if (!state.subscription) return;

    const updatedSubscription = { ...state.subscription, ...data };
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(updatedSubscription));
    setState((prev) => ({ ...prev, subscription: updatedSubscription }));
  };

  const refreshSubscription = async () => {
    try {
      const result = await subscriptionAPI.getStatus();
      if (result.success && result.data) {
        const subscription = mapBackendSubscription(result.data);
        localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(subscription));
        setState((prev) => ({ ...prev, subscription }));
      }
    } catch (error) {
      console.error("Error refreshing subscription:", error);
    }
  };

  const startTrial = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await subscriptionAPI.startTrial();
      if (result.success) {
        await refreshSubscription();
        return { success: true, message: "Your 15-day trial has started!" };
      }
      return { success: false, message: result.error || "Could not start trial" };
    } catch (error) {
      return { success: false, message: "Error starting trial" };
    }
  };

  const isTrialActive = (): boolean => {
    if (!state.subscription) return false;
    if (state.subscription.status !== "trialing") return false;
    if (!state.subscription.trialEndDate) return false;

    return new Date(state.subscription.trialEndDate) > new Date();
  };

  const getTrialDaysRemaining = (): number => {
    if (state.subscription?.trialDaysRemaining !== undefined) {
      return state.subscription.trialDaysRemaining;
    }

    if (!state.subscription?.trialEndDate) return 0;

    const endDate = new Date(state.subscription.trialEndDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  };

  const canAccessPremium = (): boolean => {
    if (!state.subscription) return false;

    if (state.subscription.features?.fullDataAccess) return true;

    if (state.subscription.status === "active" && state.subscription.plan !== "free") {
      return true;
    }

    if (isTrialActive()) {
      return true;
    }

    return false;
  };

  const maskData = (data: string, type: "name" | "address" | "phone" | "email" = "name"): string => {
    if (!data) return "***";
    if (canAccessPremium()) return data;

    switch (type) {
      case "name":
        if (data.length <= 2) return "***";
        const nameParts = data.split(" ");
        return nameParts.map((part) => part[0] + "*".repeat(Math.max(part.length - 1, 2))).join(" ");

      case "address":
        const words = data.split(" ");
        if (words.length <= 2) return "****";
        return words.slice(0, 2).map(() => "****").join(" ") + " " + words.slice(-2).join(" ");

      case "phone":
        const cleaned = data.replace(/\D/g, "");
        return "(***)***-" + cleaned.slice(-4);

      case "email":
        const atIndex = data.indexOf("@");
        if (atIndex <= 0) return "****@****.com";
        return data[0] + "****" + data.substring(atIndex);

      default:
        return "****";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
        updateSubscription,
        refreshSubscription,
        startTrial,
        canAccessPremium,
        isTrialActive,
        getTrialDaysRemaining,
        maskData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
