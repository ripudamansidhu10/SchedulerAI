import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const API = 'http://localhost:4000/api';

function App() {
  const [meetings, setMeetings] = useState([]);
  const [forms, setForms] = useState([]);
  const [message, setMessage] = useState('');
  const [meeting, setMeeting] = useState({ clientName: '', date: '', time: '', type: 'Tax Consultation' });

  useEffect(() => {
    fetch(`${API}/meetings`).then(r => r.json()).then(setMeetings);
    fetch(`${API}/forms`).then(r => r.json()).then(setForms);
  }, []);

  async function bookMeeting(e) {
    e.preventDefault();
    const res = await fetch(`${API}/meetings`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(meeting)
    });
    const created = await res.json();
    setMeetings([created, ...meetings]);
    setMeeting({ clientName: '', date: '', time: '', type: 'Tax Consultation' });
  }

  async function generateMessage() {
    const res = await fetch(`${API}/messages/generate`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientName: meeting.clientName || 'Client', purpose: 'meeting and document request' })
    });
    const data = await res.json();
    setMessage(data.message);
  }

  return <main>
    <header>
      <h1>SchedulerAI</h1>
      <p>AI scheduling and client document portal for accounting firms.</p>
    </header>

    <section className="card">
      <h2>Book Meeting</h2>
      <form onSubmit={bookMeeting}>
        <input placeholder="Client name" value={meeting.clientName} onChange={e => setMeeting({...meeting, clientName: e.target.value})} required />
        <input type="date" value={meeting.date} onChange={e => setMeeting({...meeting, date: e.target.value})} required />
        <input type="time" value={meeting.time} onChange={e => setMeeting({...meeting, time: e.target.value})} required />
        <select value={meeting.type} onChange={e => setMeeting({...meeting, type: e.target.value})}>
          <option>Tax Consultation</option><option>Bookkeeping Review</option><option>Corporate Tax</option><option>GST/HST Filing</option>
        </select>
        <button>Schedule</button>
      </form>
    </section>

    <section className="card">
      <h2>AI Client Message</h2>
      <button onClick={generateMessage}>Generate Message</button>
      {message && <textarea value={message} onChange={e => setMessage(e.target.value)} rows="5" />}
    </section>

    <section className="grid">
      <div className="card">
        <h2>Meetings</h2>
        {meetings.map(m => <p key={m.id}><b>{m.clientName}</b><br />{m.date} at {m.time}<br />{m.type} — {m.status}</p>)}
      </div>
      <div className="card">
        <h2>Forms & Checklists</h2>
        {forms.map(f => <p key={f.id}><b>{f.title}</b><br />{f.description}</p>)}
      </div>
    </section>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
