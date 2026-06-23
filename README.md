# SchedulerAI

Small AI-powered scheduling and client document portal for an accounting firm.

## Features
- Book client meetings
- AI-assisted client messaging templates
- Client intake forms and document checklist
- Upload/send document requests
- Simple staff dashboard

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: starter in-memory storage, ready to replace with PostgreSQL/Supabase

## Run locally

### Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:4000`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

## Main API Endpoints
- `GET /api/health`
- `GET /api/meetings`
- `POST /api/meetings`
- `GET /api/clients`
- `POST /api/clients`
- `GET /api/forms`
- `POST /api/messages/generate`

## Next Steps
- Add login/authentication
- Connect Google Calendar
- Add secure file storage
- Add email/SMS/WhatsApp sending
- Add database
