import { NextResponse } from "next/server";
import connectDB from "@/DB/dbconfig";
import { getUserID } from "@/helper/getUserId";
import User from "@/models/user.models";
import Chat from "@/models/chat.models";
import mongoose, { isValidObjectId } from "mongoose";

connectDB();

/**
 * GET API to fetch chats for a user
 * @param {Request} request - The incoming request object
 * @return {NextResponse} - JSON response containing chat data or error message
 * @throws {Error} - Throws an error if the user is unauthorized or if there are issues with the database query
 * @description This API retrieves the chat list for a user based on their ID.
 * It checks if the user is authorized, validates the chat ID if provided, and returns the chat data along with the other participants in each chat.
 * If no chat ID is provided, it returns all chats for the user. If a valid chat ID is provided, it returns the specific chat if it exists.
 * If the user is not found or if there are no chats, it returns appropriate error messages.
 * @example
 * GET /api/chats?id=1234567890abcdef12345678
 * @returns {NextResponse} - JSON response with chat data or error message
 * @status 200 - Success
 * @status 400 - Bad Request (if chat ID is invalid)
 * @status 401 - Unauthorized (if user ID is invalid)
 * @status 404 - Not Found (if user or chats are not found)
 * @status 500 - Internal Server Error (if an error occurs during processing)
 */
export async function GET(request) {
  const id = request.nextUrl.searchParams.get("id");
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

    const pipeline = [];

    // validiating for chat Id
    if (!id) {
      pipeline.push({
        $match: {
          participants: new mongoose.Types.ObjectId(userId),
        },
      });
    } else if (isValidObjectId(id)) {
      pipeline.push({
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          participants: new mongoose.Types.ObjectId(userId),
        },
      });
    } else {
      return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 });
    }

    const chats = await Chat.aggregate([
      ...pipeline,
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
      return NextResponse.json({ error: "No Chats Found" }, { status: 404 });
    }

    return NextResponse.json({ chats, success: true }, { status: 200 });
  } catch (error) {
    console.log("Something went wrong", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
