import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import Logo from "../assets/logo.png";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-transparent pb-20 pt-28 overflow-hidden">
      {/* ✅ TAMBAHAN: OVERLAY GAMBAR */}
      <img
        src="/bgbinclas.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center opacity-35 pointer-events-none"
        style={{ mixBlendMode: "multiply" }}
      />

      {/* ✅ TAMBAHAN: OVERLAY WARNA */}
      <div className="absolute inset-0 bg-purple-900/25 pointer-events-none" />

      <div className="relative z-10">
        {/* HERO SECTION */}
        {/* NAVBAR */}
        <Navbar />

        <section className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-1 gap-8 px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0px 8px 25px rgba(34,197,94,0.4)",
            }}
            whileTap={{ scale: 0.97 }}
            className="bg-white rounded-3xl p-10 shadow-xl text-center cursor-pointer"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-green-700">
              🌍 Yuk Belajar Tentang Sampah! 🌱
            </h2>

            <p className="mt-6 text-gray-800 text-lg md:text-xl font-medium leading-relaxed">
              Halo teman-teman! Ayo belajar cara memilah sampah dengan benar.
              Dengan memisahkan sampah, kita bisa menjaga bumi tetap bersih dan
              sehat! 💚
            </p>
          </motion.div>
        </section>

        {/* CARD SECTION */}
        <section className="max-w-6xl mx-auto mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {/* CARD 1 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{
              scale: 1.08,
              boxShadow: "0px 8px 25px rgba(34,197,94,0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-2xl p-6 shadow-xl text-center cursor-pointer"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-5xl"
            >
              🎯
            </motion.div>

            <h3 className="mt-4 text-2xl font-extrabold text-green-700">
              Main Kuis
            </h3>
            <p className="mt-3 text-gray-700 font-medium">
              Uji pengetahuanmu tentang sampah dengan kuis yang seru dan
              menyenangkan!
            </p>
          </motion.div>

          {/* CARD 2 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{
              scale: 1.08,
              boxShadow: "0px 8px 25px rgba(34,197,94,0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-2xl p-6 shadow-xl text-center cursor-pointer"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-5xl"
            >
              📸
            </motion.div>

            <h3 className="mt-4 text-2xl font-extrabold text-green-700">
              Scan Sampah
            </h3>
            <p className="mt-3 text-gray-700 font-medium">
              Foto sampahmu lalu biarkan AI menentukan apakah sampah organik
              atau non-organik!
            </p>
          </motion.div>

          {/* CARD 3 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{
              scale: 1.08,
              boxShadow: "0px 8px 25px rgba(34,197,94,0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-2xl p-6 shadow-xl text-center cursor-pointer"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-5xl"
            >
              📖
            </motion.div>

            <h3 className="mt-4 text-2xl font-extrabold text-green-700">
              Baca Artikel
            </h3>
            <p className="mt-3 text-gray-700 font-medium">
              Pelajari lebih banyak tentang jenis-jenis sampah dan cara
              mengelolanya!
            </p>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
