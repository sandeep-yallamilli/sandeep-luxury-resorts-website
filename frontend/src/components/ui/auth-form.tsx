import { useState } from "react";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import Logo from "./logo";
import GoogleLoginButton from "./google-login-button";

type Feedback = { type: "success" | "error"; msg: string } | null;

export default function AuthForm({ type }: { type: "login" | "register" }) {
  const [mode, setMode] = useState<"login" | "register">(type);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setLoading(true);
    try {
      if (mode === "login") {
        const data = await apiClient.login({ username, password });
        login(data.token);
        setFeedback({ type: "success", msg: "Welcome back! Redirecting…" });
        setTimeout(() => navigate("/"), 900);
      } else {
        const data = await apiClient.register({ username, password });
        login(data.token);
        setFeedback({ type: "success", msg: "Account created! Redirecting…" });
        setTimeout(() => navigate("/"), 900);
      }
    } catch (error) {
      console.error(error);
      setFeedback({
        type: "error",
        msg: mode === "login"
          ? "Invalid credentials. Please try again."
          : "Registration failed. Username may already be taken.",
      });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next: "login" | "register") => {
    setMode(next);
    setFeedback(null);
    setUsername("");
    setPassword("");
  };

  return (
    <div className="w-full space-y-6">
      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-5 p-5 sm:p-8 bg-background/95 backdrop-blur-sm text-foreground rounded-2xl border border-gold/20 shadow-2xl"
      >
        {/* Logo + heading */}
        <div className="flex flex-col items-center gap-3 mb-2">
          <Logo showText={false} iconClassName="w-12 h-12" />
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-editorial text-foreground">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-[11px] text-foreground/45 uppercase tracking-widest font-sans">
              {mode === "login"
                ? "Sign in to your sanctuary passport"
                : "Join the Sandeep inner circle"}
            </p>
          </div>
        </div>

        {/* Inline feedback */}
        {feedback && (
          <div
            className={`flex items-start gap-2.5 p-3 rounded-lg text-xs font-semibold border ${
              feedback.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            {feedback.msg}
          </div>
        )}

        {/* Username field */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest text-foreground/50 font-semibold">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            <input
              type="text"
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-background/60 border border-gold/20 rounded-lg text-sm text-foreground placeholder:text-foreground/25 focus:border-gold focus:outline-none transition"
              required
              autoComplete="username"
            />
          </div>
        </div>

        {/* Password field */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest text-foreground/50 font-semibold">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            <input
              type={showPwd ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-10 py-3 bg-background/60 border border-gold/20 rounded-lg text-sm text-foreground placeholder:text-foreground/25 focus:border-gold focus:outline-none transition"
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPwd((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition cursor-pointer"
              aria-label={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gold hover:bg-gold/90 disabled:bg-gold/40 text-background font-bold text-xs tracking-[0.15em] uppercase rounded-lg transition-all cursor-pointer shadow-lg shadow-gold/10"
        >
          {loading
            ? "Processing…"
            : mode === "login"
            ? "Sign In to Sanctuary"
            : "Create My Account"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 text-foreground/20 text-[10px] uppercase tracking-widest">
          <span className="flex-1 h-px bg-gold/10" />
          or continue with
          <span className="flex-1 h-px bg-gold/10" />
        </div>

        {/* Google */}
        <GoogleLoginButton />

        {/* Mode toggle */}
        <p className="text-center text-xs text-foreground/50 pt-1">
          {mode === "login" ? (
            <>
              New to Sandeep?{" "}
              <button
                type="button"
                onClick={() => switchMode("register")}
                className="text-gold hover:underline font-semibold cursor-pointer"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already a member?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="text-gold hover:underline font-semibold cursor-pointer"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </form>

      {/* Footer note */}
      <p className="text-center text-[10px] text-foreground/20 uppercase tracking-widest">
        Sandeep Luxury Resorts · Secure & Private
      </p>
    </div>
  );
}
