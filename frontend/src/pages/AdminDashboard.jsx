import { useEffect, useState } from "react";
import client from "../api/client";
import Card from "../components/ui/Card.jsx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [eventStats, setEventStats] = useState([]);

  useEffect(() => {
    client.get("/api/analytics/overview").then(res => setOverview(res.data));
    client.get("/api/analytics/event-stats").then(res => setEventStats(res.data));
  }, []);

  if (!overview) return <p className="text-[#566A7F]">Loading analytics...</p>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-[#2F3349]">Admin Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-[#8592A3]">Total Events</p>
          <p className="text-2xl font-semibold text-[#2F3349]">{overview.totalEvents}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-[#8592A3]">Tickets Sold</p>
          <p className="text-2xl font-semibold text-[#2F3349]">{overview.totalTickets}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-[#8592A3]">Revenue</p>
          <p className="text-2xl font-semibold text-[#2F3349]">${overview.totalRevenue}</p>
        </Card>
      </div>

      {/* Top Events (Bar Chart) */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-[#2F3349] mb-4">Top Events by Sales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={overview.topEvents}>
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#696CFF" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Event Stats (Pie Chart) */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-[#2F3349] mb-4">Revenue Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={eventStats}
              dataKey="revenue"
              nameKey="title"
              outerRadius={120}
              label
            >
              {eventStats.map((_, i) => (
                <Cell key={i} fill={["#696CFF", "#03C3EC", "#71DD37", "#FFAB00"][i % 4]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
