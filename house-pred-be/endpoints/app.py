import json
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import joblib
import numpy as np
import os
import pandas as pd

app = Flask(__name__)
CORS(app)
APP_ROOT = os.path.dirname(os.path.abspath(__file__))


def get_sold_price(city_code: int):
    df = get_city_dataset(city_code)
    df = df[["date_posted", "price"]].copy()
    df["date_posted"] = pd.to_datetime(df["date_posted"])
    df_grouped = (
        df.groupby(df["date_posted"].dt.to_period("M")).price.mean().reset_index()
    )

    df_grouped["price"] = df_grouped["price"].astype(int)
    df_grouped["Month"] = df_grouped["date_posted"].dt.strftime("%B, %Y")
    df_grouped.drop("date_posted", axis=1, inplace=True)
    df_grouped.columns = ["price", "label"]

    return df_grouped[["label", "price"]].to_dict(orient="records")


def get_neighborhood_price(city_code: int):
    df = get_city_dataset(city_code)
    df = df[["district", "price"]].copy()
    df_grouped = df.groupby(df["district"]).price.mean().reset_index()

    df_grouped["price"] = df_grouped["price"].astype(int)
    df_grouped.columns = ["label", "price"]

    return df_grouped.to_dict(orient="records")


def get_house_count_by_price_range(city_code: int):
    df = get_city_dataset(city_code)
    df = df[["price"]].copy()
    bins = [0, 50000, 100000, 150000, 200000, 300000, float("inf")]
    labels = [
        "< $50k",
        "$50k - $100k",
        "$100k - $150k",
        "$150k - $200k",
        "$200k - $300k",
        "> $300k",
    ]

    df["label"] = pd.cut(df["price"], bins=bins, labels=labels, right=False)
    count_series = df["label"].value_counts().reindex(labels, fill_value=0)

    result_df = count_series.reset_index()
    result_df.columns = ["label", "value"]

    return result_df.to_dict(orient="records")


def get_feature_importance(city_code: int):
    model = get_city_model(city_code)

    feature_names = [
        "city_code",
        "district_code",
        "furnishing_code",
        "property_type_code",
        "housing_type_code",
        "reparation_code",
        "total_area",
        "rooms_number",
        "kitchen_area",
        "hospitals_score",
        "schools_score",
        "cafes_score",
        "shopping_centers_score",
        "transport_interchanges_score",
        "park_areas_score",
        "kindergartens_score",
        "floor",
        "superficiality",
    ]
    importances = model.feature_importances_
    importance_percentages = (importances * 100).round(2)
    feature_importance_df = pd.DataFrame(
        {"label": feature_names, "value": importance_percentages}
    )
    return feature_importance_df.to_dict(orient="records")


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

    return [
        city_code,
        district_code,
        furnishing_code,
        property_type_code,
        housing_type_code,
        reparation_code,
        total_area,
        rooms_number,
        kitchen_area,
        hospitals_score,
        schools_score,
        cafes_score,
        shopping_centers_score,
        transport_interchanges_score,
        park_areas_score,
        kindergartens_score,
        floor,
        superficiality,
    ]


@app.route("/sold_price", methods=["GET"])
@cross_origin()
def sold_price():
    city_code = request.args.get("city_code", default=None, type=int)
    if not city_code:
        return jsonify({"error": "No city_code provided"}), 400

    data = get_sold_price(city_code)
    return jsonify(data)


@app.route("/neighborhood_price", methods=["GET"])
@cross_origin()
def neighborhood_price():
    city_code = request.args.get("city_code", default=None, type=int)
    if not city_code:
        return jsonify({"error": "No city_code provided"}), 400

    data = get_neighborhood_price(city_code)
    return jsonify(data)


@app.route("/house_count_by_price_range", methods=["GET"])
@cross_origin()
def house_count_by_price_range():
    city_code = request.args.get("city_code", default=None, type=int)
    if not city_code:
        return jsonify({"error": "No city_code provided"}), 400

    data = get_house_count_by_price_range(city_code)
    return jsonify(data)


@app.route("/feature_importance", methods=["GET"])
@cross_origin()
def feature_importance():
    city_code = request.args.get("city_code", default=None, type=int)
    if not city_code:
        return jsonify({"error": "No city_code provided"}), 400

    data = get_feature_importance(city_code)
    return jsonify(data)


@app.route("/predict", methods=["POST"])
@cross_origin()
def predict():
    data = request.get_json()
    # Load the trained model
    model = get_city_model(data["city_code"])

    features = extract_features(data)
    reshaped_features = np.array(features).reshape(1, -1)
    prediction = model.predict(reshaped_features)

    response = {"prediction": int(prediction[0])}
    print(response)
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


def get_city_model(city_code: int):
    model_name = f"{'lviv' if city_code == 1 else 'kyiv'}_price_pred_model.jlb"
    return joblib.load(os.path.join(APP_ROOT, "..", "model", model_name))


def get_city_dataset(city_code: int) -> pd.DataFrame:
    dataset_name = f"{'lviv' if city_code == 1 else 'kyiv'}.csv"
    return pd.read_csv(os.path.join(APP_ROOT, "..", "datasets", dataset_name))


@app.route("/cities", methods=["GET"])
@app.route("/districts", methods=["GET"])
@app.route("/furnishing", methods=["GET"])
@app.route("/property_type", methods=["GET"])
@app.route("/reparation", methods=["GET"])
@app.route("/housing_type", methods=["GET"])
@cross_origin()
def get_data():
    route_mapping = {
        "/cities": os.path.join(
            APP_ROOT, "..", "data_matching", "cities_matching.json"
        ),
        "/districts": os.path.join(
            APP_ROOT, "..", "data_matching", "districts_matching.json"
        ),
        "/furnishing": os.path.join(
            APP_ROOT, "..", "data_matching", "furnishing_matching.json"
        ),
        "/property_type": os.path.join(
            APP_ROOT, "..", "data_matching", "property_type_matching.json"
        ),
        "/reparation": os.path.join(
            APP_ROOT, "..", "data_matching", "reparation_matching.json"
        ),
        "/housing_type": os.path.join(
            APP_ROOT, "..", "data_matching", "housing_type_matching.json"
        ),
    }
    path = route_mapping.get(request.path)
    if path is None:
        return jsonify({"error": "Invalid route"}), 404
    return load_json_file(path)


if __name__ == "__main__":
    app.run()
