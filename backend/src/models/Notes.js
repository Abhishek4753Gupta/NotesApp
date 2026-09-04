import mongoose from "mongoose";

const noteSchema = mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
        },
        content:{
            type:String,
            required:true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps:true
    }
);
noteSchema.index({ user: 1, createdAt: -1 });
const Note = mongoose.model("Note",noteSchema);

export default Note;