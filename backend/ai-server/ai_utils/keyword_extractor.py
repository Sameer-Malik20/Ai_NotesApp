import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
nltk.download('punkt')

def extract_keywords(text, num_keywords=5):
    vectorizer = TfidfVectorizer(stop_words='english')
    X = vectorizer.fit_transform([text])
    indices = X[0].toarray().argsort()[0][-num_keywords:]
    features = vectorizer.get_feature_names_out()
    return [features[i] for i in reversed(indices)]
