from flask import Flask, request, jsonify, Response, send_file
from flask_cors import CORS
import uuid, datetime, os, json, time, urllib.parse, urllib.request
from services.recognition import detect_face_embedding, match_embedding

app = Flask(__name__)
# Restrict CORS to local dev frontend origins
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "data", "db.json")
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)

if not os.path.exists(DB_PATH):
    with open(DB_PATH, "w") as f:
        json.dump({
            "users": [],
            "providers": [],
            "services": [],
            "bookings": [],
            "reviews": [],
            "transactions": [],
            "face_embeddings": [],
            "attendances": []
        }, f, indent=2)

def read_db():
    with open(DB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def write_db(data):
    with open(DB_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# Rate limiting
RATE = {}
WINDOW_SECONDS = 60
MAX_REQ = 100

@app.before_request
def rate_limit():
    path = request.path or ''
    if not path.startswith('/api/'):
        return
    ip = request.headers.get('X-Forwarded-For', request.remote_addr) or 'anon'
    now = int(time.time())
    bucket = RATE.get(ip)
    if not bucket or now - bucket['ts'] >= WINDOW_SECONDS:
        RATE[ip] = {'ts': now, 'count': 1}
        return
    bucket['count'] += 1
    if bucket['count'] > MAX_REQ:
        return jsonify({"error": "rate_limited", "retry_after_sec": max(0, WINDOW_SECONDS - (now - bucket['ts']))}), 429

@app.route("/")
def health():
    return {"status": "ok", "time": datetime.datetime.utcnow().isoformat()}

@app.route("/api/ping")
def ping():
    return jsonify({"status": "ok", "time": datetime.utcnow().isoformat() + "Z"})

# Auth endpoints
@app.route("/api/auth/signup", methods=["POST"])
def signup():
    db = read_db()
    payload = request.json or {}
    user = {
        "id": str(uuid.uuid4()),
        "name": payload.get("name"),
        "email": payload.get("email"),
        "phone": payload.get("phone"),
        "role": payload.get("role", "user"),
        "createdAt": datetime.datetime.utcnow().isoformat()
    }
    db["users"].append(user)
    write_db(db)
    return jsonify({"user": user})

@app.route("/api/auth/login", methods=["POST"])
def login():
    db = read_db()
    payload = request.json or {}
    email = payload.get("email")
    password = payload.get("password")  # In production, verify password hash
    
    # Find user by email (demo - no password verification)
    users = db.get("users", [])
    user = next((u for u in users if u.get("email") == email), None)
    
    if user:
        return jsonify({
            "user": user,
            "token": f"demo_token_{user['id']}"  # Demo token
        })
    else:
        return jsonify({"error": "Invalid credentials"}), 401

# Service endpoints
@app.route("/api/services", methods=["GET"])
def get_services():
    db = read_db()
    q = request.args.get("q", "").lower()
    cat = request.args.get("category")
    provider_id = request.args.get("provider_id")
    services = db.get("services", [])
    
    if q:
        services = [s for s in services if q in s.get("title", "").lower() or q in s.get("description", "").lower()]
    if cat:
        services = [s for s in services if s.get("category") == cat]
    if provider_id:
        services = [s for s in services if s.get("provider_id") == provider_id]
    
    return jsonify(services)

# Provider endpoints
@app.route("/api/providers", methods=["GET"])
def get_providers():
    db = read_db()
    category = request.args.get("category")
    verified = request.args.get("verified")
    providers = db.get("providers", [])
    
    if category:
        providers = [p for p in providers if category in p.get("categories", [])]
    if verified is not None:
        v = verified.lower() in ("1", "true", "yes")
        providers = [p for p in providers if p.get("verified") == v]
    
    return jsonify(providers)

# Booking endpoints
@app.route("/api/bookings", methods=["POST"])
def create_booking():
    payload = request.json or {}
    required = ["user_id", "provider_id", "service_id", "datetime", "address"]
    
    if not all(k in payload for k in required):
        return jsonify({"error": "missing fields", "required": required}), 400
    
    # Validate datetime is in the future
    try:
        booking_datetime = datetime.datetime.fromisoformat(payload["datetime"].replace('Z', '+00:00'))
        if booking_datetime <= datetime.datetime.now():
            return jsonify({"error": "booking datetime must be in the future"}), 400
    except ValueError:
        return jsonify({"error": "invalid datetime format"}), 400
    
    db = read_db()
    
    # Get service details for pricing
    service = next((s for s in db.get("services", []) if s.get("id") == payload["service_id"]), None)
    if not service:
        return jsonify({"error": "service not found"}), 404
    
    booking = {
        "id": str(uuid.uuid4()),
        "user_id": payload["user_id"],
        "provider_id": payload["provider_id"],
        "service_id": payload["service_id"],
        "datetime": payload["datetime"],
        "address": payload["address"],
        "notes": payload.get("notes", ""),
        "status": "pending",
        "payment_status": "unpaid",
        "amount": service.get("price", 999),
        "currency": service.get("currency", "INR"),
        "service_title": service.get("title", "Unknown Service"),
        "service_category": service.get("category", "General"),
        "created_at": datetime.datetime.utcnow().isoformat() + "Z",
        "updated_at": datetime.datetime.utcnow().isoformat() + "Z"
    }
    
    db.setdefault("bookings", []).append(booking)
    write_db(db)
    
    return jsonify({
        "success": True,
        "booking": booking
    }), 201

@app.route("/api/bookings/<booking_id>/track", methods=["GET"])
def booking_track(booking_id):
    # Mock tracking data
    return jsonify({
        "booking_id": booking_id,
        "status": "confirmed",
        "provider_location": {"lat": 28.6139, "lng": 77.2090},
        "estimated_arrival": "30 minutes",
        "provider_name": "Service Provider",
        "provider_phone": "+91-9876543210"
    })

# Payment endpoints
@app.route("/api/payments/create", methods=["POST"])
def payments_create():
    payload = request.json or {}
    payment = {
        "payment_id": str(uuid.uuid4()),
        "booking_id": payload.get("booking_id"),
        "amount": payload.get("amount", 0),
        "currency": payload.get("currency", "INR"),
        "status": "created",
        "payment_url": f"https://demo-payment.example.com/pay/{str(uuid.uuid4())}",
        "created_at": datetime.datetime.utcnow().isoformat() + "Z"
    }
    return jsonify(payment)

# Review endpoints
@app.route("/api/reviews", methods=["POST"])
def post_review():
    db = read_db()
    payload = request.json or {}
    review = {
        "id": str(uuid.uuid4()),
        "booking_id": payload.get("booking_id"),
        "rating": payload.get("rating"),
        "comment": payload.get("comment"),
        "created_at": datetime.datetime.utcnow().isoformat() + "Z"
    }
    db["reviews"].append(review)
    write_db(db)
    return jsonify({"review": review})

# AI Recommendation
@app.route("/api/ai/recommend", methods=["POST"])
def ai_recommend():
    db = read_db()
    payload = request.json or {}
    text = (payload.get("text") or "").lower()

    keywords = {
        "plumber": ["leak", "pipe", "tap", "drain", "water"],
        "electrician": ["light", "fan", "wiring", "switch", "mcb", "short"],
        "cleaning": ["clean", "sofa", "bathroom", "kitchen", "dust"],
        "tutor": ["tutor", "math", "physics", "exam", "study"],
        "mechanic": ["car", "bike", "engine", "puncture", "brake"],
        "appliance repair": ["geyser", "microwave", "ro", "dishwasher", "appliance"],
        "ac repair": ["ac", "air conditioner", "cooling", "gas"]
    }

    score = {}
    for cat, words in keywords.items():
        score[cat] = sum(1 for w in words if w in text)

    ranked = sorted(score.items(), key=lambda x: x[1], reverse=True)
    top_categories = [c[0].title() for c in ranked if c[1] > 0][:3] or ["Plumber", "Electrician", "Cleaning"]

    providers = db.get("providers", [])
    def prov_match(p):
        pcats = [x.lower() for x in p.get("categories", [])]
        return any(tc.lower() in pcats for tc in top_categories)

    matched = [p for p in providers if prov_match(p)]
    matched.sort(key=lambda p: p.get("rating", 0), reverse=True)
    top_providers = [
        {
            "id": p.get("id"),
            "name": f"Provider {p.get('id')}",
            "rating": p.get("rating"),
            "categories": p.get("categories", []),
            "reason": f"High rating in {', '.join(p.get('categories', []))}"
        }
        for p in matched[:3]
    ]

    reason = "Recommendations are based on keyword match and provider ratings (mock logic)."
    return jsonify({
        "categories": top_categories,
        "providers": top_providers,
        "reason": reason
    })

# Face recognition endpoints
@app.route("/api/face/detect", methods=["POST"])
def face_detect():
    if 'file' in request.files:
        f = request.files['file']
        content = f.read()
        emb = detect_face_embedding(content)
        return jsonify({"embedding": emb.tolist() if emb is not None else None})
    data = request.json or {}
    image_b64 = data.get("image_base64")
    if image_b64:
        emb = detect_face_embedding(image_b64)
        return jsonify({"embedding": emb.tolist() if emb is not None else None})
    return jsonify({"error": "no image provided"}), 400

@app.route("/api/face/match", methods=["POST"])
def face_match():
    payload = request.json or {}
    target_emb = payload.get("embedding")
    if target_emb is None:
        return jsonify({"error": "embedding required"}), 400
    db = read_db()
    stored = db.get("face_embeddings", [])
    result = match_embedding(target_emb, stored)
    return jsonify({"match": result})

# Attendance endpoint
@app.route("/api/attendance/mark", methods=["POST"])
def mark_attendance():
    payload = request.json or {}
    user_id = payload.get("user_id")
    booking_id = payload.get("booking_id")
    method = payload.get("method", "face")
    
    db = read_db()
    record = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "booking_id": booking_id,
        "method": method,
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    }
    db.setdefault("attendances", []).append(record)
    write_db(db)
    return jsonify({"ok": True, "record": record})

# Image proxy
@app.route("/api/proxy")
def proxy_image():
    url = request.args.get('url', '')
    if not url:
        return jsonify({"error": "missing_url"}), 400
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme not in ("http", "https"):
        return jsonify({"error": "invalid_scheme"}), 400
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as r:
            data = r.read()
            ctype = r.headers.get('Content-Type', 'application/octet-stream')
            return Response(data, headers={"Content-Type": ctype, "Cache-Control": "public, max-age=86400"})
    except Exception as e:
        return jsonify({"error": "fetch_failed", "detail": str(e)}), 502

# Asset serving
@app.route("/assets/splash-image")
def serve_splash():
    local_path = "/mnt/data/17558d95-fedd-431e-9ad8-6c0424a8c4b4.png"
    if os.path.exists(local_path):
        return send_file(local_path, mimetype="image/png")
    return jsonify({"error": "asset not found"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
