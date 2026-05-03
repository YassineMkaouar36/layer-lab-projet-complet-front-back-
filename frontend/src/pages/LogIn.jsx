import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, verifyTwoFactor } from "../services/api";
import { useAuth } from "../context/AuthContext";

const palette = {
  navy: "#22223b",
  indigo: "#4a4e69",
  mauve: "#9a8c98",
  beige: "#c9ada7",
  offwhite: "#f2e9e4",
};

// ─── 2FA verification step ────────────────────────────────────────────────────

function TwoFactorStep({ userId, onSuccess, onCancel }) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Veuillez saisir le code reçu par email.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const data = await verifyTwoFactor(userId, code.trim());
      onSuccess(data.token);
    } catch (err) {
      setError(err.message || "Code invalide ou expiré.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: palette.offwhite }}>
      <div className="max-w-md w-full space-y-8 px-4">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img src="/LL b.png" alt="LayerLab" className="w-16 h-16" />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: palette.navy }}>
            Vérification en deux étapes
          </h2>
          <p className="mt-2 text-sm" style={{ color: palette.mauve }}>
            Un code de vérification a été envoyé à votre adresse email.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium mb-2" style={{ color: palette.indigo }}>
              Code de vérification
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: palette.navy, boxShadow: "0 4px 14px 0 rgba(34,34,59,0.25)" }}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Vérification...
              </div>
            ) : (
              "Valider le code"
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full text-sm text-center hover:underline"
            style={{ color: palette.mauve }}
          >
            ← Retour à la connexion
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Login page ──────────────────────────────────────────────────────────

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // 2FA state
  const [twoFactorPending, setTwoFactorPending] = useState(false);
  const [pendingUserId, setPendingUserId] = useState(null);

  const navigate = useNavigate();
  const { signIn } = useAuth();

  /** Decode JWT to extract email and role. */
  function parseJwt(token) {
    try {
      const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }

  const handleLoginSuccess = (token) => {
    const payload = parseJwt(token);
    const userEmail = payload?.sub || email;
    const role = payload?.role || "ROLE_USER";
    const firstName = payload?.firstName || "";
    signIn(token, userEmail, role, firstName);
    navigate(role === "ROLE_ADMIN" ? "/admin" : "/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await login(email, password);

      if (data.requiresTwoFactor) {
        // Backend issued a 2FA challenge — show OTP input
        setPendingUserId(data.userId);
        setTwoFactorPending(true);
      } else {
        // Direct login — token is ready
        handleLoginSuccess(data.token);
      }
    } catch (err) {
      if (err.status === 401) {
        setError("Email ou mot de passe incorrect.");
      } else if (err.status === 400) {
        setError("Veuillez vérifier les informations saisies.");
      } else {
        setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show 2FA step if challenge was issued
  if (twoFactorPending) {
    return (
      <TwoFactorStep
        userId={pendingUserId}
        onSuccess={handleLoginSuccess}
        onCancel={() => {
          setTwoFactorPending(false);
          setPendingUserId(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: palette.offwhite }}>
      {/* ── Left Side — Login Form ── */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img src="/LL b.png" alt="LayerLab" className="w-16 h-16" />
            </div>
            <h2 className="text-3xl font-bold" style={{ color: palette.navy }}>
              Bienvenue sur LayerLab
            </h2>
            <p className="mt-2 text-sm" style={{ color: palette.mauve }}>
              Connectez-vous à votre compte pour accéder à vos impressions 3D
            </p>
          </div>

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Error banner */}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                <span className="text-red-500 mt-0.5">⚠️</span>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: palette.indigo }}>
                  Adresse email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400">📧</span>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: palette.indigo }}>
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12 pr-12"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔒</span>
                  </div>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    <span className="text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword ? "🙈" : "👁️"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm" style={{ color: palette.mauve }}>
                  Se souvenir de moi
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium hover:underline transition-colors" style={{ color: palette.indigo }}>
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: palette.navy,
                  boxShadow: "0 4px 14px 0 rgba(34, 34, 59, 0.25)",
                }}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Connexion en cours...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>Se connecter</span>
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                )}
              </button>
            </div>

            {/* Sign up link */}
            <div className="text-center">
              <p className="text-sm" style={{ color: palette.mauve }}>
                Pas encore de compte ?{" "}
                <a href="/signup" className="font-medium hover:underline transition-colors" style={{ color: palette.indigo }}>
                  Créer un compte
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* ── Right Side — Visual ── */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${palette.beige} 0%, ${palette.mauve} 100%)` }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-8 gap-4 h-full">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s`, animationDuration: "3s" }}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center text-white px-12">
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <img src="/other/3d printer.png" alt="3D Printer" className="w-36 h-36" />
                </div>
                <h3 className="text-3xl font-bold mb-4">L'impression 3D de qualité</h3>
                <p className="text-lg opacity-90 leading-relaxed">
                  Découvrez notre collection de produits imprimés en 3D avec des matériaux de haute qualité et une précision exceptionnelle.
                </p>
              </div>

              <div className="space-y-4 text-left max-w-sm mx-auto">
                {[
                  { icon: "⚡", text: "Impression rapide et précise" },
                  { icon: "🎯", text: "Matériaux de qualité premium" },
                  { icon: "🚚", text: "Livraison dans toute la Tunisie" },
                  { icon: "💎", text: "Designs uniques et personnalisés" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <span className="font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-20 left-20 w-16 h-16 bg-white/20 rounded-lg animate-bounce" style={{ animationDelay: "0s" }} />
            <div className="absolute top-40 right-32 w-12 h-12 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: "1s" }} />
            <div className="absolute bottom-32 left-16 w-20 h-20 bg-white/20 rounded-lg animate-bounce" style={{ animationDelay: "2s" }} />
            <div className="absolute bottom-20 right-20 w-14 h-14 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: "0.5s" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
