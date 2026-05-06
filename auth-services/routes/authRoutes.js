const express = require('express');
const passport = require('passport');
const router = express.Router();
const { generateToken } = require('../utils/jwt');
const { protect } = require('../middleware/auth');

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        const token = generateToken(req.user);
        res.json({ token, user: req.user });
    }
);

router.get('/me', protect, (req, res) => {
    res.json(req.user);
});

module.exports = router;