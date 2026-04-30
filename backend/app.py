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

pipe = None


# 🔽 Download model safely
def download_model():
    print("⬇️ Downloading model...")

    gdown.download(
        id=FILE_ID,
        output=MODEL_PATH,
        quiet=False
    )

    size = os.path.getsize(MODEL_PATH)
    print(f"📦 Model size: {size}")

    # Your model ~85MB → validate properly
    if size < 80000000:
        raise Exception("❌ Model corrupted or incomplete")

    print("✅ Model download complete")


# 🔥 Load model safely (NO CRASH)
def load_model():
    global pipe

    try:
        if not os.path.exists(MODEL_PATH):
            download_model()

        with open(MODEL_PATH, "rb") as f:
            pipe = pickle.load(f)

        print("✅ Model loaded successfully")

    except Exception as e:
        print("💥 Model loading failed:", e)
        pipe = None


# 🚀 Run model load at startup
load_model()


# ✅ Health check route (IMPORTANT for Render)
@app.route('/')
def home():
    return "IPL Predictor Backend Running ✅"


# 🎯 Prediction API
@app.route('/predict', methods=['POST'])
def predict():
    if pipe is None:
        return jsonify({"error": "Model not loaded"}), 500

    data = request.json

    try:
        df = pd.DataFrame([{
            'batting_team': data.get('batting_team'),
            'bowling_team': data.get('bowling_team'),
            'city': data.get('city'),
            'runs_left': float(data.get('runs_left', 0)),
            'balls_left': float(data.get('balls_left', 0)),
            'wickets': float(data.get('wickets', 0)),
            'total_runs_x': float(data.get('target', 0)),
            'crr': float(data.get('crr', 0)),
            'rrr': float(data.get('rrr', 0))
        }])

        result = pipe.predict_proba(df)

        return jsonify({
            'win': round(result[0][1] * 100, 2),
            'lose': round(result[0][0] * 100, 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ❌ DO NOT REMOVE (needed for local testing only)
if __name__ == '__main__':
    app.run(debug=True)
