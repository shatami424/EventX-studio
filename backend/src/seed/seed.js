import { config } from 'dotenv';
config();
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';  // ✅ add bcrypt
import User from '../models/User.js';
import Event from '../models/Event.js';
import Ticket from '../models/Ticket.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI missing');
  await mongoose.connect(uri, { dbName: 'eventx' });
  console.log('Connected. Seeding…');

  const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8'));
  const events = JSON.parse(fs.readFileSync(path.join(__dirname, 'events.json'), 'utf-8'));

  await Promise.all([User.deleteMany({}), Event.deleteMany({}), Ticket.deleteMany({})]);

  // ✅ Hash passwords before insert
  const hashedUsers = await Promise.all(
    users.map(async (u) => {
      const hashed = await bcrypt.hash(u.password, 10);
      return { ...u, password: hashed };
    })
  );

  const createdUsers = await User.insertMany(hashedUsers);

  // generate seat maps
  const withSeats = events.map(e => {
    const seats = [];
    const rows = Math.ceil(e.totalSeats / 10);
    let count = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 1; c <= 10 && count < e.totalSeats; c++) {
        seats.push({ number: String.fromCharCode(65 + r) + c });
        count++;
      }
    }
    return { ...e, seats };
  });
  const createdEvents = await Event.insertMany(withSeats);

  console.log(`Users: ${createdUsers.length}, Events: ${createdEvents.length}`);
  await mongoose.connection.close();
  console.log('Done.');
}

run().catch(async (e) => {
  console.error(e);
  await mongoose.connection.close();
  process.exit(1);
});
