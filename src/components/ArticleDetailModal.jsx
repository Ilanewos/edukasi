import { motion } from "framer-motion";

export default function ArticleDetailModal({ article, onClose }) {
  if (!article) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* HEADER */}
        <div className="bg-green-500 text-white text-center p-8 rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-red-500 w-9 h-9 rounded-full font-bold"
          >
            ✕
          </button>

          <div className="text-5xl mb-3">♻️</div>
          <h2 className="text-3xl font-extrabold">{article.title}</h2>

          <span className="inline-block mt-3 bg-white text-green-600 px-4 py-1 rounded-full text-sm font-bold">
            {article.tag}
          </span>
        </div>

        {/* ISI */}
        <div className="p-8 space-y-6 text-gray-700">
          <p className="text-lg">{article.content}</p>

          <div>
            <h3 className="text-xl font-bold text-green-600 mb-2">
              Contoh Sampah
            </h3>
            <ul className="space-y-2">
              {article.examples.map((item, i) => (
                <li key={i}>✅ {item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-green-600 mb-2">Manfaat</h3>
            <ul className="space-y-2">
              {article.benefits.map((item, i) => (
                <li key={i}>🌱 {item}</li>
              ))}
            </ul>
          </div>

          {/* YOUTUBE */}
          {article.youtubeId && (
            <div>
              <h3 className="text-xl font-bold text-green-600 mb-3">
                🎥 Video Edukasi
              </h3>
              <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${article.youtubeId}`}
                  allowFullScreen
                  title="Video Edukasi"
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
