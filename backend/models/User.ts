import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "student" | "institute" | "mentor";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  role: UserRole;
  email: string;
  password?: string;
  fullName?: string;
  targetExam?: string;
  instituteName?: string;
  batchSize?: string;
  specialty?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    role: {
      type: String,
      enum: ["student", "institute", "mentor"],
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    fullName: {
      type: String,
      trim: true,
    },
    targetExam: {
      type: String,
      trim: true,
    },
    instituteName: {
      type: String,
      trim: true,
    },
    batchSize: {
      type: String,
      trim: true,
    },
    specialty: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified
UserSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
