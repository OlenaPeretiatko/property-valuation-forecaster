import json
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

def get_sold_price():
    data = [
        {"id": 1, "label": "January", "price": 90000},
        {"id": 2, "label": "February", "price": 91000},
        {"id": 3, "label": "March", "price": 91200},
        {"id": 4, "label": "April", "price": 93000},
        {"id": 5, "label": "May", "price": 91900},
        {"id": 6, "label": "June", "price": 95000},
        {"id": 7, "label": "July", "price": 96000},
        {"id": 8, "label": "August", "price": 94000},
        {"id": 9, "label": "September", "price": 98000},
        {"id": 10, "label": "October", "price": 99000},
        {"id": 11, "label": "November", "price": 100000},
        {"id": 12, "label": "December", "price": 101000},
        {"id": 1, "label": "January", "price": 102000}
    ]
    return data

def get_neighborhood_price():
    data = [
        {"id": 1, "label": "Neighborhood 1", "price": 90000},
        {"id": 2, "label": "Neighborhood 2", "price": 91000},
        {"id": 3, "label": "Neighborhood 3", "price": 90200},
        {"id": 4, "label": "Neighborhood 4", "price": 91400},
        {"id": 5, "label": "Neighborhood 5", "price": 91000},
        {"id": 6, "label": "Neighborhood 6", "price": 91500}
    ]
    return data

def get_house_count_by_price_range():
    data = [
        {"id": 1, "label": "< $200k", "value": 20},
        {"id": 2, "label": "$200k - $300k", "value": 30},
        {"id": 3, "label": "$300k - $400k", "value": 25},
        {"id": 4, "label": "$400k - $500k", "value": 15},
        {"id": 5, "label": "> $500k", "value": 10},
    ]
    return data

def get_feature_importance():
    data = [
        {"id": 1, "label": "Location", "value": 80},
        {"id": 2, "label": "Size", "value": 70},
        {"id": 3, "label": "Age", "value": 60},
        {"id": 4, "label": "Amenities", "value": 85},
        {"id": 5, "label": "Schools", "value": 75},
        {"id": 6, "label": "Transport", "value": 65},
    ]
    return data

def extract_features(request_data):
    city_code = request_data["city_code"]
    district_code = request_data["district_code"]
    furnishing_code = request_data["furnishing_code"]
    property_type_code = request_data["property_type_code"]
    housing_type_code = request_data["housing_type_code"]
    reparation_code = request_data["reparation_code"]
    total_area = request_data["total_area"]
    rooms_number = request_data["rooms_number"]
    kitchen_area = request_data["kitchen_area"]
    hospitals_score = request_data["hospitals_score"]
    schools_score = request_data["schools_score"]
    cafes_score = request_data["cafes_score"]
    shopping_centers_score = request_data["shopping_centers_score"]
    transport_interchanges_score = request_data["transport_interchanges_score"]
    park_areas_score = request_data["park_areas_score"]
    kindergartens_score = request_data["kindergartens_score"]
    floor = request_data["floor"]
    superficiality = request_data["superficiality"]

    return [city_code, district_code, furnishing_code, property_type_code, housing_type_code, reparation_code,
            total_area, rooms_number, kitchen_area, hospitals_score, schools_score,
            cafes_score, shopping_centers_score, transport_interchanges_score,
            park_areas_score, kindergartens_score, floor, superficiality]


@app.route("/sold_price", methods=["GET"])
@cross_origin()
def sold_price():
    data = get_sold_price()
    return jsonify(data)

@app.route("/neighborhood_price", methods=["GET"])
@cross_origin()
def neighborhood_price():
    data = get_neighborhood_price()
    return jsonify(data)

@app.route("/house_count_by_price_range", methods=["GET"])
@cross_origin()
def house_count_by_price_range():
    data = get_house_count_by_price_range()
    return jsonify(data)

@app.route("/feature_importance", methods=["GET"])
@cross_origin()
def feature_importance():
    data = get_feature_importance()
    return jsonify(data)


@app.route("/predict", methods=["POST"])
@cross_origin()
def predict():
    # Load the trained model
    model = joblib.load(
        "../model/lviv_price_pred_model.jlb",
    )

    data = request.get_json()
    features = extract_features(data)
    if (data["city_code"] == 1):
        model = joblib.load(
        "../model/lviv_price_pred_model.jlb")
    elif (data["city_code"] == 2):
        model = joblib.load(
        "../model/kyiv_price_pred_model.jlb",
    )
    reshaped_features = np.array(features).reshape(1, -1)
    prediction = model.predict(reshaped_features)

    response = {"prediction": int(prediction[0])}
    return jsonify(response)

def load_json_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as file:
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
@app.route("/reparation", methods=["GET"])
@app.route("/housing_type", methods=["GET"])
@cross_origin()
def get_data():
    route_mapping = {
        "/cities": "../data_matching/cities_matching.json",
        "/districts": "../data_matching/districts_matching.json",
        "/furnishing": "../data_matching/furnishing_matching.json",
        "/property_type": "../data_matching/property_type_matching.json",
        "/reparation": "../data_matching/reparation_matching.json",
        "/housing_type": "../data_matching/housing_type_matching.json",
    }
    path = route_mapping.get(request.path)
    if path is None:
        return jsonify({"error": "Invalid route"}), 404
    return load_json_file(path)

if __name__ == "__main__":
    app.run()
