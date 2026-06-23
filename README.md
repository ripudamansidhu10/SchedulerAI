# SchedulerAI Client Hub

SchedulerAI is a small accounting-firm web app starter for scheduling client meetings, creating AI-style client messages, tracking required documents, and organizing client intake forms.

## Features

- Client CRM for names, contact details, business name, service type, notes, and status
- Meeting scheduler for phone calls, office visits, Google Meet, or Zoom
- AI message generator for document requests, appointment messages, reminders, and file status updates
- Document request/status tracker
- Accounting forms/checklists for T1, T2, GST/HST, and payroll
- Dashboard stats for clients, meetings, pending documents, and forms

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: currently in-memory demo data; ready to upgrade to PostgreSQL/Firebase/Supabase

## Run Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on `http://localhost:4000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on the Vite local URL, usually `http://localhost:5173`.

## Next Production Steps

1. Add authentication for firm staff and clients.
2. Replace in-memory arrays with a database.
3. Add secure document upload storage.
4. Connect Google Calendar for real appointment booking.
5. Connect email/SMS reminders using SendGrid/Twilio.
6. Add OpenAI API for stronger message generation.
7. Add client portal login for document uploads and forms.
