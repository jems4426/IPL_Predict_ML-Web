from flask import Flask, request, jsonify
import pickle
import pandas as pd
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app)

# ✅ Google Drive direct download link
MODEL_URL = "https://drive.google.com/uc?id=1-fjQLYqRi4TNApFgEVM8DF09PtX7rziE"
MODEL_PATH = "pipe.pkl"

# ✅ Download model if not present
if not os.path.exists(MODEL_PATH):
    print("⬇️ Downloading model...")
    response = requests.get(MODEL_URL)
    with open(MODEL_PATH, "wb") as f:
        f.write(response.content)
    print("✅ Model downloaded")

# ✅ Load model
pipe = pickle.load(open(MODEL_PATH, "rb"))

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    df = pd.DataFrame([{
        'batting_team': data['batting_team'],
        'bowling_team': data['bowling_team'],
        'city': data['city'],
        'runs_left': float(data['runs_left']),
        'balls_left': float(data['balls_left']),
        'wickets': float(data['wickets']),
        'total_runs_x': float(data['target']),
        'crr': float(data['crr']),
        'rrr': float(data['rrr'])
    }])

    result = pipe.predict_proba(df)

    return jsonify({
        'win': round(result[0][1] * 100, 2),
        'lose': round(result[0][0] * 100, 2)
    })

if __name__ == '__main__':
    app.run(debug=True)
