import numpy as np
from PIL import Image

def preprocess_image(image: Image.Image, target_size=(224, 224)):
    # Model kamu sudah punya normalisasi internal (x/127.5 - 1)
    # Jadi di sini cukup resize + float32, TANPA /255
    image = image.convert("RGB").resize(target_size)

    x = np.asarray(image).astype("float32")  # range 0..255
    x = np.expand_dims(x, axis=0)            # (1, 224, 224, 3)
    return x