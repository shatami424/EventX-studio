import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";

export default function Book() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/events/${eventId}`)
      .then(res => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [eventId]);

  const handleBook = async () => {
    try {
      await api.post(`/tickets/book/${eventId}`);
      alert("Ticket booked successfully!");
      navigate("/my-tickets");
    } catch (err) {
      alert("Booking failed.");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!event) return <p className="p-4">Event not found</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">{event.title}</h2>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      <p>Venue: {event.venue}</p>
      <p>Price: ${event.price}</p>
      <button
        onClick={handleBook}
        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-700"
      >
        Book Ticket
      </button>
    </div>
  );
}
