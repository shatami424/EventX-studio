import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import Layout from '../components/Layout';
import EventForm from '../components/EventForm';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';

export default function Events({ userView }) {
  return (
    <Layout><EventsInner userView={userView} /></Layout>
  );
}

function EventsInner({ userView }) {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    setErr('');
    return client
      .get('/api/events', { params: { q } })
      .then(({ data }) => setItems(data.events))
      .catch((e) => setErr(e.response?.data?.message || 'Failed'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []); // initial

  const filtered = useMemo(() => items, [items]);

  // Map frontend form fields to backend event fields
  const mapPayload = (payload) => ({
    title: payload.title,
    description: payload.description,
    date: payload.date,
    venue: payload.location,
    totalSeats: Number(payload.capacity),
    price: Number(payload.price) || 0,
    tags: payload.tags || [],
    coverImage: payload.coverImage || '',
    isActive: true
  });

  const onCreate = async (payload) => {
    await client.post('/api/events', mapPayload(payload));
    setEditing(null);
    await load();
  };

  const onUpdate = async (id, payload) => {
    await client.put(`/api/events/${id}`, mapPayload(payload));
    setEditing(null);
    await load();
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    await client.delete(`/api/events/${id}`);
    await load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#2F3349]">Events</h1>
        {!userView && (
          <Button className="btn-primary" onClick={() => setEditing({})}>New Event</Button>
        )}
      </div>

      <Card className="p-4 mb-4">
        <div className="flex gap-2 items-center">
          <input className="border border-border rounded-lg p-2 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-primary"
                 placeholder="Search title…"
                 value={q} onChange={e=>setQ(e.target.value)} />
          <Button className="btn-outline" onClick={load}>Search</Button>
        </div>
      </Card>

      {err && <Card className="p-4 mb-2"><p className="text-danger">{err}</p></Card>}

      {loading && (
        <div className="grid gap-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="flex gap-2 pt-1">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && !err && (
        <Card className="p-10 text-center text-[#8592A3]">No events found</Card>
      )}

      {!loading && filtered.length > 0 && (
      <div className="grid gap-3">
        {filtered.map(ev => (
          <Card key={ev._id} className="p-4 flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg text-[#2F3349]">{ev.title}</h3>
              <p className="text-sm text-[#8592A3]">
                {new Date(ev.date).toLocaleString()} • {ev.venue}
              </p>
              <p className="text-sm text-[#8592A3]">Price: ${ev.price} • Seats: {ev.totalSeats}</p>
              <div className="mt-1 flex gap-2">
                {(ev.tags||[]).map(t => (
                  <Badge key={t} className="bg-gray-100 text-[#566A7F]">{t}</Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              {userView ? (
                <Link to={`/events/${ev._id}`} className="btn btn-outline">Details</Link>
              ) : (
                <>
                  <Button className="btn-outline" onClick={() => setEditing(ev)}>Edit</Button>
                  <Link to={`/admin/events/${ev._id}`} className="btn btn-outline">Details</Link>
                  <Button className="btn btn-outline text-danger border-danger" onClick={() => onDelete(ev._id)}>Delete</Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
      )}

      {!userView && editing !== null && (
        <EventForm
          initialData={editing._id ? editing : {}}
          onClose={() => setEditing(null)}
          onSubmit={(payload) => editing._id ? onUpdate(editing._id, payload) : onCreate(payload)}
        />
      )}
    </div>
  );
}
