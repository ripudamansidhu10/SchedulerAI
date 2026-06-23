const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let clients = [
  { id: 1, name: 'Sample Client', email: 'client@example.com', phone: '905-000-0000', service: 'Personal Tax' }
];

let meetings = [
  { id: 1, clientName: 'Sample Client', date: '2026-06-25', time: '18:00', type: 'Tax Consultation', status: 'Booked' }
];

const forms = [
  { id: 1, title: 'Personal Tax Intake Form', description: 'Basic personal tax information checklist.' },
  { id: 2, title: 'Corporate Tax Checklist', description: 'Documents required for T2 and bookkeeping.' },
  { id: 3, title: 'GST/HST Filing Checklist', description: 'Sales, expenses, bank statements, and ITC support.' }
];

app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'SchedulerAI' }));
app.get('/api/clients', (req, res) => res.json(clients));
app.post('/api/clients', (req, res) => {
  const client = { id: Date.now(), ...req.body };
  clients.push(client);
  res.status(201).json(client);
});

app.get('/api/meetings', (req, res) => res.json(meetings));
app.post('/api/meetings', (req, res) => {
  const meeting = { id: Date.now(), status: 'Booked', ...req.body };
  meetings.push(meeting);
  res.status(201).json(meeting);
});

app.get('/api/forms', (req, res) => res.json(forms));

app.post('/api/messages/generate', (req, res) => {
  const { clientName = 'Client', purpose = 'appointment', tone = 'professional' } = req.body;
  const message = `Hello ${clientName}, thank you for contacting us. This message is regarding your ${purpose}. Please share the required documents/forms and let us know your preferred meeting time. We will review and get back to you shortly. Thank you.`;
  res.json({ tone, message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`SchedulerAI backend running on port ${PORT}`));
