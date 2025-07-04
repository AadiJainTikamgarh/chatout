import { NextResponse } from "next/server";
import connectDB from "@/DB/dbconfig";
import User from "@/models/user.models";
import { getUserID } from "@/helper/getUserId";
import { cookies } from "next/headers";

connectDB();

export async function GET(request) {
  try {
    const userObject = await getUserID();
    if (!userObject || !userObject.userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    await User.findByIdAndUpdate(userObject.userId, {
      accessToken: undefined,
    });

    // removing token from cookies
    const cookiesStore = await cookies();
    cookiesStore.set("token", "");

    return NextResponse.json(
      { message: "Logout Successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log("Something went wrong : ", error);
    process.kill(0);
  }
}
