import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import ws from 'ws';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false }, realtime: { transport: ws } });

async function seed() {
  const password = "admin123";
  const hash = await bcrypt.hash(password, 10);
  const adminId = randomUUID();

  // Insert Admin User
  const { data: user, error: userError } = await supabase.from('User').insert({
    id: adminId,
    name: 'Admin MetaLabs',
    email: 'meremember6@gmail.com',
    passwordHash: hash,
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  }).select().single();

  if (userError) {
    console.error("Error creating Admin User:", userError.message);
    return;
  }

  // Insert Admin's AdAccount
  const { data: adAccount, error: accountError } = await supabase.from('AdAccount').insert({
    id: randomUUID(),
    userId: adminId,
    name: 'Ad Account Utama',
    currency: 'IDR',
    balance: 5000000,
    createdAt: new Date().toISOString()
  }).select().single();

  if (accountError) {
    console.error("Error creating AdAccount:", accountError.message);
    return;
  }

  console.log("✅ Berhasil membuat akun Admin:");
  console.log("Email:", "admin@metalabs.id");
  console.log("Password:", "admin123");
  console.log("Role:", "ADMIN");
}

seed();
