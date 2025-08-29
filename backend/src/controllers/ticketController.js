// backend/src/controllers/ticketController.js
import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";
import QRCode from "qrcode";

export const createTicket = async (req, res) => {
  try {
    const { eventId, seatNumber } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check seat availability
    const seat = event.seats.find((s) => s.number === seatNumber && !s.isBooked);
    if (!seat) return res.status(400).json({ message: "Seat unavailable" });

    // Create QR code
    const qrData = `${req.user.id}-${event._id}-${seatNumber}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrData);

    const ticket = await Ticket.create({
      event: event._id,
      user: req.user.id,
      seatNumber,
      pricePaid: event.price,
      qrCodeDataUrl,
    });

    // Mark seat booked
    seat.isBooked = true;
    seat.ticket = ticket._id;
    await event.save();

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id }).populate("event");
    res.json({ tickets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("event");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json({ ticket });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
