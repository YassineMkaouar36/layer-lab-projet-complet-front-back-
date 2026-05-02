import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

        {/* LEFT - CONTACT INFO */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>

          <p className="mb-2">
            <span className="font-medium">Email:</span>{" "}
            <a
              href="mailto:layerlab@email.com"
              className="text-blue-400 hover:underline"
            >
              layerlab36@email.com
            </a>
          </p>

          <p className="flex items-center gap-2">
            <FaWhatsapp className="text-green-500 text-lg" />
            <a
              href="https://wa.me/21612345678"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              +216 28 748 509
            </a>
          </p>
        </div>

        {/* CENTER - SOCIAL MEDIA */}
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Follow Layer__Lab</h2>

          <div className="flex justify-center gap-6 text-2xl">
            <a
              href="https://www.instagram.com/layer__lab/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=61579478463864"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>

            <a
              href="https://www.tiktok.com/@layerlab1?_r=1&_t=ZM-939NP24jhkG"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
              aria-label="TikTok"
            >
              <FaTiktok />
            </a>
          </div>

          <p className="mt-3 text-sm text-gray-400">@Layer__Lab</p>
        </div>

        {/* RIGHT - IMAGE / LOGO */}
        <div className="flex justify-center md:justify-end">
          <img
            src="/layerlab-photo.png"
            alt="Layer Lab"
            className="w-32 h-32 object-cover rounded-xl shadow-lg"
          />
        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} LayerLab. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
