import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seatNumber: { type: String, required: true },
    pricePaid: { type: Number, required: true },
    qrCodeDataUrl: { type: String, required: true }, // data:image/png;base64,...
    status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' },
    paymentRef: { type: String, default: '' }        // dummy payment reference
  },
  { timestamps: true }
);

export default mongoose.model('Ticket', ticketSchema);
