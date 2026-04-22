from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import pandas as pd
import mysql.connector
import numpy as np

app = Flask(__name__)
CORS(app)

# ================= DATABASE =================
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="manthan",
    database="sales_db"
)

cursor = db.cursor()

# ================= GLOBAL DATA =================
sales_data = [10, 20, 30, 40, 50]

# ================= HOME =================
@app.route("/")
def home():
    return "Sales Forecast Backend Running"

# ================= REGISTER =================
@app.route("/register", methods=["POST"])
def register():
    data = request.json

    name = data["name"]
    email = data["email"]
    password = data["password"]

    hashed_password = generate_password_hash(password)

    query = "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)"
    cursor.execute(query, (name, email, hashed_password))
    db.commit()

    return jsonify({"message": "User registered successfully"})

# ================= LOGIN =================
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    email = data["email"]
    password = data["password"]

    query = "SELECT id, name, email, password FROM users WHERE email=%s"
    cursor.execute(query, (email,))
    user = cursor.fetchone()

    if user and check_password_hash(user[3], password):
        return jsonify({"message": "Login successful"})
    else:
        return jsonify({"message": "Invalid credentials"}), 401

# ================= FILE UPLOAD =================
@app.route("/upload", methods=["POST"])
def upload():
    global sales_data

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    try:
        # Handle both CSV and Excel
        if file.filename.endswith(".csv"):
            df = pd.read_csv(file)
        else:
            df = pd.read_excel(file)

        # Auto-detect column
        if "sales" in df.columns:
            sales_data = df["sales"].tolist()
        elif "Revenue" in df.columns:
            sales_data = df["Revenue"].tolist()
        elif "Units_Sold" in df.columns:
            sales_data = df["Units_Sold"].tolist()
        else:
            numeric_cols = df.select_dtypes(include=["number"]).columns
            if len(numeric_cols) > 0:
                sales_data = df[numeric_cols[0]].tolist()
            else:
                return jsonify({"error": "No numeric column found"}), 400

        return jsonify({
            "message": "File uploaded successfully",
            "rows": len(df),
            "columns": list(df.columns)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ================= GET SALES =================
@app.route("/sales", methods=["GET"])
def sales():
    return jsonify(sales_data)

# ================= SIMPLE FORECAST =================
def generate_forecast(data, periods=3):
    x = np.arange(len(data))
    y = np.array(data)

    # Linear regression
    slope, intercept = np.polyfit(x, y, 1)

    future_x = np.arange(len(data), len(data) + periods)
    forecast = (slope * future_x + intercept).tolist()

    return forecast

# ================= MODEL FIT =================
def fit_line(data):
    x = np.arange(len(data))
    y = np.array(data)

    slope, intercept = np.polyfit(x, y, 1)
    fitted = (slope * x + intercept).tolist()

    # Accuracy (simple)
    error = np.mean(np.abs((y - fitted) / y)) * 100
    accuracy = 100 - error

    return fitted, round(accuracy, 2), round(error, 2)

# ================= FORECAST API =================
@app.route("/forecast", methods=["GET"])
def forecast():
    predicted = generate_forecast(sales_data, periods=3)
    fitted, accuracy, mape = fit_line(sales_data)

    return jsonify({
        "sales": sales_data,
        "fit": fitted,
        "forecast": predicted,
        "accuracy": accuracy,
        "mape": mape,
        "future_labels": ["Next 1", "Next 2", "Next 3"]
    })

# ================= RUN =================
if __name__ == "__main__":
    app.run(debug=True)