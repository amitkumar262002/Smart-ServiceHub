# Smart ServiceHub (Prototype)

## Run locally
- Backend: Python 3.11+
```
cd backend
pip install -r requirements.txt
python app.py
```
Base URL: http://localhost:5000

Set frontend REACT_APP_API_BASE=http://localhost:5000

## Test curl
```
curl http://localhost:5000/
curl -X POST http://localhost:5000/api/auth/signup -H "Content-Type: application/json" -d '{"name":"Ankit","email":"a@b.com","phone":"9999999999"}'
curl "http://localhost:5000/api/services?q=plumb"
curl -X POST http://localhost:5000/api/bookings -H "Content-Type: application/json" -d '{"user_id":"u1","provider_id":"p1","service_id":"s1","datetime":"2025-11-20T10:00:00Z","address":"House 12, MG Road"}'
```

## Docker
```
docker compose up --build
```

## Notes
- Minimal Flask stubs in backend/app.py; data stored in backend/data/db.json
- Secrets for payments/AI must be set in backend env vars (not implemented yet). Never put secrets in frontend.
- Next steps: add /api/ai/recommend mock, auth (JWT+bcrypt), frontend scaffold (React), maps & payments integrations.

## Branding
Use the provided logo assets in `assets/` directory. Name: Smart ServiceHub.




<!-- cd "d:\Project 01\Project 01\backend"
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py -->

<!-- pip install Flask flask-cors
python app.py -->