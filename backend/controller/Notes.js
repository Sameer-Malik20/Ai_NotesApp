import Notes from "../models/Notes.js";

const Create = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({
      message: "Title and content are required",
      success: false,
    });
  }
  try {
    const notes = await new Notes({
      title,
      content,
    });
    await notes.save();
    res.status(200).json({
      message: "notes create success",
      success: true,
      notes,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "server error",
      success: false,
      error,
    });
  }
};

const Update = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const UpdateNotes = await Notes.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );
    if (!UpdateNotes) {
      res.status(400).json({
        message: "notes not found",
        success: false,
        UpdateNotes,
      });
    }
    res.status(200).json({
      message: "update notes successfully",
      success: true,
      UpdateNotes,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "server error",
      success: false,
      error,
    });
  }
};

const Delete = async (req, res) => {
  const { id } = req.params;
  try {
    const NotesDel = await Notes.findByIdAndDelete(id);
    if (!NotesDel) {
      res.status(400).json({
        message: "notes not found",
        success: false,
        NotesDel,
      });
    }
    res.status(200).json({
      message: "notes delete successfully",
      success: true,
      NotesDel,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "server error",
      success: false,
      error,
    });
  }
};

const AllNotes = async (req, res) => {
  try {
    const getAllNotes = await Notes.find();
    if (!getAllNotes || getAllNotes.length == 0) {
      return res.status(400).json({
        message: "no notes found",
        success: false,
        getAllNotes,
      });
    }
    res.status(200).json({
      message: "items Fecthed Successfully",
      success: true,
      getAllNotes,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "server error",
      success: false,
      error,
    });
  }
};
export { Create, Update, Delete, AllNotes };
