import { NextResponse } from "next/server";
import connectDB from "@/DB/dbconfig";
import User from "@/models/user.models";
import { getUserID } from "@/helper/getUserId";
import mongoose, { isValidObjectId } from "mongoose";

connectDB();

export async function GET(request) {
  try {
    const {userId} = await getUserID();

    if(!isValidObjectId(userId)){
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    const userList = await User.aggregate([{
        $match: {
            $ne: ["$_id", new mongoose.Types.ObjectId(userId)]
        }
    }, {
        $project: {
            username: 1
        }
    }])

    if(!userList){
        return NextResponse.json({error: "User list not found"}, {status: 404})
    }

    return NextResponse.json({userList, success: true}, {status: 200})

  } catch (error) {
    console.log("Something went wrong: ", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
