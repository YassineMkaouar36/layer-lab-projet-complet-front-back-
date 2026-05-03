import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyEmail } from "../services/api";

const palette = {
  navy: "#22223b",
  indigo: "#4a4e69",
  mauve: "#9a8c98",
  offwhite: "#f2e9e4",
};

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Lien de vérification invalide.");
      return;
    }

    verifyEmail(token)
      .then(() => {
        setStatus("success");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "Lien invalide ou déjà utilisé.");
      });
  }, [searchParams]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: palette.offwhite }}
    >
      <div className="max-w-md w-full text-center px-6 py-12 bg-white rounded-2xl shadow-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/LL b.png" alt="LayerLab" className="w-16 h-16" />
        </div>

        {status === "loading" && (
          <>
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-600" />
            </div>
            <p style={{ color: palette.mauve }}>Vérification en cours...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: palette.navy }}>
              Email vérifié !
            </h2>
            <p className="mb-6" style={{ color: palette.mauve }}>
              Votre compte est maintenant actif. Vous pouvez vous connecter.
            </p>
            <Link
              to="/login"
              className="inline-block px-6 py-3 rounded-xl text-white font-medium transition hover:opacity-90"
              style={{ backgroundColor: palette.navy }}
            >
              Se connecter
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: palette.navy }}>
              Lien invalide
            </h2>
            <p className="mb-6" style={{ color: palette.mauve }}>
              {message}
            </p>
            <Link
              to="/signup"
              className="inline-block px-6 py-3 rounded-xl text-white font-medium transition hover:opacity-90"
              style={{ backgroundColor: palette.navy }}
            >
              Créer un compte
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
