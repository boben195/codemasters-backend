import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: "User",
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        weight: {
            type: Number,
            default: "0",
        },
        gender: {
            type: String,
            enum: ['male', 'female', ""],
            default: "",
        },
        activeTimeSport: {
            type: Number,
            default: "0",
        },
        dailyWaterRate: {
            type: Number,
            default: "0",
        },
        avatarURL: {
            type: String,
            default: "",
        },
        verify: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            required: [true, 'Verify token is required'],
        },
    }, {
        versionKey: false
    }
);

export default mongoose.model("User", contactSchema);