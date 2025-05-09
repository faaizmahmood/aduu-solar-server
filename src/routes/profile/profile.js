const express = require('express');
const router = express.Router();

const userMiddleware = require('../../middlewares/userMiddleware');
const User = require('../../models/User');
const Staff = require('../../models/staff');  // Import Staff model

router.get('/', userMiddleware, async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(404).json({
            message: 'User not found',
        });
    }

    try {
        // First, check in the User collection
        let userDetails = await User.findById(user.id);

        // If not found in User collection, check in Staff collection
        if (!userDetails) {
            userDetails = await Staff.findById(user.id);
        }

        // If no user found in either collection, return 404
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
