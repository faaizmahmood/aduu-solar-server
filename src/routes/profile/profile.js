const express = require('express');
const router = express.Router();

const userMiddleware = require('../../middlewares/userMiddleware');
const User = require('../../models/User');

router.get('/profile', userMiddleware, async (req, res) => {

    const user = req.user;

    if (!user) {
        return res.status(404).json({
            message: 'User not found',
        });
    }

    try {
        // Fetch the user details by user ID from the database
        const userDetails = await User.findById(user.id);

        // If no user found, return 404
        if (!userDetails) {
            return res.status(404).json({
                message: 'User details not found',
            });
        }

        // Return the user details
        res.status(200).json({
            message: 'User details retrieved successfully',
            user: userDetails,
        });

    } catch (error) {
        console.error('Error retrieving profile:', error);

        // Return a 500 response for unexpected server errors
        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});

module.exports = router;
