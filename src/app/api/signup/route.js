import User from "@/models/user.models";
import { NextResponse } from "next/server";
import connectDB from "@/DB/dbconfig";

connectDB();

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    console.log(username);
    if (!username) {
      console.log("Username Not Found");
      return NextResponse.json(
        { message: "Username Required" },
        { status: 404 }
      );
    }

    if (!password) {
      console.log("Password Not Found");
      return NextResponse.json(
        { message: "Password Required" },
        { status: 404 }
      );
    }

    let user = await User.findOne({ username });

    if (user) {
      return NextResponse.json(
        { message: "Username occupied" },
        { status: 400 }
      );
    }

    user = User({
      username,
      password,
    });

    await user.save();

    return NextResponse.json(
      { message: "User created successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    console.log("Something went wrong : ", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
