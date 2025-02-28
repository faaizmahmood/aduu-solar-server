const express = require('express');
const User = require('../../models/User');
const { setUser } = require('../../utils/jwt');

const router = express.Router();


router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(403).json({ message: "User not found!" });
        }

        const isMatched = await user.matchPassword(password);

        if (!isMatched) {
            return res.status(401).json({ message: "Incorrect password!" });
        }

        const payload = {
            id: user._id,
            email: user.email,
            name: user.username,
            role: user.role,
        };

        const token = setUser(payload);

        res.status(200).json({
            message: "Login successful",
            authToken: token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
