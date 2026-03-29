from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import pandas as pd
import mysql.connector

app = Flask(__name__)
CORS(app)


db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="manthan",   
    database="sales_db"
)

cursor = db.cursor()


sales_data = [12, 19, 7, 25, 18, 22, 15, 28, 23, 30, 26, 33]


@app.route("/")
def home():
    return "Sales Forecast Backend Running"


@app.route("/register", methods=["POST"])
def register():
    data = request.json

    name = data["name"]
    email = data["email"]
    password = data["password"]

    hashed_password = generate_password_hash(password)

    query = "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)"
    values = (name, email, hashed_password)

    cursor.execute(query, values)
    db.commit()

    return jsonify({"message": "User registered successfully"})


@app.route("/login", methods=["POST"])
def login():
    data = request.json

    email = data["email"]
    password = data["password"]

    query = "SELECT id, name, email, password FROM users WHERE email=%s"
    values = (email,)

    cursor.execute(query, values)
    user = cursor.fetchone()

    if user and check_password_hash(user[3], password):
        return jsonify({"message": "Login successful"})
    else:
        return jsonify({"message": "Invalid credentials"}), 401


@app.route("/upload", methods=["POST"])
def upload():
    global sales_data

    file = request.files["file"]
    df = pd.read_csv(file)

    if "sales" in df.columns:
        sales_data = df["sales"].tolist()
    else:
        numeric_cols = df.select_dtypes(include=["number"]).columns
        if len(numeric_cols) > 0:
            sales_data = df[numeric_cols[0]].tolist()

    return jsonify({
        "message": "File uploaded successfully",
        "rows": len(df)
    })


@app.route("/sales", methods=["GET"])
def sales():
    return jsonify(sales_data)


if __name__ == "__main__":
    app.run(debug=True)