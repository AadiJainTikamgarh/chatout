import { NextResponse } from "next/server";
import connectDB from "@/DB/dbconfig";
import { getUserID } from "@/helper/getUserId";
import User from "@/models/user.models";
import Chat from "@/models/chat.models";
import mongoose, { isValidObjectId } from "mongoose";

connectDB();

export async function POST(request) {
  try {
    const { userId } = await getUserID();
    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        { error: "Unauthorized Request" },
        { status: 401 }
      );
    }

    const { chatWith } = await request.json();
    if (!chatWith || !isValidObjectId(chatWith)) {
      return NextResponse.json(
        { error: "Invalid chatWith user ID" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const ChatExists = await Chat.findOne({
      participants: { $all: [userId, chatWith] },
    });

    if (ChatExists) {
      return NextResponse.json(
        { error: "Chat already exists with this user" },
        { status: 400 }
      );
    }

    console.log("Creating chat with user ID: ", chatWith);
    const chatWithUser = await User.findById(chatWith);

    if (!chatWithUser) {
      return NextResponse.json(
        { error: "User to chat with not found" },
        { status: 404 }
      );
    }

    const chat = new Chat({
      name: `Chat between ${user.username} and ${chatWithUser.username}`,
      participants: [
        new mongoose.Types.ObjectId(userId),
        new mongoose.Types.ObjectId(chatWith),
      ],
    });

    const savedChat = await chat.save();

    if(!savedChat) {
      return NextResponse.json(
        { error: "Failed to create chat" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Chat created successfully", chatId: savedChat._id },
      { status: 200 }
    );

  } catch (error) {
    console.log("Something went wrong: ", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
