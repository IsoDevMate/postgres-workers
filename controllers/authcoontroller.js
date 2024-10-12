const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');
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
      const token = req.headers.authorization.split(' ')[1];
      await User.revokeToken(token);

      const user = await User.findByToken(token);
      await myMessageQueue.add('goodbye-email', {
        to: user.email,
        subject: 'Goodbye!',
        text: `Goodbye ${user.first_name}, we hope to see you again soon!`,
        html: `<h1>Goodbye, ${user.first_name}!</h1><p>We hope to see you again soon.</p>`,
      }, {
        delay: 5000,
      });

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const resetToken = uuidv4();
      console.log("resetToken",resetToken);
      await User.updateResetToken(user.id, resetToken);

      // Send the reset password email
      await myMessageQueue.add('reset-password-email', {
        to: email,
        subject: 'Reset Your Password',
        text: `Click the following link to reset your password: https://livestream-webui.vercel.app/forgot?id=${resetToken}`,
        html: `<p>Click the following link to reset your password: <a href="https://livestream-webui.vercel.app/forgot?id=${resetToken}">Reset Password</a></p>`,
      }, {
        delay: 5000,
      });

      res.json({ message: 'Password reset link sent to your email' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      const user = await User.findByResetToken(token);
      if (!user) {
        return res.status(404).json({ error: 'Invalid or expired token' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.updatePassword(user.id, hashedPassword);
      await User.clearResetToken(user.id);

      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

};

module.exports = authController;