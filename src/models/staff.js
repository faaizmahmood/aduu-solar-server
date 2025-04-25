const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const StaffSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "Please provide a valid email"
            ]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"]
        },
        role: {
            type: String,
            enum: ["admin", "staff", "client"],
            default: "staff"
        },
        workingRole: {
            type: String,
            default: null
        },
        phone: {
            type: String,
            default: null
        },
        status: {
            type: String,
            default: null
        },
        totalProjects: {
            type: Number,
            default: 0
        },
        projectsAssigned: {
            type: [
                {
                    projectId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Project"
                    },
                    projectName: {
                        type: String,
                        required: true
                    }
                }
            ],
            default: null
        },
        lastReadMessages: [
            {
                projectId: mongoose.Schema.Types.ObjectId,
                lastReadAt: Date
            }
        ]
    },
    { timestamps: true }
);

// **Hash Password Before Saving**
StaffSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// **Compare Password for Login**
StaffSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// **Hide Password in JSON Response**
StaffSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

const Staff = mongoose.model("Staff", StaffSchema);
module.exports = Staff;
