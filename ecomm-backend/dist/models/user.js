import mongoose from "mongoose";
import validator from "validator";
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
        enum: ["male", "female"],
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
        validate: validator.default.isEmail,
    },
}, {
    timestamps: true,
});
//age
schema.virtual("age").get(function () {
    const today = new Date();
    const dob = new Date(this.dob);
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() || // If the current month is before the birth month
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
    // If the current month is the same as the birth month but the current day is before the birth day
    ) {
        age--;
    }
});
export const User = mongoose.model("User", schema);
// Example in Action:
// User Data:
// {
//   "dob": "2000-03-15"
// }
// If Today Is 2024-12-20:
// age = 2024 - 2000 = 24 (Initial calculation)
// Since the birthday (March 15) has already happened this year, the final age = 24.
// If Today Is 2024-03-14:
// age = 2024 - 2000 = 24 (Initial calculation)
// Since the birthday (March 15) hasn’t happened yet, the final age = 23.
