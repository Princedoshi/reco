from flask import Flask, jsonify
import pickle
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

movies_dict = pickle.load(open('movie_dict.pkl', 'rb'))
similarity = pickle.load(open('similarity.pkl', 'rb'))

movies = pd.DataFrame(movies_dict)
movie_titles = movies['title'].tolist()


@app.route('/')
def hello_world():
    return 'hello world'


@app.route('/api/movies', methods=['GET'])
def get_movie_titles():
    return jsonify(movie_titles)


@app.route('/recommend/<movie>', methods=['GET', 'POST'])
def recommend(movie):
    try:
        movie_index = movies[movies['title'] == movie].index[0]
        distances = similarity[movie_index]
        movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]

        recommended_movies = []
        for i in movies_list:
            recommended_movies.append(movies.iloc[i[0]].title)

        return jsonify({"recommendations": recommended_movies})
    except IndexError:
        return jsonify({"error": "Movie not found"}), 404



if __name__ == '__main__':
    app.run(debug=True)
