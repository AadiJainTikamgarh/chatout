import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    content: {
        type: String,
        trim: true,
        required: true,
    },
    chat: {
        type: Schema.Types.ObjectId,
        reg: "chat"
    }
})

const Message = mongoose.models.message || mongoose.model("message", MessageSchema)

export default Message;