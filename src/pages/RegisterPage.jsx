import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/logo.png";
import axios from "axios";

// ✅ TAMBAHAN (toast)
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState(""); // UI saja
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // ✅ TAMBAHAN
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleRegister = async () => {
    // ✅ TAMBAHAN
    setError("");

    if (!name || !username || !password) {
      // ✅ ganti alert -> toast
      const msg = "Semua field harus diisi!";
      setError(msg);
      toast.error("Lengkapi datanya dulu ya 🙂");
      return;
    }

    // ⬇️ DETEKSI EMAIL ATAU USERNAME
    const isEmail = username.includes("@");

    let toastId;
    try {
      // ✅ TAMBAHAN
      setLoading(true);
      toastId = toast.loading("Sedang mendaftar...");

      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email: isEmail ? username : null, // email = username
        password,
        user_type: isEmail ? "adult" : "child",
      });

      // ✅ ganti alert -> toast
      toast.success("Registrasi berhasil! Silakan login 🎉", { id: toastId });

      // ✅ overlay smooth sebelum pindah halaman
      setIsRedirecting(true);
      await new Promise((r) => setTimeout(r, 650));

      window.location.href = "/";
    } catch (err) {
      const msg = err.response?.data?.message || "Registrasi gagal";
      setError(msg);

      // ✅ ganti alert -> toast
      if (toastId) toast.error(msg, { id: toastId });
      else toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-transparent px-4 overflow-hidden">
      {/* ✅ TAMBAHAN: OVERLAY GAMBAR */}
      <img
        src="/bgbinclas.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center opacity-35 pointer-events-none"
        style={{ mixBlendMode: "multiply" }}
      />

      {/* ✅ TAMBAHAN: OVERLAY WARNA */}
      <div className="absolute inset-0 bg-purple-900/25 pointer-events-none" />

      {/* ✅ OVERLAY LOADING (smooth) */}
      <AnimatePresence>
        {(loading || isRedirecting) && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            {/* backdrop */}
            <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" />

            {/* content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-[280px] rounded-2xl bg-white p-6 shadow-xl text-center"
            >
              <div className="mx-auto mb-3 h-10 w-10 rounded-full border-4 border-gray-200 border-t-green-600 animate-spin" />
              <p className="font-semibold text-gray-800">
                {isRedirecting
                  ? "Berhasil! Mengalihkan..."
                  : "Sedang mendaftar..."}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Mohon tunggu sebentar ya
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 bg-white w-full max-w-md rounded-3xl shadow-xl p-10 text-center"
      >
        <motion.img
          src={Logo}
          className="w-32 mx-auto mb-4"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        />

        <h2 className="text-2xl font-bold text-green-600">Ayooo Bergabung!</h2>
        <p className="text-gray-600 text-sm mb-6">
          Daftar dan mulailah belajar sampah!
        </p>

        {/* ✅ TAMBAHAN: inline error box */}
        {error && (
          <div className="mb-4 text-left rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* NAMA */}
        <div className="text-left mb-4">
          <label className="font-semibold text-sm">Nama</label>
          <input
            type="text"
            placeholder="Masukan nama kamu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading || isRedirecting}
            className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* USERNAME */}
        <div className="text-left mb-4">
          <label className="font-semibold text-sm">Email atau Username</label>
          <input
            type="text"
            placeholder="Masukan email atau username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading || isRedirecting}
            className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* PASSWORD */}
        <div className="text-left mb-6 relative">
          <label className="font-semibold text-sm">Password</label>
          <input
            type={showPass ? "text" : "password"}
            placeholder="Masukan Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || isRedirecting}
            className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400"
          />

          <span
            onClick={() =>
              !(loading || isRedirecting) && setShowPass(!showPass)
            }
            className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
          >
            {showPass ? "👁️" : "🙈"}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: loading || isRedirecting ? 1 : 1.05 }}
          whileTap={{ scale: loading || isRedirecting ? 1 : 0.95 }}
          onClick={handleRegister}
          disabled={loading || isRedirecting}
          className={`w-full text-white font-bold text-lg py-3 rounded-xl shadow-md ${
            loading || isRedirecting
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600"
          }`}
        >
          {loading ? "Mendaftarkan..." : "Daftar 🚀"}
        </motion.button>

        <p className="mt-4 text-sm text-gray-700">
          Sudah punya akun?{" "}
          <a href="/login" className="text-green-600 font-semibold">
            Login Disini
          </a>
        </p>
      </motion.div>
    </div>
  );
}
