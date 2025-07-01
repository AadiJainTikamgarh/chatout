import mongoose, { Schema } from "mongoose";

const ChatSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "message",
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

const Chat = mongoose.models.chat || mongoose.model("chat", ChatSchema)

export default Chat;