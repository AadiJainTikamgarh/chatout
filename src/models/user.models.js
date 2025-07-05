import mongoose, { mongo, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    accessToken: String,
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); 

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

UserSchema.methods.isPasswordMatch = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateRefreshToken = async function () {
  const token = jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET
  );

  return token;
};

const User = mongoose.models.user || mongoose.model("user", UserSchema);

export default User;
