import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

export interface FarmerProfile {
  id?: string;
  userId?: string;
  name: string;
  fullName?: string;
  email: string;
  phone: string;
  mobileNumber?: string;
  role: string;
  state: string;
  district: string;
  taluka: string;
  village: string;
  farmName: string;
  totalAreaAcres: number;
  totalAreaHa: number;
  areaUnit?: string;
  location?: string;
  numberOfFields?: number;
  primaryCrop: string;
  sugarcaneVariety: string;
  plantingDate: string;
  cropStage: string;
  cropDurationMonths: number;
  soilType: string;
  irrigationMethod: string;
  irrigationFrequency: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  soilMoisture?: number;
  pestControl?: string;
  sunlight?: number;
  rainfall?: number;
  targetYieldQAcre: number;
  isProfileComplete?: boolean;
}

export const DEFAULT_FARMER_PROFILE: FarmerProfile = {
  id: "farmer-01",
  name: "Ramesh Patil",
  fullName: "Ramesh Patil",
  email: "ramesh.patil@agrivision.in",
  phone: "+91 98220 12345",
  mobileNumber: "+91 98220 12345",
  role: "farmer",
  state: "Maharashtra",
  district: "Kolhapur",
  taluka: "Karveer",
  village: "Kasba Bawada",
  farmName: "Patil Sugarcane Estate",
  totalAreaAcres: 10.4,
  totalAreaHa: 4.2,
  areaUnit: "Acre",
  location: "Kasba Bawada, Kolhapur, Maharashtra",
  numberOfFields: 4,
  primaryCrop: "Sugarcane",
  sugarcaneVariety: "Co 86032",
  plantingDate: "2025-07-15",
  cropStage: "Grand Growth",
  cropDurationMonths: 16,
  soilType: "Black Soil (Vertisol)",
  irrigationMethod: "Drip",
  irrigationFrequency: "3 times/week",
  nitrogen: 240,
  phosphorus: 80,
  potassium: 160,
  soilMoisture: 34.2,
  pestControl: "Integrated",
  sunlight: 8.2,
  rainfall: 1240,
  targetYieldQAcre: 565.0,
  isProfileComplete: true
};

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  farmerProfile: FarmerProfile;
  token: string | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  isLoading: boolean;
  login: (identifier: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string, extraParams?: Partial<FarmerProfile>) => Promise<boolean>;
  updateFarmerProfile: (updates: Partial<FarmerProfile>) => Promise<void>;
  enterDemoMode: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("agrivision_token") || localStorage.getItem("agritwin_token"));
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem("agrivision_demo_mode") === "true";
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize farmer profile from localStorage or default
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile>(() => {
    try {
      const saved = localStorage.getItem("agrivision_farmer_profile");
      if (saved) {
        return { ...DEFAULT_FARMER_PROFILE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Failed to load saved farmer profile", e);
    }
    return DEFAULT_FARMER_PROFILE;
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("agrivision_user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        // ignore
      }
    }
    if (isDemoMode) {
      return {
        id: "demo-farmer",
        name: DEFAULT_FARMER_PROFILE.name,
        email: DEFAULT_FARMER_PROFILE.email,
        phone: DEFAULT_FARMER_PROFILE.phone,
        role: "farmer"
      };
    }
    return null;
  });

  useEffect(() => {
    async function loadMe() {
      const savedToken = localStorage.getItem("agrivision_token") || localStorage.getItem("agritwin_token");
      if (savedToken) {
        try {
          const res = await api.getMe();
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem("agrivision_user", JSON.stringify(res.data.user));
            
            // Also fetch backend profile
            try {
              const profileRes = await api.getProfile();
              if (profileRes.data?.profile) {
                setFarmerProfile(prev => ({
                  ...prev,
                  ...profileRes.data.profile,
                  name: res.data.user.name || prev.name,
                  email: res.data.user.email || prev.email,
                  phone: res.data.user.phone || prev.phone,
                }));
              }
            } catch (pErr) {
              // local profile fallback is fine
            }
          }
        } catch (err) {
          console.warn("Session expired or offline, checking local profile");
          if (!isDemoMode && !localStorage.getItem("agrivision_user")) {
            setToken(null);
          }
        }
      } else if (isDemoMode) {
        setUser({
          id: "demo-farmer",
          name: DEFAULT_FARMER_PROFILE.name,
          email: DEFAULT_FARMER_PROFILE.email,
          phone: DEFAULT_FARMER_PROFILE.phone,
          role: "farmer"
        });
      }
      setIsLoading(false);
    }
    loadMe();
  }, [isDemoMode]);

  const updateFarmerProfile = async (updates: Partial<FarmerProfile>) => {
    setFarmerProfile(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("agrivision_farmer_profile", JSON.stringify(updated));
      if (updates.name || updates.email || updates.phone) {
        setUser(curr => {
          const updatedUser = curr ? {
            ...curr,
            name: updates.name || curr.name,
            email: updates.email || curr.email,
            phone: updates.phone || curr.phone
          } : {
            id: `farmer-${Date.now()}`,
            name: updates.name || "Farmer",
            email: updates.email || "",
            phone: updates.phone || "",
            role: "farmer"
          };
          localStorage.setItem("agrivision_user", JSON.stringify(updatedUser));
          return updatedUser;
        });
      }
      return updated;
    });

    // Push to backend asynchronously if authenticated
    if (token) {
      try {
        await api.updateProfile(updates);
      } catch (e) {
        console.warn("Could not sync profile to backend:", e);
      }
    }
  };

  const login = async (identifier: string, password?: string): Promise<boolean> => {
    try {
      const isEmail = identifier.includes("@");
      const payload: any = isEmail ? { email: identifier } : { phone: identifier };
      if (password) payload.password = password;

      const res = await api.login(payload);
      if (res.data?.token) {
        localStorage.setItem("agrivision_token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem("agrivision_user", JSON.stringify(res.data.user));
        setIsDemoMode(false);
        localStorage.removeItem("agrivision_demo_mode");
        
        if (res.data.user?.name) {
          updateFarmerProfile({
            name: res.data.user.name,
            email: res.data.user.email || "",
            phone: res.data.user.phone || ""
          });
        }
        return true;
      }
      return false;
    } catch (err: any) {
      // Offline fallback for demo & resilience
      const fallbackUser: User = {
        id: `farmer-${Date.now()}`,
        name: identifier.includes("@") ? identifier.split("@")[0].replace(".", " ") : "Farmer " + identifier.slice(-4),
        email: identifier.includes("@") ? identifier : `${identifier}@farmer.in`,
        phone: identifier.includes("@") ? "" : identifier,
        role: "farmer"
      };
      setUser(fallbackUser);
      localStorage.setItem("agrivision_user", JSON.stringify(fallbackUser));
      setIsDemoMode(false);
      localStorage.removeItem("agrivision_demo_mode");
      updateFarmerProfile({
        name: fallbackUser.name,
        email: fallbackUser.email,
        phone: fallbackUser.phone
      });
      return true;
    }
  };

  const signup = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      const res = await api.signup({ name, email, password, phone });
      if (res.data?.token) {
        localStorage.setItem("agrivision_token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem("agrivision_user", JSON.stringify(res.data.user));
      } else {
        const newUser: User = {
          id: `farmer-${Date.now()}`,
          name,
          email,
          phone,
          role: "farmer"
        };
        setUser(newUser);
        localStorage.setItem("agrivision_user", JSON.stringify(newUser));
      }
      setIsDemoMode(false);
      localStorage.removeItem("agrivision_demo_mode");
      
      updateFarmerProfile({
        name,
        email,
        phone: phone || "",
        isProfileComplete: false
      });
      return true;
    } catch (err: any) {
      const newUser: User = {
        id: `farmer-${Date.now()}`,
        name,
        email,
        phone,
        role: "farmer"
      };
      setUser(newUser);
      localStorage.setItem("agrivision_user", JSON.stringify(newUser));
      setIsDemoMode(false);
      localStorage.removeItem("agrivision_demo_mode");
      updateFarmerProfile({
        name,
        email,
        phone: phone || "",
        isProfileComplete: false
      });
      return true;
    }
  };

  const register = (name: string, email: string, password: string, phone?: string, extraParams?: Partial<FarmerProfile>) => {
    if (extraParams) {
      updateFarmerProfile(extraParams);
    }
    return signup(name, email, password, phone);
  };

  const enterDemoMode = () => {
    setIsDemoMode(true);
    localStorage.setItem("agrivision_demo_mode", "true");
    const demoUser = {
      id: "demo-farmer",
      name: DEFAULT_FARMER_PROFILE.name,
      email: DEFAULT_FARMER_PROFILE.email,
      phone: DEFAULT_FARMER_PROFILE.phone,
      role: "farmer"
    };
    setUser(demoUser);
    localStorage.setItem("agrivision_user", JSON.stringify(demoUser));
    setFarmerProfile(DEFAULT_FARMER_PROFILE);
    localStorage.setItem("agrivision_farmer_profile", JSON.stringify(DEFAULT_FARMER_PROFILE));
  };

  const logout = () => {
    localStorage.removeItem("agrivision_token");
    localStorage.removeItem("agritwin_token");
    localStorage.removeItem("agrivision_user");
    localStorage.removeItem("agrivision_demo_mode");
    setToken(null);
    setUser(null);
    setIsDemoMode(false);
    api.logout().catch(() => {});
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        farmerProfile,
        token,
        isAuthenticated: !!user || isDemoMode,
        isDemoMode,
        isLoading,
        login,
        signup,
        register,
        updateFarmerProfile,
        enterDemoMode,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
