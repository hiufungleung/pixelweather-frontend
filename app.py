import os

from flask import Flask, request, render_template, jsonify, g
import mysql.connector
import re
from constants import *
import jwt
import datetime
import bcrypt
import redis
import json

app = Flask(__name__)

SECRET_KEY = "YAKINIKU_DECO7381"

# r = redis.Redis(host='149.28.188.65', port=6379, db=0)

connection = mysql.connector.connect(
    host="149.28.188.65", user="yakiniku", password="30624700", database="pixel_weather"
)

cursor = connection.cursor(dictionary=True)

NO_TOKEN_NEEDED_APIs = [
    "hello_world",
    "handle_signup",
    "handle_login",
    "suburbs",
    "weathers",
    "get_posts",
]

TOKENS = {}


# test use
# email: chantaiman@gmail.com
# password: Aa.12345678
test_token = {
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJleHAiOjE3MzIyNDE4NTl9.dFsLTifMpm0uBUKWpslVO6JLkc3XhwB70ug4r0Zrh9w": 2
}


def save_token_store():
    """Development only"""
    with open("tokens.json", "w") as f:
        json.dump(TOKENS, f)


def load_token_store():
    """Development only"""
    global TOKENS
    try:
        with open("tokens.json", "r") as f:
            TOKENS = json.load(f)
            TOKENS.update(test_token)
    except FileNotFoundError:
        TOKENS = {}


# Helper function to generate JWT token
def generate_token(user_id: int) -> str:
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.now(datetime.UTC)
        + datetime.timedelta(days=TOKEN_VALID_DURATION),
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token


# Helper function to verify JWT token
def verify_token(token: str):
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded_token
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def is_token_whitelisted(token) -> bool:
    # return r.get(token) is not None
    return token in TOKENS


def is_valid_username(username: str) -> bool:
    return len(username) <= USERNAME_LENGTH


def is_valid_email(email: str) -> bool:
    email_regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return re.match(email_regex, email) is not None


def is_valid_password(password: str) -> bool:
    # password_regex = r'^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
    # return re.match(password_regex, password) is not None
    return True


# Helper function to hash a password
def hash_password(password: str) -> bytes:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed_password


# Helper function to check if the password matches the hash
def verify_password(password, hashed_password):
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))


@app.before_request
def check_token():
    if request.endpoint not in NO_TOKEN_NEEDED_APIs:
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": MISSING_TOKEN}), 400

        # Handle the Bearer prefix
        if token.startswith("Bearer "):
            token = token[len("Bearer ") :]

        if not is_token_whitelisted(token):
            return jsonify({"error": INVALID_TOKEN}), 401
        decoded_token = verify_token(token)
        if not decoded_token:
            return jsonify({"error": INVALID_TOKEN}), 401

        # Save the processed token, used for the real request function
        g.token = token
        g.decoded_token = decoded_token


@app.after_request
def save_token(response):
    save_token_store()
    return response


# def refresh_token(response):
#     """Refresh token after request"""
#     if hasattr(g, 'token'):
#         decoded_token = g.decoded_token
#         new_token = generate_token(decoded_token['user_id'])
#         response.headers.set('Authorization', 'Bearer ' + new_token)
#
#         # Development only
#         del TOKENS[g.token]
#         TOKENS[new_token] = decoded_token.get("user_id")
#
#     return response


@app.errorhandler(500)
def internal_error(error):
    message = INTERNAL_SERVER_ERROR
    if os.getenv("FLASK_ENV") == "development":
        message += " " + str(error)
    return jsonify({"error": message}), 500


# @app.teardown_appcontext
# def shutdown(exception=None):
#     save_token_store()


@app.route("/")
def hello_world():
    return "Hello World!"


@app.route("/handle_signup", methods=["POST"])
def handle_signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    username = data.get("username")

    # Check if key is missing
    if not email or not password or not username:
        return jsonify({"error": MISSING_SIGNUP_INFO}), 400

    # Check if email, username or password is valid
    email_valid = is_valid_email(email)
    password_valid = is_valid_password(password)
    username_valid = len(username) <= USERNAME_LENGTH

    if not email_valid or not password_valid or not username_valid:
        message = {
            "email": {
                "valid": bool(email_valid),
                "error": REQUIREMENT_EMAIL if not bool(email_valid) else "",
            },
            "username": {
                "valid": bool(username_valid),
                "error": REQUIREMENT_USERNAME if not bool(username_valid) else "",
            },
            "password": {
                "valid": bool(password_valid),
                "error": REQUIREMENT_PASSWORD if not bool(password_valid) else "",
            },
        }
        return jsonify({"error": MALFORMED_EMAIL_PASSWORD, "message": message}), 422

    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    existing_user = cursor.fetchone()
    if existing_user:
        return jsonify({"error": CONFLICT_EMAIL}), 409

    # Hash password
    hashed_password = hash_password(password)

    # Try to insert
    try:
        cursor.execute(
            "INSERT INTO users (email, username, password) VALUES (%s, %s, %s)",
            (
                email,
                username,
                hashed_password,
            ),
        )
        connection.commit()

        user_id = cursor.lastrowid
        token = generate_token(user_id)

        # Development only
        TOKENS[token] = user_id

        return (
            jsonify(
                {
                    "message": SUCCESS_SIGN_UP,
                    "data": {"email": email, "username": username, "token": token},
                }
            ),
            201,
        )

    except mysql.connector.Error as err:
        raise err


