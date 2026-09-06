import React, { useState } from "react";
import { Lock, Unlock, Eye, EyeOff, Key, ShieldCheck, HelpCircle } from "lucide-react";

export default function PasswordForm({ onUnlock, disabled = false, error = null }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [inputError, setInputError] = useState(null);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (disabled) return;

    if (!password.trim()) {
      setInputError("Please enter the PDF password.");
      return;
    }

    setInputError(null);
    onUnlock(password);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const activeError = inputError || error;

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs max-w-3xl mx-auto"
    >
      <div className="space-y-1">
        <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
          <Key size={20} className="text-amber-500" />
          Enter Document Password
        </h3>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          Enter the password you already have to verify credentials and strip encryption protection.
        </p>
      </div>

      {/* Input Field Group */}
      <div className="space-y-2">
        <label 
          htmlFor="pdf-password-input" 
          className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider"
        >
          PDF Password <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Lock size={16} />
          </div>

          <input
            id="pdf-password-input"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (inputError) setInputError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type document password..."
            disabled={disabled}
            autoFocus
            aria-required="true"
            aria-invalid={!!activeError}
            className={`w-full pl-10 pr-12 py-3.5 border rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all ${
              activeError
                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/20"
                : "border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 bg-white"
            }`}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            title={showPassword ? "Hide password" : "Show password"}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Validation Error Message */}
        {activeError && (
          <p className="text-xs font-bold text-red-600 flex items-center gap-1.5 pt-1" role="alert">
            <span>⚠️ {activeError}</span>
          </p>
        )}
      </div>

      {/* CTA Button */}
      <button
        type="submit"
        disabled={disabled}
        className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-black py-4 px-8 rounded-2xl shadow-md shadow-amber-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-base cursor-pointer disabled:opacity-50"
      >
        <Unlock size={20} />
        <span>Unlock PDF</span>
      </button>

      {/* Forgotten Password Guidance & Privacy Notice */}
      <div className="space-y-2 pt-1 border-t border-slate-100">
        <p className="text-[11px] text-amber-800 font-semibold text-center leading-relaxed bg-amber-50/70 p-2.5 rounded-xl border border-amber-100/80 flex items-center justify-center gap-1.5">
          <HelpCircle size={14} className="shrink-0 text-amber-600" />
          <span>Don't know the password? We cannot crack unknown passwords. Please contact the document owner.</span>
        </p>

        <p className="text-[11px] text-slate-400 font-semibold text-center leading-relaxed">
          🔒 Passwords are processed transiently in local browser memory and are never logged or saved.
        </p>
      </div>
    </form>
  );
}
