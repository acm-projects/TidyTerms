from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

current_tab_url = ""



@app.route("/data", methods=['POST'])
def handle_data():

    global current_tab_url
    data = request.get_json()
    current_tab_url = data['tab']

    response = {
        'message': 'Data received successfully',
    }

    # Return a JSON response with status 200
    return jsonify(response), 200



@app.route("/")
def home_page():
    return jsonify({"current tab": current_tab_url})



