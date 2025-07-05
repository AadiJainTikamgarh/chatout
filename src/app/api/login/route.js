import User from "@/models/user.models";
import { NextResponse } from "next/server";
import connectDB from "@/DB/dbconfig";

connectDB();

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      console.log("username and password required");
      return NextResponse.json(
        { error: "Username and Password required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.isPasswordMatch(password)) {
      return NextResponse.json({ error: "Invalid Password" }, { status: 403 });
    }

    const token = await user.generateRefreshToken();

    const response =  NextResponse.json(
      { message: "User login successfully", success: true },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      expires: process.env.REFRESH_TOKEN_EXPIRE_IN,
      httpOnly: true,
    });

    return response;
    
  } catch (error) {
    console.log("Something went wrong : ", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
