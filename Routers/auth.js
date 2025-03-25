const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const path = require('path');

const prisma = new PrismaClient();

router.get('/login', (req, res) => {
  if (req.session.user) {
    if (req.session.user.role === 'INSTRUCTOR') {
      return res.redirect('/instructor/dashboard');
    } else {
      return res.redirect('/student/dashboard');
    }
  }
  res.sendFile(path.join(__dirname, '..', 'WWW', 'login.html'));
});

router.post('/login', async (req, res) => {
  try {
    const { tc, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { tc }
    });

    if (!user) {
      return res.status(401).json({ message: 'Incorrect TC or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect TC or password' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginIp: req.ip,
        lastLoginLocation: req.body.location || null
      }
    });

    req.session.user = {
      id: user.id,
      tc: user.tc,
      name: user.name,
      surname: user.surname,
      role: user.role
    };

    res.cookie('user_id', user.id, {
      maxAge: 24 * 60 * 60 * 1000, 
      httpOnly: true
    });

    if (user.role === 'INSTRUCTOR') {
      return res.json({ redirect: '/instructor/dashboard' });
    } else {
      return res.json({ redirect: '/student/dashboard' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error during logout');
    }

    res.clearCookie('user_id');
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

module.exports = router;