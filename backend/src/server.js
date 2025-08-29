import { config } from 'dotenv';
config();
import app from './app.js';

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`EventX Studio API running on http://localhost:${PORT}`);
});
