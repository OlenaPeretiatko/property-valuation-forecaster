import json
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)


def extract_features(request_data):
    admin_district = request_data["admin_district"]
    hist_district = request_data["hist_district"]
    street = request_data["street"]
    wall = request_data["wall"]
    area_total = request_data["area_total"]
    rooms = request_data["rooms"]

    return [admin_district, hist_district, street, wall, area_total, rooms]


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


@app.route("/hist_districts", methods=["GET"])
@app.route("/admin_districts", methods=["GET"])
@app.route("/streets", methods=["GET"])
@app.route("/walls", methods=["GET"])
@cross_origin()
def get_data():
    route_mapping = {
        "/hist_districts": "../dataset/hist_districts_matching.json",
        "/admin_districts": "../dataset/admin_districts_matching.json",
        "/streets": "../dataset/streets_matching.json",
        "/walls": "../dataset/walls_matching.json",
    }
    path = route_mapping.get(request.path)
    if path is None:
        return jsonify({"error": "Invalid route"}), 404
    return load_json_file(path)


if __name__ == "__main__":
    app.run()