@app.route("/handle_login", methods=["POST"])
def handle_login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": MISSING_LOGIN_INFO}), 400

    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if user:
        stored_hashed_password = user.get("password")
        if verify_password(password, stored_hashed_password):
            user_id = user.get("id")
            token = generate_token(user_id)

            # Development only
            TOKENS[token] = user_id

            return (
                jsonify(
                    {
                        "message": SUCCESS_LOGIN,
                        "data": {
                            "email": email,
                            "username": user.get("username"),
                            "token": token,
                        },
                    }
                ),
                200,
            )
        else:
            # wrong password
            return jsonify({"error": INVALID_CREDENTIALS}), 401
    else:
        # No such user
        return jsonify({"error": INVALID_CREDENTIALS}), 401


@app.route("/handle_logout", methods=["POST"])
def handle_logout():
    token = request.headers.get("Authorization")

    # Delete token from the whitelist
    # r.delete(token)
    # Development only
    del TOKENS[token]
    return jsonify({"message": SUCCESS_LOGOUT}), 200


@app.route("/handle_update_email", methods=["PATCH"])
def handle_update_email():
    data = request.get_json()
    new_email = data.get("email")

    # Get token from @app.before_request
    token = g.token
    decoded_token = g.decoded_token
    user_id = decoded_token.get("user_id")

    if not new_email:
        return jsonify({"error": MISSING_EMAIL}), 400

    if not is_valid_email(new_email):
        return (
            jsonify(
                {
                    "error": MALFORMED_EMAIL,
                    "message": {"email": {"valid": False, "error": REQUIREMENT_EMAIL}},
                }
            ),
            422,
        )

    cursor.execute("SELECT * FROM users WHERE email = %s", (new_email,))
    existing_user = cursor.fetchone()
    if existing_user:
        return jsonify({"error": CONFLICT_EMAIL}), 409

    try:
        cursor.execute(
            "UPDATE users SET email = %s WHERE id = %s", (new_email, user_id)
        )
        connection.commit()

        return (
            jsonify(
                {
                    "message": SUCCESS_EMAIL_CHANGED,
                    "data": {"email": new_email},
                }
            ),
            200,
        )
    except mysql.connector.Error as err:
        raise err


@app.route("/handle_update_password", methods=["PATCH"])
def handle_update_password():
    data = request.get_json()
    current_password = data.get("current_password")
    new_password = data.get("new_password")

    decoded_token = g.decoded_token
    user_id = decoded_token.get("user_id")

    if not current_password or not new_password:
        return jsonify({"error": MISSING_OLD_NEW_PASSWORD}), 400

    if not is_valid_password(current_password):
        return (
            jsonify(
                {
                    "error": MALFORMED_PASSWORD,
                    "message": {
                        "password": {"valid": False, "error": REQUIREMENT_PASSWORD}
                    },
                }
            ),
            422,
        )

    try:
        cursor.execute("SELECT password FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()

        if not user or not verify_password(current_password, user.get("password")):
            return jsonify({"error": INCORRECT_PASSWORD}), 403

        hashed_password = hash_password(new_password)

        cursor.execute(
            "UPDATE users SET password = %s WHERE id = %s", (hashed_password, user_id)
        )
        connection.commit()

        return jsonify({"message": SUCCESS_PASSWORD_CHANGED}), 200
    except mysql.connector.Error as err:
        raise err


@app.route("/handle_update_username", methods=["PATCH"])
def handle_update_username():
    data = request.get_json()
    new_username = data.get("username")

    decoded_token = g.decoded_token
    user_id = decoded_token.get("user_id")

    if not new_username:
        return jsonify({"error": MISSING_NEW_USERNAME}), 400

    if not is_valid_username(new_username):
        return (
            jsonify(
                {
                    "error": MALFORMED_USERNAME,
                    "message": {"username": False, "error": REQUIREMENT_USERNAME},
                }
            ),
            422,
        )

    try:
        # Update username
        cursor.execute(
            "UPDATE users SET username = %s WHERE id = %s", (new_username, user_id)
        )
        connection.commit()

        return (
            jsonify(
                {
                    "message": SUCCESS_USERNAME_CHANGED,
                    "data": {"username": new_username},
                }
            ),
            200,
        )
    except mysql.connector.Error as err:
        raise err


@app.route("/handle_delete_account", methods=["DELETE"])
def handle_delete_account():
    data = request.get_json()
    password = data.get("password")

    token = g.token
    decoded_token = g.decoded_token
    user_id = decoded_token.get("user_id")

    if not password:
        return jsonify({"error": MISSING_PASSWORD}), 400

    try:
        # Get current stored hashed password
        cursor.execute("SELECT password FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()

        # Wrong given current password
        if not user or not verify_password(password, user.get("password")):
            return jsonify({"error": INCORRECT_PASSWORD}), 403

        # Delete account
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        connection.commit()

        # Development only
        del TOKENS[token]
        return jsonify({"message": SUCCESS_DATA_DELETED}), 200

    except mysql.connector.Error as err:
        raise err


if __name__ == "__main__":
    load_token_store()
    app.run(debug=True, host="0.0.0.0", port=5050, threaded=False)
