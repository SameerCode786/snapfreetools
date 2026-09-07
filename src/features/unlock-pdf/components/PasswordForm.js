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
          Enter Opening Password
        </h3>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          Enter the password to verify credentials and remove encryption from your document.
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
            placeholder="Type opening password..."
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
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
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

      {/* Forgotten Password Guidance (Case 5) & Privacy Notice */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 space-y-1">
          <h4 className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
            <HelpCircle size={15} className="text-amber-600 shrink-0" />
            Forgot your PDF password?
          </h4>
          <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
            This tool cannot recover unknown opening passwords. PDF encryption is designed to prevent unauthorized access. Please contact the document owner.
          </p>
        </div>

        <p className="text-[11px] text-slate-400 font-semibold text-center leading-relaxed">
          🔒 Your files never leave your device. All PDF processing happens locally in your browser.
        </p>
      </div>
    </form>
  );
}
