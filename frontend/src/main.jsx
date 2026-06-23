import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const API = 'http://localhost:4000/api';

const emptyClient = { name: '', email: '', phone: '', businessName: '', service: 'Personal Tax', notes: '' };
const emptyMeeting = { clientName: '', date: '', time: '', type: 'Tax Consultation', channel: 'Phone Call' };
const emptyDocument = { clientName: '', title: '', category: 'Personal Tax', status: 'Requested' };

function StatCard({ label, value }) {
  return <div className="stat"><span>{label}</span><strong>{value}</strong></div>;
}

function App() {
  const [dashboard, setDashboard] = useState({});
  const [clients, setClients] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [forms, setForms] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [client, setClient] = useState(emptyClient);
  const [meeting, setMeeting] = useState(emptyMeeting);
  const [documentItem, setDocumentItem] = useState(emptyDocument);
  const [messageInput, setMessageInput] = useState({ clientName: '', service: 'Personal Tax', purpose: 'documents', customNote: '' });
  const [message, setMessage] = useState('');

  async function loadData() {
    const [d, c, m, f, docs] = await Promise.all([
      fetch(`${API}/dashboard`).then(r => r.json()),
      fetch(`${API}/clients`).then(r => r.json()),
      fetch(`${API}/meetings`).then(r => r.json()),
      fetch(`${API}/forms`).then(r => r.json()),
      fetch(`${API}/documents`).then(r => r.json())
    ]);
    setDashboard(d); setClients(c); setMeetings(m); setForms(f); setDocuments(docs);
  }

  useEffect(() => { loadData(); }, []);

  async function postData(path, body, onSuccess) {
    const res = await fetch(`${API}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const created = await res.json();
    onSuccess(created);
    fetch(`${API}/dashboard`).then(r => r.json()).then(setDashboard);
  }

  function addClient(e) {
    e.preventDefault();
    postData('/clients', client, created => {
      setClients([created, ...clients]);
      setClient(emptyClient);
    });
  }

  function bookMeeting(e) {
    e.preventDefault();
    postData('/meetings', meeting, created => {
      setMeetings([created, ...meetings]);
      setMeeting(emptyMeeting);
    });
  }

  function requestDocument(e) {
    e.preventDefault();
    postData('/documents', documentItem, created => {
      setDocuments([created, ...documents]);
      setDocumentItem(emptyDocument);
    });
  }

  async function generateMessage(e) {
    e.preventDefault();
    const res = await fetch(`${API}/messages/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageInput)
    });
    const data = await res.json();
    setMessage(data.message);
  }

  return <main>
    <header className="hero">
      <div>
        <p className="eyebrow">KPK Accounting Services</p>
        <h1>SchedulerAI Client Hub</h1>
        <p>Small accounting firm portal for meetings, client follow-ups, AI messages, forms, and document tracking.</p>
      </div>
    </header>

    <section className="stats">
      <StatCard label="Clients" value={dashboard.totalClients ?? 0} />
      <StatCard label="Booked Meetings" value={dashboard.bookedMeetings ?? 0} />
      <StatCard label="Pending Docs" value={dashboard.pendingDocuments ?? 0} />
      <StatCard label="Forms" value={dashboard.availableForms ?? 0} />
    </section>

    <section className="grid two">
      <div className="card">
        <h2>Add Client</h2>
        <form onSubmit={addClient}>
          <input placeholder="Client name" value={client.name} onChange={e => setClient({ ...client, name: e.target.value })} required />
          <input placeholder="Email" value={client.email} onChange={e => setClient({ ...client, email: e.target.value })} />
          <input placeholder="Phone" value={client.phone} onChange={e => setClient({ ...client, phone: e.target.value })} />
          <input placeholder="Business name" value={client.businessName} onChange={e => setClient({ ...client, businessName: e.target.value })} />
          <select value={client.service} onChange={e => setClient({ ...client, service: e.target.value })}>
            <option>Personal Tax</option><option>Corporate Tax</option><option>Bookkeeping</option><option>GST/HST Filing</option><option>Payroll</option>
          </select>
          <textarea placeholder="Notes" value={client.notes} onChange={e => setClient({ ...client, notes: e.target.value })} />
          <button>Add Client</button>
        </form>
      </div>

      <div className="card">
        <h2>Book Meeting</h2>
        <form onSubmit={bookMeeting}>
          <input placeholder="Client name" value={meeting.clientName} onChange={e => setMeeting({ ...meeting, clientName: e.target.value })} required />
          <input type="date" value={meeting.date} onChange={e => setMeeting({ ...meeting, date: e.target.value })} required />
          <input type="time" value={meeting.time} onChange={e => setMeeting({ ...meeting, time: e.target.value })} required />
          <select value={meeting.type} onChange={e => setMeeting({ ...meeting, type: e.target.value })}>
            <option>Tax Consultation</option><option>Bookkeeping Review</option><option>Corporate Tax</option><option>GST/HST Filing</option><option>Payroll Review</option>
          </select>
          <select value={meeting.channel} onChange={e => setMeeting({ ...meeting, channel: e.target.value })}>
            <option>Phone Call</option><option>Office Visit</option><option>Google Meet</option><option>Zoom</option>
          </select>
          <button>Schedule Meeting</button>
        </form>
      </div>
    </section>

    <section className="grid two">
      <div className="card">
        <h2>AI Client Message</h2>
        <form onSubmit={generateMessage}>
          <input placeholder="Client name" value={messageInput.clientName} onChange={e => setMessageInput({ ...messageInput, clientName: e.target.value })} />
          <select value={messageInput.service} onChange={e => setMessageInput({ ...messageInput, service: e.target.value })}>
            <option>Personal Tax</option><option>Corporate Tax</option><option>Bookkeeping</option><option>GST/HST Filing</option><option>Payroll</option>
          </select>
          <select value={messageInput.purpose} onChange={e => setMessageInput({ ...messageInput, purpose: e.target.value })}>
            <option value="documents">Document Request</option><option value="appointment">Appointment</option><option value="reminder">Reminder</option><option value="status">Status Update</option>
          </select>
          <textarea placeholder="Optional custom note" value={messageInput.customNote} onChange={e => setMessageInput({ ...messageInput, customNote: e.target.value })} />
          <button>Generate Message</button>
        </form>
        {message && <textarea className="messageBox" value={message} onChange={e => setMessage(e.target.value)} rows="8" />}
      </div>

      <div className="card">
        <h2>Request / Track Documents</h2>
        <form onSubmit={requestDocument}>
          <input placeholder="Client name" value={documentItem.clientName} onChange={e => setDocumentItem({ ...documentItem, clientName: e.target.value })} required />
          <input placeholder="Document title e.g. T4, bank statement" value={documentItem.title} onChange={e => setDocumentItem({ ...documentItem, title: e.target.value })} required />
          <select value={documentItem.category} onChange={e => setDocumentItem({ ...documentItem, category: e.target.value })}>
            <option>Personal Tax</option><option>Corporate Tax</option><option>Bookkeeping</option><option>GST/HST</option><option>Payroll</option>
          </select>
          <select value={documentItem.status} onChange={e => setDocumentItem({ ...documentItem, status: e.target.value })}>
            <option>Requested</option><option>Received</option><option>Missing</option><option>Reviewed</option>
          </select>
          <button>Add Document</button>
        </form>
      </div>
    </section>

    <section className="grid three">
      <div className="card list">
        <h2>Clients</h2>
        {clients.map(c => <article key={c.id}><b>{c.name}</b><span>{c.service} · {c.status}</span><small>{c.phone} {c.email}</small></article>)}
      </div>
      <div className="card list">
        <h2>Meetings</h2>
        {meetings.map(m => <article key={m.id}><b>{m.clientName}</b><span>{m.date} at {m.time}</span><small>{m.type} · {m.channel} · {m.status}</small></article>)}
      </div>
      <div className="card list">
        <h2>Forms</h2>
        {forms.map(f => <article key={f.id}><b>{f.title}</b><span>{f.category}</span><small>{f.description}</small></article>)}
      </div>
    </section>

    <section className="card list">
      <h2>Documents</h2>
      {documents.map(d => <article key={d.id}><b>{d.title}</b><span>{d.clientName} · {d.category}</span><small>Status: {d.status}</small></article>)}
    </section>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
