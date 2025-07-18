from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer, util
import numpy as np
import os

from ai_utils.summarizer import summarize_note
from ai_utils.keyword_extractor import extract_keywords
from ai_utils.speech_to_text import speech_to_text
from ai_utils.sentiment_analyzer import analyze_sentiment

app = Flask(__name__)
CORS(app)

model = SentenceTransformer('all-MiniLM-L6-v2')

@app.route('/ai/summarize', methods=['POST'])
def summarize():
    data = request.json
    summary = summarize_note(data.get("text", ""))
    return jsonify({"summary": summary})

@app.route('/ai/keywords', methods=['POST'])
def keywords():
    data = request.json
    keywords = extract_keywords(data.get("text", ""))
    return jsonify({"keywords": keywords})

@app.route('/ai/sentiment', methods=['POST'])
def sentiment():
    data = request.json
    sentiment = analyze_sentiment(data.get("text", ""))
    return jsonify(sentiment)

@app.route('/ai/search', methods=['POST'])
def natural_language_search():
    data = request.json
    notes_list = data.get('notes')
    query = data.get('query')

    # Validate input types
    if not isinstance(notes_list, list) or not isinstance(query, str):
        return jsonify({"error": "Invalid input format"}), 400

    # Filter out invalid or empty notes
    cleaned_notes = [note.strip() for note in notes_list if isinstance(note, str) and note.strip()]

    if not cleaned_notes or not query.strip():
        return jsonify({"error": "All notes must be non-empty strings and query must not be empty"}), 400

    # Vectorization and similarity
    vectorizer = TfidfVectorizer()
    corpus = cleaned_notes + [query]
    vectors = vectorizer.fit_transform(corpus)
    similarities = cosine_similarity(vectors[-1], vectors[:-1]).flatten()
    most_relevant_index = similarities.argmax()

    return jsonify({
        "matched_note": cleaned_notes[most_relevant_index],
        "similarity": float(similarities[most_relevant_index])
    })

@app.route('/ai/chat', methods=['POST'])
def chat_with_notes():
    data = request.json
    notes_list = data.get('notes')
    question = data.get('question')

    if not notes_list or not question:
        return jsonify({"error": "Missing notes or question"}), 400

    # Clean and filter valid notes
    cleaned_notes = [note for note in notes_list if isinstance(note, str) and note.strip()]
    if not cleaned_notes:
        return jsonify({"error": "No valid notes provided"}), 400

    # Generate embeddings
    notes_embeddings = model.encode(cleaned_notes)
    question_embedding = model.encode([question])[0]

    # Calculate similarities
    similarities = util.cos_sim(question_embedding, notes_embeddings)[0]  # Shape: (n,)
    
    # Find the best match
    best_index = similarities.argmax().item()
    best_similarity = similarities[best_index].item()
    best_note = cleaned_notes[best_index]

    if best_similarity > 0.3:
        return jsonify({
            "answer": best_note[:500],
            "similarity": best_similarity,
            "matched_note_index": best_index
        })
    else:
        return jsonify({
            "answer": "No relevant answer found in your notes.",
            "similarity": best_similarity
        })


@app.route('/ai/tags', methods=['POST'])
def extract_tags():
    data = request.json
    note = data.get('note')

    if not note:
        return jsonify({"error": "Missing note"}), 400

    vectorizer = CountVectorizer(stop_words='english', max_features=5)
    X = vectorizer.fit_transform([note])
    tags = vectorizer.get_feature_names_out()

    return jsonify({"tags": tags.tolist()})

if __name__ == '__main__':
    app.run(port=8000, debug=True)
