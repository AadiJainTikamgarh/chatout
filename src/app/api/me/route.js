import { NextResponse } from "next/server";
import { getUserID } from "@/helper/getUserId";

export async function GET() {
  try {
    const { userId } = await getUserID();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized Request" },
        { status: 401 }
      );
    }

    return NextResponse.json({ userId }, {status: 200});
  } catch (error) {
    console.log("Something went wrong: ", error.message);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
