from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

# Temporary database
users = {}

# ------------------------
# Home Route
# ------------------------

@app.route("/")
def home():
    return "Sales Forecast Backend Running"


# ------------------------
# Register API
# ------------------------

@app.route("/register", methods=["POST"])
def register():

    data = request.json

    name = data["name"]
    email = data["email"]
    password = data["password"]

    users[email] = {
        "name": name,
        "password": password
    }

    return jsonify({"message": "User registered successfully"})


# ------------------------
# Login API
# ------------------------

@app.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data["email"]
    password = data["password"]

    if email in users and users[email]["password"] == password:
        return jsonify({"message": "Login successful"})
    else:
        return jsonify({"message": "Invalid credentials"})


# ------------------------
# Upload CSV API
# ------------------------

@app.route("/upload", methods=["POST"])
def upload():

    file = request.files["file"]

    df = pd.read_csv(file)

    return jsonify({
        "message": "File uploaded successfully",
        "rows": len(df)
    })


# ------------------------
# Sales Data API (For Dashboard Chart)
# ------------------------

@app.route("/sales")
def sales():

    data = [500, 700, 600, 900, 1200]

    return jsonify(data)


# ------------------------
# Run Server
# ------------------------

if __name__ == "__main__":
    app.run(debug=True)