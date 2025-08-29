import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../api/client";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [seat, setSeat] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    client.get(`/api/events/${id}`).then(res => setEvent(res.data.event));
  }, [id]);

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    setLoading(true);
    try {
      const res = await client.post("/api/tickets", { eventId: id, seatNumber: seat });
      setTicket(res.data);
    } catch (err) {
      alert("Booking failed: " + (err.response?.data?.message || "Unknown error"));
    }
    setLoading(false);
  };

  if (!event) return <p>Loading...</p>;

  // Helper: get available seats
  const availableSeats = event.seats ? event.seats.filter(s => !s.isBooked) : [];
  const allSeats = event.seats || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p>{new Date(event.date).toLocaleString()}</p>
      <p>Venue: {event.venue}</p>
      <p>Seats: {event.totalSeats}</p>
      <p className="font-semibold">Price: ${event.price}</p>

      <div className="flex gap-8 items-start">
        <div className="flex-1">
          {!ticket ? (
            <>
              <input
                type="text"
                placeholder="Enter seat number"
                className="border p-2 mt-3 rounded"
                value={seat}
                onChange={e => setSeat(e.target.value)}
              />
              <button
                onClick={handleBook}
                className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
                disabled={loading}
              >
                {loading ? "Booking..." : "Book Ticket"}
              </button>
            </>
          ) : (
            <div className="mt-6">
              <h2 className="text-lg font-bold">Your Ticket</h2>
              <p>Seat: {ticket.seatNumber}</p>
              <img src={ticket.qrCodeDataUrl} alt="QR Code" className="w-32 h-32 mt-2" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="bg-white shadow rounded-xl p-4">
            <h2 className="text-lg font-bold mb-2">Available Seats</h2>
            <div className="flex flex-wrap gap-2">
              {allSeats.map(s => (
                <span
                  key={s.number}
                  className={`px-3 py-1 rounded border text-sm ${s.isBooked ? 'bg-gray-300 text-gray-500 line-through' : 'bg-green-100 text-green-700'}`}
                >
                  {s.number}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">Booked seats are crossed out.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
