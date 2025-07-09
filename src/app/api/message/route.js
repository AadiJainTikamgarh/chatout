import { NextResponse } from "next/server";
import connectDB from "@/DB/dbconfig";
import Message from "@/models/message.model";
import mongoose from "mongoose";

connectDB();

export async function GET(request) {
  try {
    console.log("I am in API");
    const chatId = request.nextUrl.searchParams.get("chatId");
    console.log("Fetching messages for chat ID: ", chatId);

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    const messages = await Message.aggregate([
      {
        $match: {
          chat: new mongoose.Types.ObjectId(chatId), // Ensure chatId is a valid ObjectId
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          content: 1,
          from: 1,
        },
      },
    ]); // Fetch messages for the specific chat

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.log(error);
    console.log("Something went wrong : ", error.message);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
