import mongoose from "mongoose";
import validator from "validator";
interface IUser extends Document {
  _id: string;
  photo: string;
  role: "admin" | "user";
  name: string;
  email: string;
  gender: "male" | "female";
  dob: Date;
  createdAt: Date;
  updatedAt: Date;
  //virtual attributes
  age: number;
}
const schema = new mongoose.Schema(
  {
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
      validate: validator.default.isEmail,
    },
  },
  {
    timestamps: true,
  }
);

//age
schema.virtual("age").get(function () {
  const today = new Date();
  const dob = new Date(this.dob);
  let age = today.getFullYear() - dob.getFullYear();
  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }
});
export const User = mongoose.model<IUser>("User", schema);
