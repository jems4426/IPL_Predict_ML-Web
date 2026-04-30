from flask import Flask, request, jsonify
import pickle
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

pipe = pickle.load(open('pipe.pkl', 'rb'))

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    df = pd.DataFrame([{
        'batting_team': data['batting_team'],
        'bowling_team': data['bowling_team'],
        'city': data['city'],
        'runs_left': data['runs_left'],
        'balls_left': data['balls_left'],
        'wickets': data['wickets'],
        'total_runs_x': data['target'],
        'crr': data['crr'],
        'rrr': data['rrr']
    }])

    result = pipe.predict_proba(df)

    return jsonify({
        'win': round(result[0][1]*100,2),
        'lose': round(result[0][0]*100,2)
    })
if __name__ == '__main__':
    app.run(debug=True)