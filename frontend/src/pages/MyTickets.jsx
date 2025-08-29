import { useEffect, useState } from "react";
import client from "../api/client";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    client.get("/tickets/my-tickets").then(res => setTickets(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Tickets</h1>
      <div className="space-y-4">
        {tickets.map(t => (
          <div key={t._id} className="border rounded-xl p-4">
            <h2 className="text-lg font-semibold">{t.event.title}</h2>
            <p>Date: {new Date(t.event.date).toLocaleDateString()}</p>
            <p>Seat: {t.seatNumber}</p>
            <img src={t.qrCode} alt="QR Code" className="w-32 h-32 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
