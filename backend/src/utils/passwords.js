import bcrypt from 'bcryptjs';
export const hash = async (raw) => bcrypt.hash(raw, await bcrypt.genSalt(10));
export const compare = (raw, hashed) => bcrypt.compare(raw, hashed);
