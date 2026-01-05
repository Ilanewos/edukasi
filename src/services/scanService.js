import api from "./api";

export const scanSampah = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile); // ⚠️ HARUS "image"

  const res = await api.post("/scan", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // ✅ KUNCI UTAMA
  return res.data.data;
};
