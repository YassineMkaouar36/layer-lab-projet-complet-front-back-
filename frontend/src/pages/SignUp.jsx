import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";

function SignUp() {
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
  const [apiError, setApiError] = useState("");
  const [registered, setRegistered] = useState(false); // email sent state
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
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';

    if (!formData.password) newErrors.password = 'Le mot de passe est requis';
    else if (formData.password.length < 8) newErrors.password = 'Minimum 8 caractères';

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
    setApiError("");

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.city,
      });

      // Show confirmation — user must verify email before logging in
      setRegistered(true);
    } catch (err) {
      if (err.status === 409) {
        setApiError("Cette adresse email est déjà utilisée.");
      } else if (err.status === 400) {
        setApiError("Veuillez vérifier les informations saisies.");
      } else {
        setApiError(err.message || "Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Email sent confirmation screen ──────────────────────────────────────────
  if (registered) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#f2e9e4" }}
      >
        <div className="max-w-md w-full text-center px-6 py-12 bg-white rounded-2xl shadow-md">
          <div className="flex justify-center mb-6">
            <img src="/LL b.png" alt="LayerLab" className="w-16 h-16" />
          </div>
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#22223b" }}>
            Vérifiez votre email
          </h2>
          <p className="mb-2" style={{ color: "#9a8c98" }}>
            Un lien de confirmation a été envoyé à
          </p>
          <p className="font-semibold mb-6" style={{ color: "#4a4e69" }}>
            {formData.email}
          </p>
          <p className="text-sm mb-6" style={{ color: "#9a8c98" }}>
            Cliquez sur le lien dans l'email pour activer votre compte. Vérifiez aussi vos spams.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="inline-block px-6 py-3 rounded-xl text-white font-medium transition hover:opacity-90"
            style={{ backgroundColor: "#22223b" }}
          >
            Aller à la connexion
          </button>
        </div>
      </div>
    );
  }

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

          {/* Sign Up Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* API error banner */}
            {apiError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                <span className="text-red-500 mt-0.5">⚠️</span>
                <p className="text-sm text-red-700">{apiError}</p>
              </div>
            )}
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
                  Ville / Adresse *
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