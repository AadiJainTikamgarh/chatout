import mongoose, { mongo, Schema } from "mongoose";
import bcryptjs from "bcryptjs";
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

UserSchema.pre("save", async (next) => {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcryptjs.hash(this.password, 10);

  next();
});

UserSchema.methods.isPasswordMatch = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

UserSchema.method.generateRefreshToken = async function () {
  const token = jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN }
  );

  return token;
};

const User = mongoose.models.user || mongoose.model("user", UserSchema);

export default User;
