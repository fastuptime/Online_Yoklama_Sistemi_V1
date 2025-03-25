const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  if (req.session.user) {
    if (req.session.user.role === 'INSTRUCTOR') {
      return res.redirect('/instructor/dashboard');
    } else {
      return res.redirect('/student/dashboard');
    }
  }
  res.sendFile(path.join(__dirname, '..', 'WWW', 'index.html'));
});

module.exports = router;
