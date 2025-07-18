import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import AddNotes from "./AddNotes";

const ShowNotes = () => {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [editableNote, setEditTableNote] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [query, setQuery] = useState("");
  const [question, setQuestion] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [chatAnswer, setChatAnswer] = useState(null);
  const [highlightedNoteId, setHighlightedNoteId] = useState(null);

  useEffect(() => {
    allitems();
  }, []);

  const allitems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/allnotes`, {
        withCredentials: true,
      });
      console.log(res.data.getAllNotes);

      if (res.status === 200) {
        setNote(res.data.getAllNotes);
      }
    } catch (e) {
      alert("Error fetching items");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    console.log("id", id);

    setLoading(true);
    try {
      const res = await axios.delete(`http://localhost:5000/api/delete/${id}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        allitems(); // Refresh the list
      }
    } catch (e) {
      alert("Error deleting item");
    }
    setLoading(false);
  };
  const summarizeNote = async (id, content) => {
    const res = await axios.post("http://localhost:8000/ai/summarize", {
      text: content,
    });
    updateNoteAI(id, { aiSummary: res.data.summary });
  };

  const extractKeywords = async (id, content) => {
    const res = await axios.post("http://localhost:8000/ai/tags", {
      note: content,
    });
    updateNoteAI(id, { aiKeywords: res.data.tags });
  };

  const analyzeSentiment = async (id, content) => {
    const res = await axios.post("http://localhost:8000/ai/sentiment", {
      text: content,
    });
    updateNoteAI(id, { aiSentiment: res.data.label });
  };

  const updateNoteAI = (id, aiData) => {
    setNote((prev) =>
      prev.map((note) => (note._id === id ? { ...note, ...aiData } : note))
    );
  };

  const validNotes = note.filter((n) => n && n.content);

  const handleSearchQuery = async () => {
    try {
      const res = await axios.post("http://localhost:8000/ai/search", {
        notes: validNotes.map((n) => n.content),
        query: query,
      });
      setQuery("");
      const matchedNote = res.data.matched_note;
      setSearchResult(matchedNote);

      const matchedNoteObject = validNotes.find(
        (n) => n.content === matchedNote
      );
      if (matchedNoteObject) {
        setHighlightedNoteId(matchedNoteObject._id);
      } else {
        setHighlightedNoteId(null);
      }
    } catch (err) {
      console.error("Search API Error", err.message);
    }
  };

  const handleChatQuestion = async () => {
    try {
      const res = await axios.post("http://localhost:8000/ai/chat", {
        notes: note.map((n) => n.content),
        question: question,
      });
      setChatAnswer(res.data.answer);
      setQuestion("");
    } catch (err) {
      console.error("Chat API Error", err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-700">Loading Notes...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto container py-20 px-6">
      {/* Floating Plus Button */}
      <button
        onClick={() => setShowModel(true)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full w-14 h-14 text-3xl shadow-lg hover:bg-blue-700"
      >
        +
      </button>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          {/* Search Box */}
          <input
            type="text"
            placeholder="Search Notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-64"
          />
          <button
            onClick={handleSearchQuery}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            Search
          </button>

          {/* Ask Question */}
          <input
            type="text"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-72"
          />
          <button
            onClick={handleChatQuestion}
            className="bg-purple-600 text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            Ask
          </button>
        </div>

        {/* Answer Box */}
        {chatAnswer && (
          <div className="mt-4 bg-yellow-100 text-black p-4 rounded shadow">
            <strong>Answer:</strong> {chatAnswer}
          </div>
        )}
      </div>

      {/* Add Notes Modal */}
      {showModel && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-2xl relative">
            <button
              onClick={() => setShowModel(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl font-bold"
            >
              ×
            </button>
            <AddNotes
              closeModal={() => {
                setShowModel(false);
                setEditMode(false);
                setEditTableNote(null);
              }}
              reloadNotes={allitems}
              isEdit={editMode}
              existingNote={editableNote}
            />
          </div>
        </div>
      )}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          note.map((notes) => (
            <div
              key={notes._id}
              className={`rounded ${
                notes._id === highlightedNoteId ? "ring-4 ring-yellow-500" : ""
              }`}
            >
              <div className="w-full flex flex-col justify-between items-start dark:bg-gray-800 bg-white dark:border-gray-700 rounded-lg border border-gray-400 mb-6 py-5 px-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded shadow w-full max-w-full">
                  <h4 className="text-gray-800 dark:text-gray-100 font-bold mb-3">
                    {notes.title}
                  </h4>

                  {/* Scrollable note content */}
                  <div className="max-h-40 overflow-y-auto text-gray-800 dark:text-gray-100 text-sm mb-3 pr-2">
                    {notes.content}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 w-full">
                    <button
                      onClick={() => summarizeNote(notes._id, notes.content)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Summarize
                    </button>
                    <button
                      onClick={() => extractKeywords(notes._id, notes.content)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Keywords
                    </button>
                    <button
                      onClick={() => analyzeSentiment(notes._id, notes.content)}
                      className="bg-purple-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Sentiment
                    </button>
                  </div>

                  {/* Output (e.g. summary, keywords, sentiment) */}
                  {notes.summary && (
                    <div className="mt-3 bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm text-gray-900 dark:text-gray-100">
                      <strong>Summary:</strong> {notes.summary}
                    </div>
                  )}

                  {notes.keywords && (
                    <div className="mt-3 bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm text-gray-900 dark:text-gray-100">
                      <strong>Keywords:</strong> {notes.keywords}
                    </div>
                  )}

                  {notes.sentiment && (
                    <div className="mt-3 bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm text-gray-900 dark:text-gray-100">
                      <strong>Sentiment:</strong> {notes.sentiment}
                    </div>
                  )}
                </div>

                <div className="w-full flex flex-col items-start mt-2">
                  <div className="flex items-center justify-between text-gray-800 dark:text-gray-100 w-full">
                    <p className="text-sm">
                      {new Date(notes.createdAt).toLocaleString()}
                    </p>

                    <button
                      className="w-8 h-8 rounded-full bg-gray-800 dark:text-gray-800 dark:bg-gray-100 text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-black"
                      aria-label="edit note"
                      role="button"
                      onClick={() => {
                        setEditMode(true);
                        setEditTableNote(notes);
                        setShowModel(true);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-pencil"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        strokewidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z"></path>
                        <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
                        <line x1="13.5" y1="6.5" x2="17.5" y2="10.5"></line>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(notes._id)}
                      className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700"
                      aria-label="delete note"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-trash"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <path d="M4 7h16" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                        <path d="M9 7v-2a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Show AI results */}
                {notes.aiSummary && (
                  <div className="text-sm text-gray-700 mt-2">
                    <p>
                      <strong>Summary:</strong> {notes.aiSummary}
                    </p>
                    <p>
                      <strong>Keywords:</strong> {notes.aiKeywords?.join(", ")}
                    </p>
                    <p>
                      <strong>Sentiment:</strong> {notes.aiSentiment}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShowNotes;
