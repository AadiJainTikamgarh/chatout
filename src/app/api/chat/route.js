import { NextResponse } from "next/server";
import Message from "@/models/message.model";
import { getUserID } from "@/helper/getUserId";
import mongoose, { isValidObjectId } from "mongoose";

export async function POST(request) {
    try {
        const {userId} = await getUserID();

        if(!isValidObjectId(userId)){
            return NextResponse.json({message: "UnAuthorized"}, {status: 401})
        }

        const {chatId} = await request.json()

        const PastMessages = await Message.aggregate([{
            $match: {
                $eq: ["$chat", new mongoose.Types.ObjectId(chatId)]
            }
        }])

        return NextResponse.json({PastMessages, success: true}, {status: 200})

    } catch (error) {
        console.log("Something went wrong : ", error.message);
        return NextResponse.json({error: error.message || "Internal Server Error"}, {status: 500})
    }

}