// index.js (Backend)
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
const app = express();
app.use(express.json());
app.use(cors());

// Supabase client setup
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

app.get('/', (req, res) => {
  res.send('Server is running and accessible');
});
app.get('/login', (req, res) => {
  res.send("message from login")
});

app.post('/login', async (req, res) => {
  
  const { email, password } = req.body;

  try {
    // Query Supabase to find the user with the given email
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    if (error) {
      throw new Error('Database query failed');
    }

    const user = users[0];

    if (user) {
      // Compare password (assuming plain text; change logic if using hashed passwords)
      const isPasswordCorrect = password === user.password; // Adjust this for hashed passwords

      if (isPasswordCorrect) {
        res.status(200).send({ message: 'Login successful', user: { email: user.email, role: user.role } });
      } else {
        res.status(401).send({ message: 'Invalid password' });
      }
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Server error', error: err.message });
  }
});

app.listen(9002, () => {
  console.log('Server is running on port 9002');
});
