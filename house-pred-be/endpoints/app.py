import json
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)


def extract_features(request_data):
    city_code = request_data["city_code"]
    district_code = request_data["district_code"]
    furnishing_code = request_data["furnishing_code"]
    floor = request_data["floor"]
    total_area = request_data["total_area"]
    kitchen_area = request_data["kitchen_area"]
    rooms_number = request_data["rooms_number"]
    amenities_score = request_data["amenities_score"]
    education_score = request_data["education_score"]
    transportation_score = request_data["rooms_number"]

    return [city_code, district_code, furnishing_code, floor, total_area, kitchen_area, rooms_number,
            amenities_score, education_score, transportation_score
            ]


@app.route("/predict", methods=["POST"])
@cross_origin()
def predict():
    # Load the trained model
    model = joblib.load(
        "C:\\Users\\OlenaPeretiatko\\Desktop\\property-valuation-forecaster\\house-pred-be\\model\\house_price_pred_model.jlb",
    )

    data = request.get_json()
    features = extract_features(data)
    reshaped_features = np.array(features).reshape(1, -1)
    prediction = model.predict(reshaped_features)

    response = {"prediction": int(prediction[0])}
    return jsonify(response)


def load_json_file(file_path):
    try:
        with open(file_path, "r") as file:
            data = json.load(file)
        return jsonify(data)

    except FileNotFoundError:
        return jsonify({"error": f"File '{file_path}' not found."}), 404

    except json.JSONDecodeError as err:
        return jsonify({"error": f"Error decoding JSON file: {err}"}), 500


@app.route("/cities", methods=["GET"])
@app.route("/districts", methods=["GET"])
@app.route("/furnishing", methods=["GET"])
@app.route("/property_type", methods=["GET"])
@cross_origin()
def get_data():
    route_mapping = {
        "/cities": "../dataset/cities_matching.json",
        "/districts": "../dataset/districts_matching.json",
        "/furnishing": "../dataset/furnishing_matching.json",
        "/property_type": "../dataset/property_type_matching.json",
    }
    path = route_mapping.get(request.path)
    if path is None:
        return jsonify({"error": "Invalid route"}), 404
    return load_json_file(path)


if __name__ == "__main__":
    app.run()
