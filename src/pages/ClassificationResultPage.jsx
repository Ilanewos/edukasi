import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

export default function ClassificationResultPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ AMBIL HASIL ML
  const { imagePreview, result } = location.state || {};

  console.log("LOCATION STATE:", location.state);

  return (
    <div className="min-h-screen bg-purple-600 pt-24 p-6 flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* FOTO */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl text-center"
        >
          <h2 className="text-3xl font-extrabold text-green-700 mb-4">
            Foto Sampah 📸
          </h2>

          {imagePreview ? (
            <img
              src={imagePreview}
              alt="preview"
              className="rounded-xl shadow-md w-full"
            />
          ) : (
            <p className="text-gray-600">Tidak ada foto.</p>
          )}

          <button
            onClick={() => navigate("/klasifikasi")}
            className="mt-6 bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-500"
          >
            Ulang Foto
          </button>
        </motion.div>

        {/* HASIL */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl"
        >
          <h2 className="text-3xl font-extrabold mb-4 text-gray-800">
            Hasil Klasifikasi
          </h2>

          <p className="text-lg font-semibold text-gray-600 mb-2">
            Jenis Sampah:
          </p>

          {/* ✅ LABEL DARI ML */}
          <p className="text-3xl font-extrabold mb-2 text-green-600">
            {result?.label || "Tidak Ada Data"}
          </p>

          {/* ✅ CONFIDENCE */}
          <p className="text-sm text-gray-500 mb-6">
            Confidence:{" "}
            {result?.confidence ? (result.confidence * 100).toFixed(2) : "0"}%
          </p>

          <p className="text-lg font-semibold mb-2">Saran Pengolahan:</p>

          {/* ✅ INFO DARI ML */}
          <div className="text-gray-700 leading-relaxed space-y-3">
            <p>{result?.info || "Tidak ada saran pengolahan."}</p>
          </div>

          <button
            onClick={() => navigate("/home")}
            className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700"
          >
            Kembali ke Home
          </button>
        </motion.div>
      </div>
    </div>
  );
}
