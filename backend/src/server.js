const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

let clients = [
  {
    id: 1,
    name: 'Sample Client',
    email: 'client@example.com',
    phone: '905-000-0000',
    businessName: 'Sample Business Ltd.',
    service: 'Personal Tax',
    status: 'Documents Needed',
    notes: 'Waiting for T4 and rent/property tax details.'
  }
];

let meetings = [
  {
    id: 1,
    clientName: 'Sample Client',
    date: '2026-06-25',
    time: '18:00',
    type: 'Tax Consultation',
    status: 'Booked',
    channel: 'Phone Call'
  }
];

let documents = [
  { id: 1, clientName: 'Sample Client', title: 'T4 Slip', category: 'Personal Tax', status: 'Requested' },
  { id: 2, clientName: 'Sample Client', title: 'Bank Statements', category: 'Bookkeeping', status: 'Received' }
];

const forms = [
  {
    id: 1,
    title: 'Personal Tax Intake Form',
    category: 'T1',
    description: 'Employment slips, tuition, rent/property tax, dependants, RRSP, medical, donations.'
  },
  {
    id: 2,
    title: 'Corporate Tax Checklist',
    category: 'T2',
    description: 'Trial balance, bank statements, invoices, payroll, asset additions, loans, year-end details.'
  },
  {
    id: 3,
    title: 'GST/HST Filing Checklist',
    category: 'GST/HST',
    description: 'Sales, expenses, ITC support, bank statements, top invoices, CRA correspondence.'
  },
  {
    id: 4,
    title: 'Payroll Setup Form',
    category: 'Payroll',
    description: 'Employee details, SIN, TD1 forms, pay rate, pay frequency, vacation policy.'
  }
];

const messageTemplates = {
  appointment: ({ clientName }) =>
    `Hello ${clientName}, thank you for contacting us. Please share your preferred date and time for a meeting. We will confirm the appointment shortly.`,
  documents: ({ clientName, service }) =>
    `Hello ${clientName}, for your ${service} file, please upload/send the required documents and forms. Once received, we will review and update you on the next step.`,
  reminder: ({ clientName }) =>
    `Hello ${clientName}, this is a friendly reminder about your upcoming meeting. Please keep your documents ready and let us know if you need to reschedule.`,
  status: ({ clientName }) =>
    `Hello ${clientName}, your file is currently under review. We will contact you if any additional information is required.`
};

app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'SchedulerAI' }));

app.get('/api/dashboard', (req, res) => {
  res.json({
    totalClients: clients.length,
    bookedMeetings: meetings.filter(m => m.status === 'Booked').length,
    pendingDocuments: documents.filter(d => d.status !== 'Received').length,
    availableForms: forms.length
  });
});

app.get('/api/clients', (req, res) => res.json(clients));
app.post('/api/clients', (req, res) => {
  const client = { id: Date.now(), status: 'New', notes: '', ...req.body };
  clients.unshift(client);
  res.status(201).json(client);
});

app.get('/api/meetings', (req, res) => res.json(meetings));
app.post('/api/meetings', (req, res) => {
  const meeting = { id: Date.now(), status: 'Booked', channel: 'Phone Call', ...req.body };
  meetings.unshift(meeting);
  res.status(201).json(meeting);
});

app.get('/api/documents', (req, res) => res.json(documents));
app.post('/api/documents', (req, res) => {
  const document = { id: Date.now(), status: 'Requested', ...req.body };
  documents.unshift(document);
  res.status(201).json(document);
});

app.get('/api/forms', (req, res) => res.json(forms));

app.post('/api/messages/generate', (req, res) => {
  const {
    clientName = 'Client',
    service = 'accounting/tax service',
    purpose = 'documents',
    customNote = ''
  } = req.body;

  const template = messageTemplates[purpose] || messageTemplates.documents;
  const message = `${template({ clientName, service })}${customNote ? `\n\nNote: ${customNote}` : ''}\n\nThank you,\nKPK Accounting Services`;
  res.json({ purpose, message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`SchedulerAI backend running on port ${PORT}`));
