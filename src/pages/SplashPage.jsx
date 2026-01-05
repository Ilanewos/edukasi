import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem("binclass_auth");
        const auth = raw ? JSON.parse(raw) : null;

        const token = auth?.accessToken;
        const role = auth?.role;

        if (token) {
          navigate(role === "admin" ? "/admin" : "/home", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      } catch (err) {
        navigate("/login", { replace: true });
      }
    }, 3000); // ⏳ splash duration (3 detik)

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-500 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-2xl p-10 text-center"
      >
        <motion.img
          src={Logo}
          alt="BINCLASS"
          className="w-28 mx-auto mb-4"
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        />

        <h1 className="text-2xl font-extrabold text-green-700">BINCLASS</h1>

        <p className="text-gray-600 mt-2">Tunggu Sebentar yaa 😊</p>

        <div className="mt-6 flex justify-center">
          <div className="h-8 w-8 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin" />
        </div>
      </motion.div>
    </div>
  );
}
