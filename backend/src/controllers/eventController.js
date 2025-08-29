import Event from '../models/Event.js';

/** Build seat map like A1..A10, B1.. etc */
function generateSeatMap(totalSeats, seatsPerRow = 10) {
  const seats = [];
  const rows = Math.ceil(totalSeats / seatsPerRow);
  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 1; c <= seatsPerRow && count < totalSeats; c++) {
      seats.push({ number: String.fromCharCode(65 + r) + c, isBooked: false, ticket: null });
      count++;
    }
  }
  return seats;
}

export const list = async (req, res, next) => {
  try {
    const { q, active, from, to } = req.query;
    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (active === 'true') filter.isActive = true;
    if (active === 'false') filter.isActive = false;
    if (from || to) filter.date = {
      ...(from ? { $gte: new Date(from) } : {}),
      ...(to ? { $lte: new Date(to) } : {})
    };
    const events = await Event.find(filter).sort({ date: 1 });
    res.json({ events });
  } catch (e) { next(e); }
};

export const getOne = async (req, res, next) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    res.json({ event: ev });
  } catch (e) { next(e); }
};

export const create = async (req, res, next) => {
  try {
    const { title, date, venue, price, totalSeats, coverImage, tags, isActive = true } = req.body;
    const seats = generateSeatMap(Number(totalSeats || 1));
    const ev = await Event.create({ title, date, venue, price, totalSeats, seats, coverImage, tags, isActive });
    res.status(201).json({ event: ev });
  } catch (e) { next(e); }
};

export const update = async (req, res, next) => {
  try {
    const { title, date, venue, price, totalSeats, coverImage, tags, isActive } = req.body;
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });

    // If totalSeats changed, regenerate seat map but preserve existing bookings where possible
    if (totalSeats && Number(totalSeats) !== ev.totalSeats) {
      const newSeats = generateSeatMap(Number(totalSeats));
      const booked = new Map(ev.seats.filter(s => s.isBooked).map(s => [s.number, s]));
      for (const s of newSeats) {
        if (booked.has(s.number)) Object.assign(s, booked.get(s.number));
      }
      ev.seats = newSeats;
      ev.totalSeats = Number(totalSeats);
    }

    if (title !== undefined) ev.title = title;
    if (date !== undefined) ev.date = date;
    if (venue !== undefined) ev.venue = venue;
    if (price !== undefined) ev.price = price;
    if (coverImage !== undefined) ev.coverImage = coverImage;
    if (tags !== undefined) ev.tags = tags;
    if (isActive !== undefined) ev.isActive = isActive;

    await ev.save();
    res.json({ event: ev });
  } catch (e) { next(e); }
};

export const remove = async (req, res, next) => {
  try {
    const ev = await Event.findByIdAndDelete(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
};

/** Admin-only seat toggle for manual adjustments (rare). */
export const setSeatBooked = async (req, res, next) => {
  try {
    const { number, isBooked } = req.body;
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    const seat = ev.seats.find(s => s.number === number);
    if (!seat) return res.status(404).json({ message: 'Seat not found' });
    seat.isBooked = !!isBooked;
    if (!seat.isBooked) seat.ticket = null;
    await ev.save();
    res.json({ seat });
  } catch (e) { next(e); }
};

export const metrics = async (_req, res, next) => {
  try {
    const now = new Date();
    const events = await Event.find({});
    const totalEvents = events.length;
    const upcoming = events.filter(e => e.date >= now).length;
    const ticketsSold = events.reduce((sum, e) => sum + e.seats.filter(s => s.isBooked).length, 0);
    const capacity = events.reduce((sum, e) => sum + e.totalSeats, 0);
    const revenue = events.reduce((sum, e) => {
      const sold = e.seats.filter(s => s.isBooked).length;
      return sum + sold * e.price;
    }, 0);
    res.json({ totalEvents, upcoming, ticketsSold, capacity, revenue });
  } catch (e) { next(e); }
};
