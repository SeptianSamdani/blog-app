import { Schema, model, Types } from "mongoose";
import bcrypt from 'bcrypt'; 

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  firstName?: string;
  lastName?: string;
  socialLinks?: {
    website?: string;
    instagram?: string;
    tiktok?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      trim: true,
      minlength: [3, "Username must be at least 3 characters."],
      maxlength: [20, "Username must be less than 20 characters."],
      unique: true,
      lowercase: true,
      index: true
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
      maxlength: [50, "Email must be less than 50 characters."],
      unique: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."]
    },

    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters."],
      select: false
    },

    role: {
      type: String,
      enum: {
        values: ["admin", "user"],
        message: "{VALUE} is not a valid role."
      },
      default: "user"
    },

    firstName: {
      type: String,
      trim: true,
      maxlength: [20, "First name must be less than 20 characters."]
    },

    lastName: {
      type: String,
      trim: true,
      maxlength: [20, "Last name must be less than 20 characters."]
    },

    socialLinks: {
      website: {
        type: String,
        trim: true
      },
      instagram: {
        type: String,
        trim: true
      },
      tiktok: {
        type: String,
        trim: true
      }
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

export default model<IUser>("User", userSchema);