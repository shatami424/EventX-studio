import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import client from "../api/client";

export default function UserDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get("/api/tickets").then(res => {
      setTickets(res.data.tickets || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name || "User"}!</h1>
      <p className="mb-4">Here are your booked tickets:</p>
      {loading ? (
        <p>Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p>No tickets booked yet.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map(t => (
            <div key={t._id} className="border rounded-xl p-4">
              <h2 className="text-lg font-semibold">{t.event?.title}</h2>
              <p>Date: {t.event?.date ? new Date(t.event.date).toLocaleDateString() : ""}</p>
              <p>Seat: {t.seatNumber}</p>
              <img src={t.qrCodeDataUrl} alt="QR Code" className="w-32 h-32 mt-2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
