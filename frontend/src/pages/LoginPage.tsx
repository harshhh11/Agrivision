import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../i18n";
import { ArrowRight, Lock, Mail, Phone, Eye, EyeOff, Sparkles, ArrowLeft } from "lucide-react";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, enterDemoMode, authError } = useAuth();
  const { t, language } = useI18n();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  // Return to intended page if protected route triggered redirect
  const from = (location.state as any)?.from?.pathname || "/farm";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError("Please enter your mobile number or email and password.");
      return;
    }

    setIsLoading(true);
    setError(null);
    const success = await login(identifier, password);
    setIsLoading(false);

    if (success) {
      navigate(from, { replace: true });
    } else {
      setError(authError || "Invalid credentials. Please verify your mobile number / email and password.");
    }
  };

  const handleDemoLogin = () => {
    enterDemoMode();
    navigate("/farm");
  };

  return (
    <div className="min-h-[90vh] flex flex-col justify-center items-center bg-[#FFFFFF] px-6 py-12 text-black font-sans">
      
      {/* Top back link to landing page */}
      <div className="w-full max-w-md mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#6F6F6F] hover:text-black transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>AgriVision</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EBEBEB] p-8 sm:p-10 shadow-xs">
        
        {/* Title & Subtitle */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-black tracking-tight">
            {t("welcomeBack")}
          </h1>
          <p className="text-sm text-[#6F6F6F] mt-2 font-normal">
            {t("signInSubtitle")}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Mobile number or Email */}
          <div>
            <label className="block text-xs font-medium text-black mb-1.5">
              Mobile number or Email
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. 9822012345 or farmer@agrivision.in"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all placeholder:text-[#A0A0A0]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-black">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert("Password reset link will be sent to your registered mobile/email.")}
                className="text-[11px] text-[#6F6F6F] hover:text-black hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all placeholder:text-[#A0A0A0]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-[#888888] hover:text-black"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-[#000000] text-white text-xs py-3.5 rounded-full hover:bg-neutral-800 transition-all font-medium flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
          >
            <span>{isLoading ? "Signing In..." : "Sign In"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Create account link */}
        <div className="text-center mt-6 pt-6 border-t border-[#F0F0F0] text-xs text-[#6F6F6F]">
          <span>Don't have an account? </span>
          <Link to="/signup" className="text-black font-semibold hover:underline">
            Create one
          </Link>
        </div>

        {/* Explore Demo Farm */}
        <div className="mt-4 pt-2 text-center">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="text-xs text-emerald-800 font-medium hover:underline flex items-center justify-center gap-1.5 mx-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("exploreDemoFarm")} (Ramesh Patil)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
