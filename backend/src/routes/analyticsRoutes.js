import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";

const router = Router();

// Overview stats
router.get("/overview", requireAuth, requireRole("admin"), async (req, res) => {
  const totalEvents = await Event.countDocuments();
  const totalTickets = await Ticket.countDocuments({ status: "booked" });
  const totalRevenue = await Ticket.aggregate([
    { $match: { status: "booked" } },
    { $group: { _id: null, revenue: { $sum: "$pricePaid" } } },
  ]);

  // top events by sales
  const topEvents = await Ticket.aggregate([
    { $match: { status: "booked" } },
    { $group: { _id: "$event", sales: { $sum: 1 } } },
    { $sort: { sales: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "events",
        localField: "_id",
        foreignField: "_id",
        as: "event",
      },
    },
    { $unwind: "$event" },
    { $project: { title: "$event.title", sales: 1 } },
  ]);

  res.json({
    totalEvents,
    totalTickets,
    totalRevenue: totalRevenue[0]?.revenue || 0,
    topEvents,
  });
});

// Revenue distribution per event
router.get("/event-stats", requireAuth, requireRole("admin"), async (req, res) => {
  const stats = await Ticket.aggregate([
    { $match: { status: "booked" } },
    { $group: { _id: "$event", revenue: { $sum: "$pricePaid" } } },
    {
      $lookup: {
        from: "events",
        localField: "_id",
        foreignField: "_id",
        as: "event",
      },
    },
    { $unwind: "$event" },
    { $project: { title: "$event.title", revenue: 1 } },
  ]);
  res.json(stats);
});

export default router;
