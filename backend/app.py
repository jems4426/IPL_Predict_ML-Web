from flask import Flask, request, jsonify
import pickle
import pandas as pd
from flask_cors import CORS
import os
import gdown

app = Flask(__name__)
CORS(app)

MODEL_PATH = "pipe.pkl"
FILE_ID = "1-fjQLYqRi4TNApFgEVM8DF09PtX7rziE"

# ✅ Always re-download (prevents corrupted file issue)
def download_model():
    print("⬇️ Downloading model...")
    url = f"https://drive.google.com/uc?id={FILE_ID}"
    gdown.download(url, MODEL_PATH, quiet=False)

    # ✅ Validate file size (basic check)
    if os.path.getsize(MODEL_PATH) < 1000000:  # <1MB means wrong file
        raise Exception("Downloaded file is invalid!")

    print("✅ Model ready")

# 🔥 Ensure model is correct
try:
    download_model()
    pipe = pickle.load(open(MODEL_PATH, "rb"))
except Exception as e:
    print("❌ Model loading failed:", e)
    pipe = None

@app.route('/predict', methods=['POST'])
def predict():
    if pipe is None:
        return jsonify({"error": "Model not loaded"}), 500

    data = request.json

    try:
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

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
