from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin
from collections import defaultdict

import nltk

from nltk import sent_tokenize, word_tokenize, PorterStemmer, pos_tag
from nltk.corpus import stopwords

import numpy as np
import pandas as pd
import re

from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold, cross_val_score, learning_curve
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import SVC, LinearSVC
from sklearn.metrics import classification_report, f1_score, accuracy_score, confusion_matrix
from sklearn.pipeline import Pipeline, FeatureUnion
from sklearn.tree import DecisionTreeClassifier

from scipy.sparse import hstack
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from imblearn.over_sampling import SMOTE
from joblib import dump, load

import logging


# def load_model():
#     """
#     This function loads the hate speech ML model.
#     """
#     return load('model.joblib')


def class_to_name(class_label):
    """
    This function is used to map a numeric
    feature name to a particular class.
    """
    if class_label == 0:
        return "Offensive speech"
    elif class_label == 1:
        return "Not offensive speech"
    else:
        return "No label"


def generate_stopwords():
    """
    Generate stopwords for NLP
    """
    all_stopwords = stopwords.words('english')
    excludes = ['rt', '&#57361;']
    all_stopwords.extend(excludes)

    return all_stopwords


def analyzer(doc: str):
    all_stopwords = generate_stopwords()
    stemmer = PorterStemmer()
    words = word_tokenize(doc)
    filtered_words = [word for word in words if not word in all_stopwords and word.isalnum()]
    
    return [stemmer.stem(word) for word in filtered_words if word not in ['URLHERE', 'MENTIONHERE']]


def tokenize_without_stemming(doc: str):
    all_stopwords = generate_stopwords()
    stemmer = PorterStemmer()
    words = word_tokenize(doc)
    filtered_words = [word for word in words if not word in all_stopwords and word.isalnum()]
    
    return [word for word in filtered_words if word not in ['URLHERE', 'MENTIONHERE']]


def preprocess(text: str):
    """
    Preprocess text before feeding to model
    """
    space_pattern = '\s+'
    url_regex = ('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|'
        '[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')
    symbol_regex = '&#[^\s]+'
    mention_regex = '@[^\s]+'
    
    parsed_text = text.lower()
    parsed_text = re.sub(space_pattern, ' ', parsed_text)
    parsed_text = re.sub(symbol_regex, ' ', parsed_text)
    parsed_text = re.sub(url_regex, 'URLHERE', parsed_text)
    parsed_text = re.sub(mention_regex, 'MENTIONHERE', parsed_text)

#     words = word_tokenize(parsed_tweet)
    
#     filtered_words = [word for word in words if not word in all_stopwords and word.isalnum()]
#     porter = PorterStemmer()
#     stemmed = [porter.stem(word) for word in filtered_words if word not in ['URLHERE', 'MENTIONHERE']]
    
#     pos = pos_tag(filtered_words)
    
    return parsed_text


def tokenize(tweet):
    stemmer = PorterStemmer()
    tweet = " ".join(re.split("[^a-zA-Z]*", tweet.lower())).strip()
    tokens = [stemmer.stem(t) for t in tweet.split()]
    return tokens


def getSentiment(df):
    sentiment_analyzer = SentimentIntensityAnalyzer()
    scores = defaultdict(list)
    for i in range(len(df)):
        score_dict = sentiment_analyzer.polarity_scores(df[i])
        scores['neg'].append(score_dict['neg'])
        scores['neu'].append(score_dict['neu'])
        scores['pos'].append(score_dict['pos'])
        scores['compound'].append(score_dict['compound'])
    return np.array(pd.DataFrame(scores))

        
def get_prediction(model, message: str):
    """
    Runs the model on user input and returns prediction
    """
    pred = model.predict([message])

    return class_to_name(pred[0])

app = Flask(__name__)

# Create a new handler for log messages that will send them to standard error
handler = logging.StreamHandler()

# Add a formatter that makes use of our new contextual information
log_format = "%(asctime)s\t%(levelname)s\t%(user_id)s\t%(ip)s\t%(method)s\t%(url)s\t%(message)s"
formatter = logging.Formatter(log_format)
handler.setFormatter(formatter)

logging.info('Logging to a file...')
# Finally, attach the handler to our logger
app.logger.addHandler(handler)


CORS(app, resources={r'/predict': {"origins": "http://localhost:3000"}})
api = Api(app)


class HelloWorld(Resource):
    def get(self):
        return {'hello': 'cross-origin-world'}


class Predict(Resource):
    def get(self):
        input = request.args['input']

        parsed_tweet = preprocess(input)
        words = tokenize_without_stemming(parsed_tweet)

        res = {}
        res['prediction'] = get_prediction(model, input)
        res['words'] = words

        return res

try:
    model = load('model.joblib')
except:
    logging.exception('ERROR: Failed to load model')


api.add_resource(HelloWorld, '/')
api.add_resource(Predict, '/predict')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)