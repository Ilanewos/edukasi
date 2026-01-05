import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";

const QuizStartPage = () => {
  const navigate = useNavigate();

  const startQuiz = async () => {
    try {
      const list = await api.get("/user/kuis/aktif");
      const kuis = list.data?.data?.[0];
      if (!kuis?.id) {
        alert("Belum ada kuis aktif. Minta admin buat kuis & soal dulu.");
        return;
      }

      const res = await api.post(`/user/kuis/mulai/${kuis.id}`);
      const sesiId = res.data?.sesi_id;
      const soal = res.data?.soal || [];

      if (!sesiId || soal.length === 0) {
        alert("Soal kuis belum tersedia.");
        return;
      }

      sessionStorage.setItem(
        "binclass_quiz_runtime",
        JSON.stringify({
          kuis_id: kuis.id,
          sesi_id: sesiId,
          soal,
        })
      );

      navigate("/quiz-question");
    } catch (e) {
      alert(e?.response?.data?.message || "Gagal memulai kuis");
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut", delay: 0.2 },
    },
  };

  const buttonVariants = {
    rest: { scale: 1, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
    hover: {
      scale: 1.05,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-purple-600 p-4 mt-16">
      <motion.div
        className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl max-w-lg w-full text-center"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-gray-800 flex items-center justify-center">
          SIAP MAIN KUIS? 🎮
        </h2>

        <div className="flex justify-around items-center my-8 text-6xl sm:text-8xl">
          <span>🗑️</span>
          <span>♻️</span>
          <span>🌍</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900 leading-tight">
          Kamu siap jadi ahli sampah?
        </h1>

        <div className="space-y-3 mb-10 text-lg text-gray-700">
          <p className="flex items-center justify-center">
            <span className="mr-3 text-xl">📝</span>
            <span className="font-semibold">10 soal menarik</span>
          </p>

          <p className="flex items-center justify-center">
            <span className="mr-3 text-xl">✅</span>
            <span className="font-semibold">Jawab semua dengan benar!</span>
          </p>

          <p className="flex items-center justify-center">
            <span className="mr-3 text-xl">🏆</span>
            <span className="font-semibold">Dapatkan bintang!</span>
          </p>
        </div>

        <motion.button
          className="w-full py-3 px-6 bg-green-500 text-white font-bold rounded-full text-xl 
                     transition duration-300 ease-in-out border-2 border-green-700
                     hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 
                     flex items-center justify-center"
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          onClick={startQuiz}
        >
          🎯 MULAI KUIS SEKARANG!
        </motion.button>
      </motion.div>
    </div>
  );
};

export default QuizStartPage;
