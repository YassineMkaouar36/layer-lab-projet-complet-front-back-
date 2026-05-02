import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const palette = {
    navy: '#22223b',
    indigo: '#4a4e69',
    mauve: '#9a8c98',
    beige: '#c9ada7',
    offwhite: '#f2e9e4',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple front-end check for admin
    const isAdmin = email === "admin@mail.com" && password === "admin";

    // Save user info in parent state
    setUser({ email, isAdmin });

    setIsLoading(false);
    
    // Redirect to Home after login
    navigate("/");
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    
    // Simulate social login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data from social login
    const mockSocialUser = {
      email: `user@${provider}.com`,
      isAdmin: false,
      firstName: 'Utilisateur',
      lastName: provider.charAt(0).toUpperCase() + provider.slice(1)
    };
    
    setUser(mockSocialUser);
    setIsLoading(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: palette.offwhite }}>
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Header */}
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
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuer avec Google
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continuer avec Facebook
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500" style={{ backgroundColor: palette.offwhite }}>
                  Ou continuer avec email
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Email Field */}
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

              {/* Password Field */}
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
                  >
                    <span className="text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword ? "🙈" : "👁️"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
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

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: palette.navy,
                  boxShadow: '0 4px 14px 0 rgba(34, 34, 59, 0.25)'
                }}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
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

            {/* Demo Credentials */}
            <div className="mt-6 p-4 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-xs font-medium mb-2" style={{ color: palette.indigo }}>
                🎯 Comptes de démonstration :
              </p>
              <div className="space-y-1 text-xs" style={{ color: palette.mauve }}>
                <p><strong>Admin:</strong> admin@mail.com / admin</p>
                <p><strong>Client:</strong> client@mail.com / client</p>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm" style={{ color: palette.mauve }}>
                Pas encore de compte ?{' '}
                <a href="/signup" className="font-medium hover:underline transition-colors" style={{ color: palette.indigo }}>
                  Créer un compte
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            background: `linear-gradient(135deg, ${palette.beige} 0%, ${palette.mauve} 100%)`
          }}
        >
          {/* 3D Printing Visual Elements */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-8 gap-4 h-full">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg animate-pulse"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '3s'
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Main Visual Content */}
            <div className="relative z-10 text-center text-white px-12">
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <img src="/other/3d printer.png " alt="3D Printer" className="w-36 h-36" />
                </div>
                <h3 className="text-3xl font-bold mb-4">
                  L'impression 3D de qualité
                </h3>
                <p className="text-lg opacity-90 leading-relaxed">
                  Découvrez notre collection de produits imprimés en 3D avec des matériaux de haute qualité et une précision exceptionnelle.
                </p>
              </div>

              {/* Feature Points */}
              <div className="space-y-4 text-left max-w-sm mx-auto">
                {[
                  { icon: '⚡', text: 'Impression rapide et précise' },
                  { icon: '🎯', text: 'Matériaux de qualité premium' },
                  { icon: '🚚', text: 'Livraison dans toute la Tunisie' },
                  { icon: '💎', text: 'Designs uniques et personnalisés' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <span className="font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-20 w-16 h-16 bg-white/20 rounded-lg animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-40 right-32 w-12 h-12 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-32 left-16 w-20 h-20 bg-white/20 rounded-lg animate-bounce" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-20 right-20 w-14 h-14 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
