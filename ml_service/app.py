from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from keras.models import model_from_json
import numpy as np
import json
from PIL import Image
import io

from utils.image_preprocessing import preprocess_image

app = FastAPI(title="ML Scan Sampah API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("model/config.json", "r") as f:
    model = model_from_json(f.read())

model.load_weights("model/model.weights.h5")

with open("model/labels.json", "r") as f:
    CLASS_NAMES = json.load(f)  # harus 2 item: ["organik","recycle"]

with open("model/metadata.json", "r") as f:
    metadata = json.load(f)

@app.get("/")
def health_check():
    return {
        "status": "OK",
        "model_loaded": True,
        "keras_version": metadata.get("keras_version"),
        "num_classes": len(CLASS_NAMES),
        "mode": "binary_sigmoid"
    }

@app.post("/predict")
async def predict(
    file: Optional[UploadFile] = File(None),
    image: Optional[UploadFile] = File(None),
):
    try:
        upload = file or image
        if not upload:
            return {"success": False, "error": "File gambar tidak ditemukan. Gunakan field 'file' atau 'image'."}

        if not upload.content_type or not upload.content_type.startswith("image/"):
            return {"success": False, "error": "File harus berupa gambar (jpg, png, webp, dll)"}

        image_bytes = await upload.read()
        image_pil = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        x = preprocess_image(image_pil)

        # preds shape biasanya (1, 1) karena sigmoid binary
        preds = model.predict(x, verbose=0)
        p = float(preds[0][0])  # probabilitas kelas positif (CLASS_NAMES[1])

        # Prediksi label berdasar threshold
        if p >= 0.5:
            label = CLASS_NAMES[1]  # "recycle"
            conf = p
            class_index = 1
        else:
            label = CLASS_NAMES[0]  # "organik"
            conf = 1.0 - p
            class_index = 0

        return {
            "success": True,
            "class_index": class_index,
            "label": label,
            "confidence": round(conf, 4)
        }

    except Exception as e:
        return {"success": False, "error": str(e)}