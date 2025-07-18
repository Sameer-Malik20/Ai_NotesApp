import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import SpeechToText from "./SpeechToText";

const AddNotes = ({
  closeModal,
  reloadNotes,
  isEdit = false,
  existingNote = null,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const noteData = { title, content };

      if (isEdit) {
        const res = await axios.put(
          `http://localhost:5000/api/update/${existingNote._id}`,
          noteData,
          { withCredentials: true }
        );
        if (res.status === 200) {
          alert("Note updated successfully");
        }
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/create",
          noteData,
          { withCredentials: true }
        );
        if (res.status === 200) {
          alert("Note added successfully");
        }
      }

      setTitle("");
      setContent("");
      reloadNotes();
      closeModal();
    } catch (err) {
      alert("Something went wrong!");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isEdit && existingNote) {
      setTitle(existingNote.title);
      setContent(existingNote.content);
    }
  }, [isEdit, existingNote]);
  return (
    <div>
      <div className="heading text-center font-bold text-2xl m-5 text-gray-800">
        New Note
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Form manually submitted");
          handleSubmit(e);
        }}
      >
        <div className="editor mx-auto w-10/12 flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg max-w-2xl">
          <input
            className="title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none"
            spellcheck="false"
            placeholder="Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <SpeechToText onTextResult={(text) => setTitle(text)} />
          <textarea
            className="description bg-gray-100 sec p-3 h-60 border border-gray-300 outline-none"
            spellcheck="false"
            placeholder="Describe everything about this post here"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
          <SpeechToText onTextResult={(text) => setContent(text)} />
          <div className="icons flex text-gray-500 m-2">
            <div className="count ml-auto text-gray-400 text-xs font-semibold">
              0/300
            </div>
          </div>

          <div className="buttons flex">
            <div
              onClick={closeModal}
              className="btn border border-gray-300 p-1 px-4 font-semibold cursor-pointer text-gray-500 ml-auto"
            >
              Cancel
            </div>
            <div className="btn border border-indigo-500 p-1 px-4 font-semibold cursor-pointer text-gray-200 ml-2 bg-indigo-500">
              <button type="submit" disabled={loading}>
                {loading
                  ? isEdit
                    ? "Updating..."
                    : "Adding..."
                  : isEdit
                  ? "Update"
                  : "Add"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddNotes;
