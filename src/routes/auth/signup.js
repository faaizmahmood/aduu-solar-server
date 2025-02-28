const express = require('express');
const User = require('../../models/User');
const { setUser } = require('../../utils/jwt');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        let existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const userPayload = {
            name,
            email,
            password: password,
            role: 'client',
        };

        const user = new User(userPayload);
        await user.save();

        const tokenPayload = {
            id: user._id,
            email: user.email,
            name: user.name
        };

        const token = setUser(tokenPayload);

        res.status(201).json({
            message: "User registered successfully.",
            authToken: token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error."
        });
    }
});

module.exports = router;
