import React, { useState } from "react";
import { Lock, Eye, EyeOff, Key, ShieldCheck, AlertCircle } from "lucide-react";

export default function PasswordForm({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  onSubmit,
  disabled = false,
  error = null
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password Strength Calculation (Entropy based)
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "Empty", color: "bg-slate-200", textColor: "text-slate-400" };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500", textColor: "text-red-600" };
    if (score === 2 || score === 3) return { score: 2, label: "Fair", color: "bg-amber-500", textColor: "text-amber-600" };
    if (score === 4) return { score: 3, label: "Strong", color: "bg-emerald-500", textColor: "text-emerald-600" };
    return { score: 4, label: "Very Strong", color: "bg-emerald-600", textColor: "text-emerald-700" };
  };

  const strength = getPasswordStrength(password);
  const isMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (disabled || isMismatch || !password.trim()) return;
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs max-w-3xl mx-auto"
    >
      <div className="space-y-1">
        <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
          <Key size={20} className="text-amber-500" />
          Set Document Password
        </h3>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          Create an opening password to encrypt your document streams and restrict unauthorized access.
        </p>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        {/* Password Input */}
        <div className="space-y-2">
          <label
            htmlFor="protect-password-input"
            className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider"
          >
            PDF Password <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock size={16} />
            </div>

            <input
              id="protect-password-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              disabled={disabled}
              autoFocus
              className="w-full pl-10 pr-12 py-3.5 border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all bg-white"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* Strength Meter Bar */}
          {password.length > 0 && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-400">Password Strength:</span>
                <span className={strength.textColor}>{strength.label}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                <div className={`h-full flex-1 transition-all ${strength.score >= 1 ? strength.color : "bg-slate-200"}`} />
                <div className={`h-full flex-1 transition-all ${strength.score >= 2 ? strength.color : "bg-slate-200"}`} />
                <div className={`h-full flex-1 transition-all ${strength.score >= 3 ? strength.color : "bg-slate-200"}`} />
                <div className={`h-full flex-1 transition-all ${strength.score >= 4 ? strength.color : "bg-slate-200"}`} />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <label
            htmlFor="protect-confirm-password-input"
            className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider"
          >
            Confirm Password <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock size={16} />
            </div>

            <input
              id="protect-confirm-password-input"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password..."
              disabled={disabled}
              className={`w-full pl-10 pr-12 py-3.5 border rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all ${
                isMismatch
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/20"
                  : "border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 bg-white"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              title={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* Mismatch Alert */}
          {isMismatch && (
            <p className="text-xs font-bold text-red-600 flex items-center gap-1 pt-0.5" role="alert">
              <AlertCircle size={13} />
              <span>Passwords do not match. Please verify your entry.</span>
            </p>
          )}
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-bold" role="alert">
          <AlertCircle size={16} className="shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Local Memory Safety Notice */}
      <p className="text-[11px] text-slate-400 font-semibold text-center leading-relaxed pt-1">
        🔒 Passwords exist transiently in local browser RAM and are never logged, stored, or sent to any server.
      </p>
    </form>
  );
}
