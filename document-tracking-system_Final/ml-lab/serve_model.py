from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)
model = joblib.load("model/document_classifier.joblib")

@app.post("/predict")
def predict():
    data = request.get_json()
    text = (data.get("title", "") + " " + data.get("description", "")).lower()
    category = model.predict([text])[0]
    probabilities = model.predict_proba([text])[0]
    confidence = max(probabilities)
    return jsonify({
        "category": category,
        "confidence": float(confidence),
        "modelVersion": "v1"
    })

if __name__ == "__main__":
    app.run(port=5001)