from transformers import pipeline

summarizer = pipeline("summarization")

def summarize_note(text):
    if len(text.split()) < 50:
        return text  # Skip summarization for short notes
    summary = summarizer(text, max_length=100, min_length=30, do_sample=False)
    return summary[0]['summary_text']
