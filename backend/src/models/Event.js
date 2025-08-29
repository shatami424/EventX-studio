import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  number: { type: String, required: true },   // e.g., A1
  isBooked: { type: Boolean, default: false },
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', default: null }
}, { _id: false });

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    totalSeats: { type: Number, required: true, min: 1 },
    seats: { type: [seatSchema], default: [] }, // pre-generated seat map
    isActive: { type: Boolean, default: true },
    coverImage: { type: String, default: '' },
    tags: [String]
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
