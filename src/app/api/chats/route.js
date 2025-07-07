import { NextResponse } from "next/server";
import connectDB from "@/DB/dbconfig";
import { getUserID } from "@/helper/getUserId";
import User from "@/models/user.models";
import Chat from "@/models/chat.models";
import mongoose, { isValidObjectId } from "mongoose";

connectDB();

export async function GET() {
  try {
    const { userId } = await getUserID();

    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        { error: "Unauthorized Request" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const chats = await Chat.aggregate([
      {
        $match: {
          participants: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          pipeline: [
            {
              $match: {
                $expr: {
                  $ne: ["$_id", new mongoose.Types.ObjectId(userId)],
                },
              },
            },
            {
              $project: {
                username: 1,
              },
            },
          ],
          as: "otherParticipants",
        },
      },
      {
        $project: { 
          lastMessage: 1,
          otherParticipants: 1,
        },
      },
    ]);

    if (!chats) {
      return NextResponse.json({ message: "No Chats Found" }, { status: 404 });
    }

    return NextResponse.json({ chats, success: true }, { status: 200 });
  } catch (error) {
    console.log("Something went wrong", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
