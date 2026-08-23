import mongoose from 'mongoose';

/**
 * Memeriksa apakah koneksi ke database MongoDB sedang aktif.
 * Mengembalikan true jika state adalah 'connected' (1).
 */
export function hasDatabaseConnection(): boolean {
  return mongoose.connection.readyState === 1;
}
