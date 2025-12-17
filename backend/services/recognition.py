import numpy as np

# Try to import face_recognition library; if not present — fallback to dummy
try:
    import face_recognition
    REAL = True
except Exception:
    REAL = False

def detect_face_embedding(image_content):
    """
    image_content: bytes or base64 string
    returns: 1D numpy array embedding (128 dims) or None
    """
    if REAL:
        # if bytes: convert to numpy array -> image
        if isinstance(image_content, bytes):
            import io
            from PIL import Image
            img = Image.open(io.BytesIO(image_content)).convert("RGB")
            arr = np.array(img)
        else:
            # assume base64 string
            import base64, io
            from PIL import Image
            b = base64.b64decode(image_content)
            img = Image.open(io.BytesIO(b)).convert("RGB")
            arr = np.array(img)
        locations = face_recognition.face_locations(arr)
        if not locations:
            return None
        encodings = face_recognition.face_encodings(arr, known_face_locations=locations)
        if encodings:
            return np.array(encodings[0])
        return None
    else:
        # stub: return deterministic fake embedding from hash
        import hashlib
        if isinstance(image_content, bytes):
            h = hashlib.sha256(image_content).digest()
        else:
            h = hashlib.sha256(str(image_content).encode("utf-8")).digest()
        arr = np.frombuffer(h, dtype=np.uint8).astype(np.float32)
        # map to length 128
        emb = np.resize(arr, 128).astype(np.float32)
        # normalize
        norm = np.linalg.norm(emb)
        if norm > 0:
            emb = emb / norm
        return emb

def match_embedding(target_emb, stored):
    """
    target_emb: list/array
    stored: list of {"user_id": "...", "embedding": [..], "meta": {...}}
    returns: best match or None
    """
    import numpy as np
    if target_emb is None:
        return None
    t = np.array(target_emb, dtype=np.float32)
    best = None
    best_score = 1e9
    for item in stored:
        emb = np.array(item.get("embedding", []), dtype=np.float32)
        if emb.size == 0:
            continue
        # euclidean distance
        dist = np.linalg.norm(t - emb)
        if dist < best_score:
            best_score = dist
            best = item
    # threshold (tuneable)
    THRESHOLD = 0.6 if REAL else 0.8
    if best and best_score <= THRESHOLD:
        return {"user_id": best.get("user_id"), "score": float(best_score)}
    return None
