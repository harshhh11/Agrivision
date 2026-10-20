import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../i18n";
import { ArrowRight, Lock, Mail, User, Phone, Eye, EyeOff, ArrowLeft } from "lucide-react";

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { t } = useI18n();

  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobileNumber.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    setError(null);
    const success = await signup(fullName, email, password, mobileNumber);
    setIsLoading(false);

    if (success) {
      // Direct immediately to the 5-step Profile Setup flow
      navigate("/profile/setup");
    } else {
      setError("Could not create account. Please try a different email or mobile number.");
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col justify-center items-center bg-[#FFFFFF] px-6 py-12 text-black font-sans">
      
      {/* Back to landing */}
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
            {t("createAccount")}
          </h1>
          <p className="text-sm text-[#6F6F6F] mt-2 font-normal">
            {t("createAccountSubtitle")}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-black mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Patil"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all placeholder:text-[#A0A0A0]"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-medium text-black mb-1.5">
              Mobile Number
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. 98220 12345"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all placeholder:text-[#A0A0A0]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-black mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="e.g. ramesh@agrivision.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all placeholder:text-[#A0A0A0]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-black mb-1.5">
              Password
            </label>
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-medium text-black mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all placeholder:text-[#A0A0A0]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-[#000000] text-white text-xs py-3.5 rounded-full hover:bg-neutral-800 transition-all font-medium flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
          >
            <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Already have account */}
        <div className="text-center mt-6 pt-6 border-t border-[#F0F0F0] text-xs text-[#6F6F6F]">
          <span>Already have an account? </span>
          <Link to="/login" className="text-black font-semibold hover:underline">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
};
