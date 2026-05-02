import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp({ setUser }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",
    acceptTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const palette = {
    navy: '#22223b',
    indigo: '#4a4e69',
    mauve: '#9a8c98',
    beige: '#c9ada7',
    offwhite: '#f2e9e4',
  };

  const tunisianCities = [
    'Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte', 'Gabès', 'Ariana', 
    'Gafsa', 'Monastir', 'Ben Arous', 'Kasserine', 'Médenine', 'Nabeul',
    'Tataouine', 'Béja', 'Jendouba', 'Mahdia', 'Siliana', 'Kef', 'Tozeur',
    'Manouba', 'Zaghouan', 'Kebili', 'Sidi Bouzid'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
    
    if (!formData.password) newErrors.password = 'Le mot de passe est requis';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 caractères';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    if (!formData.city) newErrors.city = 'La ville est requise';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Vous devez accepter les conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create user account
    setUser({ 
      email: formData.email, 
      isAdmin: false,
      firstName: formData.firstName,
      lastName: formData.lastName 
    });

    setIsLoading(false);
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
      {/* Left Side - Visual */}
      <div className="hidden lg:block lg:w-2/5 relative overflow-hidden">
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            background: `linear-gradient(135deg, ${palette.indigo} 0%, ${palette.navy} 100%)`
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-6 gap-6 h-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl animate-pulse"
                    style={{
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: '4s'
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center text-white px-12">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-4xl">🚀</span>
                </div>
                <h3 className="text-3xl font-bold mb-4">
                  Rejoignez LayerLab
                </h3>
                <p className="text-lg opacity-90 leading-relaxed">
                  Créez votre compte et découvrez l'univers de l'impression 3D de qualité professionnelle.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-4 text-left max-w-sm mx-auto">
                {[
                  { icon: '🎁', text: 'Offres exclusives membres' },
                  { icon: '📦', text: 'Suivi de commandes en temps réel' },
                  { icon: '💎', text: 'Accès aux nouveautés en avant-première' },
                  { icon: '🏆', text: 'Programme de fidélité LayerLab' }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <span className="text-2xl">{benefit.icon}</span>
                    <span className="font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-16 left-16 w-12 h-12 bg-white/20 rounded-lg animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-32 right-20 w-8 h-8 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-24 left-12 w-16 h-16 bg-white/20 rounded-lg animate-bounce" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-16 right-16 w-10 h-10 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img src="/LL b.png" alt="LayerLab" className="w-16 h-16" />
            </div>
            <h2 className="text-3xl font-bold" style={{ color: palette.navy }}>
              Créer un compte
            </h2>
            <p className="mt-2 text-sm" style={{ color: palette.mauve }}>
              Rejoignez la communauté LayerLab dès aujourd'hui
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button
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
                Ou créer avec email
              </span>
            </div>
          </div>

          {/* Sign Up Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1" style={{ color: palette.indigo }}>
                  Prénom *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="yassine"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1" style={{ color: palette.indigo }}>
                  Nom *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="mkaouar"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: palette.indigo }}>
                Adresse email *
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-10 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="yassine@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm">📧</span>
                </div>
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone & City */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1" style={{ color: palette.indigo }}>
                  Téléphone *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="+216 20 123 456"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-1" style={{ color: palette.indigo }}>
                  Ville *
                </label>
                <select
                  id="city"
                  name="city"
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.city}
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionner</option>
                  {tunisianCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
            </div>

            {/* Password Fields */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: palette.indigo }}>
                Mot de passe *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-10 pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm">🔒</span>
                </div>
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1" style={{ color: palette.indigo }}>
                Confirmer le mot de passe *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm">🔒</span>
                </div>
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <span className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </span>
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="flex items-start space-x-2">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  className={`mt-1 h-4 w-4 rounded border-gray-300 focus:ring-blue-500 ${errors.acceptTerms ? 'border-red-500' : ''}`}
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                />
                <span className="text-sm" style={{ color: palette.mauve }}>
                  J'accepte les{' '}
                  <a href="#" className="font-medium hover:underline" style={{ color: palette.indigo }}>
                    conditions d'utilisation
                  </a>{' '}
                  et la{' '}
                  <a href="#" className="font-medium hover:underline" style={{ color: palette.indigo }}>
                    politique de confidentialité
                  </a>
                </span>
              </label>
              {errors.acceptTerms && <p className="text-red-500 text-xs mt-1">{errors.acceptTerms}</p>}
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
                    Création en cours...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>Créer mon compte</span>
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm" style={{ color: palette.mauve }}>
                Déjà un compte ?{' '}
                <a href="/login" className="font-medium hover:underline transition-colors" style={{ color: palette.indigo }}>
                  Se connecter
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;