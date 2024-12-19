import mongoose from "mongoose";
const schema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, "User ID is required"],
    },
    photo: {
        type: String,
        required: [true, "User photo is required"],
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    name: {
        type: String,
        required: [true, "User name is required"],
    },
    gender: {
        type: String,
        enum: ["male,female"],
        required: [true, "User gender is required"],
    },
    dob: {
        type: Date,
        required: [true, "User dob is required"],
    },
    email: {
        type: String,
        required: [true, "User email is required"],
        unique: [true, "User email is already exists"],
    },
}, {
    timestamps: true,
});
export const User = mongoose.model("User", schema);
