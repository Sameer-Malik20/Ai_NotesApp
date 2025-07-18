import mongoose from "mongoose";

const NotesSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Notes = mongoose.model("Ticket", NotesSchema);
export default Notes;
