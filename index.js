import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: 'https://pms-frontend-rflyt7y5h-udit-singhs-projects.vercel.app/', // Replace with your actual frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Supabase client setup
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
