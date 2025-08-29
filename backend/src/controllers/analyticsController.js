const Ticket = require("../models/Ticket");
const Event = require("../models/Event");

// Total tickets sold, revenue, top events
exports.getOverview = async (req, res, next) => {
  try {
    const tickets = await Ticket.find().populate("event", "price title");
    const events = await Event.find();

    const totalTickets = tickets.length;
    const totalRevenue = tickets.reduce((sum, t) => sum + t.event.price, 0);

    // Top 5 events by sales
    const eventSales = {};
    tickets.forEach(t => {
      eventSales[t.event.title] = (eventSales[t.event.title] || 0) + 1;
    });

    const topEvents = Object.entries(eventSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([title, count]) => ({ title, sales: count }));

    res.json({ totalTickets, totalRevenue, topEvents, totalEvents: events.length });
  } catch (err) {
    next(err);
  }
};

// Event-wise breakdown
exports.getEventStats = async (req, res, next) => {
  try {
    const events = await Event.find();
    const tickets = await Ticket.find().populate("event", "title price");

    const stats = events.map(ev => {
      const evTickets = tickets.filter(t => t.event._id.equals(ev._id));
      return {
        eventId: ev._id,
        title: ev.title,
        ticketsSold: evTickets.length,
        revenue: evTickets.reduce((sum, t) => sum + t.event.price, 0),
        seatsLeft: ev.seats
      };
    });

    res.json(stats);
  } catch (err) {
    next(err);
  }
};
