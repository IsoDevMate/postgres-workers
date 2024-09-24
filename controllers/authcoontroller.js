const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const  myMessageQueue  = require('../queues/queues');

const authController = {
  signup: async (req, res) => {
    try {
      const { first_name, last_name, email, password } = req.body;
      console.log(req.body);
      const hashedPassword = await bcrypt.hash(password, 10);
      const [user] = await User.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
      });
      console.log("here is the user",user);
      // Add email job to the queue
      await myMessageQueue.add('welcome-email', {
        to: email,
        subject: 'Welcome to Our Platform',
        text: `Hello ${first_name}, welcome to our platform!`,
        html: `<h1>Welcome, ${first_name}!</h1><p>We're glad you've joined our platform.</p>`,
      },
      {
        delay: 5000,
      });

      res.status(201).json({ message: 'User created successfully', userId: user.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email, newPassword } = req.body;
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.updatePassword(user.id, hashedPassword);
      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = authController;